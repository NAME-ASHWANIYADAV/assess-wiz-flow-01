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
    const { submissionId, questions, answers } = await req.json();

    if (!answers || !Array.isArray(answers)) {
      throw new Error('Answers are required');
    }

    console.log('Evaluating submission:', submissionId, 'with', answers.length, 'answers');

    // Create evaluation prompt
    const evaluationPrompt = `You are an expert educational evaluator. Please evaluate the following student responses and provide detailed feedback.

    Questions and Answers:
    ${answers.map((item, index) => `
    Question ${index + 1}: ${item.question}
    ${item.options ? `Options: ${item.options.join(', ')}` : ''}
    ${item.correctAnswer ? `Correct Answer: ${item.correctAnswer}` : ''}
    Student Answer: ${item.answer || 'No answer provided'}
    `).join('\n')}

    Please provide:
    1. A score for each question (0 to full points)
    2. Detailed feedback for each answer explaining what was correct/incorrect
    3. Constructive suggestions for improvement
    4. Overall performance summary

    Return the response as JSON with this exact structure:
    {
      "totalScore": number,
      "feedback": [
        {
          "questionId": number,
          "score": number,
          "maxScore": number,
          "feedback": "Detailed feedback text",
          "isCorrect": boolean,
          "suggestions": "Improvement suggestions"
        }
      ],
      "overallFeedback": "Overall performance summary and encouragement"
    }`;

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
            content: 'You are a helpful and encouraging educational evaluator. Provide constructive feedback that helps students learn. Always respond with valid JSON only.' 
          },
          { role: 'user', content: evaluationPrompt }
        ],
        max_tokens: 2000,
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Failed to evaluate responses');
    }

    const data = await response.json();
    const evaluationContent = data.choices[0].message.content;

    console.log('AI evaluation response:', evaluationContent);

    // Parse the JSON response
    let evaluation;
    try {
      evaluation = JSON.parse(evaluationContent);
    } catch (parseError) {
      console.error('Failed to parse evaluation JSON:', parseError);
      console.error('Raw content:', evaluationContent);
      
      // Fallback evaluation
      evaluation = {
        totalScore: Math.floor(answers.length * 0.7 * 10), // Basic scoring
        feedback: answers.map((item, index) => ({
          questionId: parseInt(item.questionId),
          score: item.answer ? 7 : 0,
          maxScore: 10,
          feedback: item.answer ? "Good effort on this question!" : "No answer was provided.",
          isCorrect: !!item.answer,
          suggestions: "Keep practicing and review the material."
        })),
        overallFeedback: "Thank you for completing the assignment. Keep up the good work!"
      };
    }

    // Validate and ensure structure
    evaluation.totalScore = evaluation.totalScore || 0;
    evaluation.feedback = evaluation.feedback || [];
    evaluation.overallFeedback = evaluation.overallFeedback || "Assignment evaluated successfully.";

    console.log('Final evaluation:', evaluation);

    return new Response(JSON.stringify(evaluation), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in evaluate-assignment function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});