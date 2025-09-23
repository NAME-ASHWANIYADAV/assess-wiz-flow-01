import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// The URL for your deployed FastAPI backend.
// It's recommended to set this as an environment variable in your Supabase project settings.
const FASTAPI_BACKEND_URL = Deno.env.get('FASTAPI_BACKEND_URL') || 'https://natwest-backend.onrender.com';

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
    // The request from the frontend should contain the quiz_id (as submissionId) and the user's answers.
    const { submissionId, answers } = await req.json();
    const quiz_id = submissionId;

    // Get the Authorization header from the incoming request to forward it to the backend.
    const authHeader = req.headers.get('Authorization');

    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Authorization header is required' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!quiz_id || !answers || !Array.isArray(answers)) {
        return new Response(JSON.stringify({ error: 'submissionId and a valid answers array are required' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    }

    // Transform the answers array to match the FastAPI backend's UserAnswer model.
    // FastAPI expects: { question_number: int, answer: str, confidence: Optional[str] }
    // Frontend sends: { questionId: any, answer: any, confidence: any, ... }
    const user_answers_for_fastapi = answers.map(a => ({
      question_number: parseInt(a.questionId, 10), // Ensure question_number is an integer
      answer: a.answer,
      confidence: a.confidence // Forwarding confidence if available
    }));

    // Call the FastAPI backend's /quizzes/{quiz_id}/submit endpoint
    const fastapiResponse = await fetch(`${FASTAPI_BACKEND_URL}/quizzes/${quiz_id}/submit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Forward the user's authorization token to the FastAPI backend for authentication
        'Authorization': authHeader,
      },
      body: JSON.stringify(user_answers_for_fastapi),
    });

    // Handle errors from the FastAPI backend
    if (!fastapiResponse.ok) {
      const errorBody = await fastapiResponse.text();
      console.error('FastAPI backend returned an error:', fastapiResponse.status, errorBody);
      let errorDetail;
      try {
        // FastAPI often returns error details in a 'detail' key
        errorDetail = JSON.parse(errorBody).detail;
      } catch {
        errorDetail = errorBody;
      }
      throw new Error(errorDetail || 'Failed to evaluate submission via FastAPI backend');
    }

    // Get the successful evaluation result from the FastAPI backend
    const evaluationResult = await fastapiResponse.json();

    // Forward the result from the FastAPI backend to the frontend
    return new Response(JSON.stringify(evaluationResult), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in evaluate-assignment function:', error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});