import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

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
    const { topic, description, questionType, numQuestions, difficulty } = await req.json();

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

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { 
            role: 'system', 
            content: 'You are an expert educational content creator. Generate high-quality assessment questions that test real understanding. Always respond with valid JSON only, no additional text.' 
          },
          { role: 'user', content: prompt }
        ],
        max_tokens: 2000,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Failed to generate questions');
    }

    const data = await response.json();
    const generatedContent = data.choices[0].message.content;

    console.log('Generated content:', generatedContent);

    // Parse the JSON response
    let questions;
    try {
      questions = JSON.parse(generatedContent);
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
    console.error('Error in generate-assignment function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});