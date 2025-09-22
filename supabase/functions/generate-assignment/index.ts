import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const geminiApiKey = Deno.env.get('GEMINI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Request received:", req.method, req.url);
    const body = await req.json();
    console.log("Request body:", body);

    const { topic, description, questionType, numQuestions, difficulty, model } = body;

    if (!topic) {
      throw new Error('Topic is required');
    }

    console.log('Generating assignment with:', { topic, questionType, numQuestions, difficulty });

    // Create a detailed prompt for generating questions
    const prompt = `Create ${numQuestions} ${difficulty} level ${questionType} questions about "${topic}".
    
    ${description ? `Additional context: ${description}` : ''}
    
    Requirements:
    - Each question should be educational and test understanding of the topic
    - For multiple-choice questions, provide 4 options with exactly one correct answer
    - For true-false questions, provide a clear statement
    - For short-answer questions, provide the expected answer
    - Include explanations for the correct answers
    - Make questions progressively challenging within the ${difficulty} difficulty level
    
    Return the response as a JSON array with this exact structure:
    [
      {
        "id": 1,
        "question": "Question text here",
        "type": "${questionType}",
        "options": ["Option A", "Option B", "Option C", "Option D"], // Only for multiple-choice
        "correctAnswer": "Correct answer or option letter",
        "explanation": "Explanation of why this is correct",
        "points": 10
      }
    ]
    
    For true-false questions, use options: ["True", "False"]
    For short-answer questions, omit the options field entirely.`;

    if (!geminiApiKey) {
      console.error('GEMINI_API_KEY is not set');
      throw new Error('GEMINI_API_KEY is not set');
    }

    const requestedModel = (model as string) || 'gemini-2.5-pro';
    const modelsToTry = Array.from(new Set([
      requestedModel,
      'gemini-2.5-pro',
      'gemini-2.5-flash',
      'gemini-1.5-pro',
      'gemini-1.5-flash',
    ]));

    let data: any | null = null;
    let lastError: any = null;

    for (const m of modelsToTry) {
      try {
        console.log('Attempting Gemini model:', m);
        const resp = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${m}:generateContent?key=${geminiApiKey}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{
              role: 'user',
              parts: [{ text: `You are an expert educational content creator. Generate high-quality assessment questions that test real understanding. Always respond with valid JSON only, no additional text.\n\n${prompt}` }]
            }],
            generationConfig: {
              temperature: 0.4,
              maxOutputTokens: 4096,
              response_mime_type: 'application/json'
            }
          }),
        });

        const responseBody = await resp.json();
        if (!resp.ok) {
          console.error("Gemini API Error:", responseBody.error?.message);
          throw new Error(responseBody.error?.message || `Gemini error (${resp.status})`);
        }

        data = responseBody;
        console.log('Gemini success with model:', m);
        break;
      } catch (err) {
        console.error('Gemini attempt failed:', m, err);
        lastError = err;
      }
    }

    if (!data) {
      throw lastError || new Error('Failed to generate questions with Gemini');
    }

    // Extract text from all parts if present
    const parts = data?.candidates?.[0]?.content?.parts;
    let generatedContent = '';
    if (Array.isArray(parts)) {
      generatedContent = parts.map((p: any) => p?.text || '').join('\n').trim();
    } else if (typeof data?.candidates?.[0]?.content?.text === 'string') {
      generatedContent = data.candidates[0].content.text;
    }

    if (!generatedContent) {
      const finishReason = data?.candidates?.[0]?.finishReason;
      console.error('Gemini unexpected response:', JSON.stringify(data));
      // Retry once with fewer questions and strict JSON forcing
      try {
        const reducedCount = Math.max(3, Math.ceil((numQuestions || 10) / 2));
        console.log('Retrying with reduced questions due to empty content/finishReason', finishReason, '->', reducedCount);
        const resp2 = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${requestedModel}:generateContent?key=${geminiApiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{
              role: 'user',
              parts: [{ text: `You are an expert educational content creator. Always respond with strict JSON only, no extra text. Keep outputs concise. Create ${reducedCount} ${difficulty} level ${questionType} questions about "${topic}" using the same JSON schema as before.` }]
            }],
            generationConfig: {
              temperature: 0.4,
              maxOutputTokens: 3072,
              response_mime_type: 'application/json'
            }
          }),
        });
        const body2 = await resp2.json();
        const parts2 = body2?.candidates?.[0]?.content?.parts;
        if (Array.isArray(parts2)) {
          generatedContent = parts2.map((p: any) => p?.text || '').join('\n').trim();
        } else if (typeof body2?.candidates?.[0]?.content?.text === 'string') {
          generatedContent = body2.candidates[0].content.text;
        }
      } catch (retryErr) {
        console.error('Retry failed:', retryErr);
      }

      if (!generatedContent) {
        throw new Error('AI returned an unexpected response');
      }
    }

    console.log('Generated content:', generatedContent);

    // Parse the JSON response
    let questions;
    try {
      let jsonText = String(generatedContent).trim();
      if (jsonText.startsWith('```')) {
        jsonText = jsonText.replace(/^```(json)?\n?/i, '').replace(/\n?```$/, '');
      }
      // Try direct parse
      try {
        const parsed = JSON.parse(jsonText);
        questions = Array.isArray(parsed) ? parsed : parsed?.questions;
      } catch (_) {
        // Fallback: extract first JSON array from text
        const first = jsonText.indexOf('[');
        const last = jsonText.lastIndexOf(']');
        if (first !== -1 && last !== -1 && last > first) {
          const slice = jsonText.slice(first, last + 1);
          questions = JSON.parse(slice);
        } else {
          throw new Error('No JSON array found in model output');
        }
      }
    } catch (parseError) {
      console.error('Failed to parse JSON:', parseError);
      console.error('Raw content:', generatedContent);
      throw new Error('Failed to parse AI response as JSON');
    }

    // Validate the structure
    if (!Array.isArray(questions)) {
      throw new Error('Invalid response format: expected array');
    }

    // Ensure each question has required fields
    questions = questions.map((q, index) => ({
      id: index + 1,
      question: q.question || '',
      type: questionType,
      options: q.options || (questionType === 'true-false' ? ['True', 'False'] : undefined),
      correctAnswer: q.correctAnswer || '',
      explanation: q.explanation || '',
      points: q.points || 10
    }));

    console.log('Processed questions:', questions);

    return new Response(JSON.stringify({ questions }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in generate-assignment function:', error.message, error.stack);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});