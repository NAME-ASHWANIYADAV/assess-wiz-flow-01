import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Brain, Clock, CheckCircle, Send, ArrowRight, ArrowLeft, User } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Question {
  id: string;
  type: 'multiple_choice' | 'short_answer' | 'essay' | 'true_false';
  question: string;
  options?: string[];
  points: number;
}

const TakeAssignment = () => {
  const { shareLink } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [assignment, setAssignment] = useState<any>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [learnerName, setLearnerName] = useState('');
  const [isStarted, setIsStarted] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{[key: string]: string}>({});
  const [results, setResults] = useState<any>(null);
  const [timeStarted, setTimeStarted] = useState<Date | null>(null);

  useEffect(() => {
    fetchAssignment();
  }, [shareLink]);

  const fetchAssignment = async () => {
    if (!shareLink) return;
    setIsLoading(true);
    const { data, error } = await supabase
      .from('assignments')
      .select('*')
      .eq('share_link', shareLink)
      .eq('is_active', true)
      .maybeSingle();

    if (error || !data) {
      toast({ title: "Assignment Not Found", description: "The link is invalid or disabled.", variant: "destructive" });
      navigate('/');
      return;
    }

    setAssignment(data);
    
    if (data.questions && Array.isArray(data.questions)) {
      const formattedQuestions: Question[] = data.questions.map((q: any) => ({
        id: q.id.toString(),
        type: q.type,
        question: q.question,
        options: q.options || [],
        points: q.points || 10
      }));
      setQuestions(formattedQuestions);
    }
    setIsLoading(false);
  };

  const handleStartAssignment = () => {
    if (!learnerName.trim()) {
      toast({ title: "Name Required", description: "Please enter your name to begin.", variant: "destructive" });
      return;
    }
    setTimeStarted(new Date());
    setIsStarted(true);
  };

  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const submitAssignment = async () => {
    setIsSubmitting(true);
    try {
      const userAnswers = Object.entries(answers).map(([questionId, answer]) => ({
        question_number: parseInt(questionId, 10),
        answer: answer,
      }));

      const submissionRequest = {
        user_name: learnerName,
        user_answers: userAnswers
      };

      // Use the correct URL (localhost for testing, Render for production)
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://127.0.0.1:8000';

      const response = await fetch(`${backendUrl}/quizzes/${assignment.id}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submissionRequest),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: "Evaluation failed." }));
        throw new Error(errorData.detail);
      }

      const submissionResult = await response.json();
      const { results: aiResults } = submissionResult;
      const maxScore = questions.reduce((sum, q) => sum + q.points, 0);
      const adaptedFeedback = aiResults.feedback.map((fb: any) => {
        const question = questions.find(q => parseInt(q.id, 10) === fb.question_number);
        return {
          questionId: fb.question_number,
          isCorrect: fb.correct,
          feedback: fb.ai_feedback,
          score: fb.correct ? (question?.points || 10) : 0,
          maxScore: question?.points || 10,
        };
      });

      setResults({
        score: aiResults.score,
        maxScore: maxScore,
        percentage: maxScore > 0 ? Math.round((aiResults.score / maxScore) * 100) : 0,
        timeSpent: timeStarted ? Math.round((new Date().getTime() - timeStarted.getTime()) / 1000 / 60) : 0,
        feedback: adaptedFeedback,
        overallFeedback: aiResults.summary,
      });
      
      setIsCompleted(true);
      toast({ title: "Assessment Complete!", description: "Your results have been generated." });

    } catch (error: any) {
      toast({ title: "Submission Failed", description: error.message, variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const progress = questions.length > 0 ? ((currentQuestionIndex + 1) / questions.length) * 100 : 0;

  if (isLoading || !assignment) {
    return <div className="min-h-screen flex items-center justify-center"><p>Loading...</p></div>;
  }

  if (isCompleted && results) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="max-w-2xl w-full">
          <Card className="p-8 text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
            <h1 className="text-3xl font-bold mb-4">Assessment Complete!</h1>
            <p className="text-gray-600 mb-8">Great job, {learnerName}! Here are your results for "{assignment.title}".</p>
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="p-4 bg-gray-100 rounded-lg"><p className="text-2xl font-bold text-primary">{results.percentage}%</p><p className="text-sm text-gray-500">Final Score</p></div>
              <div className="p-4 bg-gray-100 rounded-lg"><p className="text-2xl font-bold">{results.score}/{results.maxScore}</p><p className="text-sm text-gray-500">Points Earned</p></div>
              <div className="p-4 bg-gray-100 rounded-lg"><p className="text-2xl font-bold">{results.timeSpent}m</p><p className="text-sm text-gray-500">Time Spent</p></div>
            </div>
            <div className="space-y-4 text-left">
              <h3 className="text-lg font-semibold">Detailed Feedback</h3>
              {results.feedback.map((fb: any) => (
                <div key={fb.questionId} className="p-4 border rounded-lg">
                  <div className="flex justify-between mb-2">
                    <span className="font-medium">Question {fb.questionId}</span>
                    <Badge variant={fb.isCorrect ? 'default' : 'destructive'}>{fb.score}/{fb.maxScore} pts</Badge>
                  </div>
                  <p className="text-sm text-gray-600">{fb.feedback}</p>
                </div>
              ))}
              {results.overallFeedback && (
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="font-medium text-blue-800">Overall Feedback</p>
                  <p className="text-sm text-blue-700">{results.overallFeedback}</p>
                </div>
              )}
            </div>
            <Button onClick={() => navigate('/')} className="mt-8 w-full">Return Home</Button>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white"><div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2"><Brain className="w-6 h-6 text-primary" /> <span className="text-xl font-bold">Assess AI Wizard</span></div>
        <Badge variant="outline">{isStarted ? `In Progress - ${learnerName}` : "Ready to Start"}</Badge>
      </div></header>

      <main className="container mx-auto px-6 py-8">
        {!isStarted ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
            <Card className="max-w-2xl mx-auto p-8">
              <h1 className="text-3xl font-bold mb-2">{assignment.title}</h1>
              <p className="text-gray-600 mb-6">{assignment.description}</p>
              <div className="space-y-4 max-w-sm mx-auto">
                <Label htmlFor="learnerName">Please enter your name to begin</Label>
                <div className="flex gap-2">
                  <Input id="learnerName" value={learnerName} onChange={(e) => setLearnerName(e.target.value)} placeholder="Your Name" />
                  <Button onClick={handleStartAssignment} disabled={!learnerName.trim()}>Start Assignment</Button>
                </div>
              </div>
            </Card>
          </motion.div>
        ) : (
          <>
            <Card className="p-6 mb-8">
              <div className="flex justify-between text-sm mb-2"><span>Progress</span><span>{Math.round(progress)}%</span></div>
              <Progress value={progress} />
            </Card>

            <motion.div key={currentQuestionIndex} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}>
              <Card className="p-8">
                <div className="flex justify-between mb-4">
                  <Badge variant="secondary">Question {currentQuestionIndex + 1} of {questions.length}</Badge>
                  <Badge>{currentQuestion.points} points</Badge>
                </div>
                <h2 className="text-2xl font-semibold mb-6">{currentQuestion.question}</h2>
                <div className="space-y-4 mb-8">
                  {currentQuestion.type === 'multiple_choice' && (
                    <RadioGroup value={answers[currentQuestion.id] || ''} onValueChange={(value) => handleAnswerChange(currentQuestion.id, value)}>
                      {currentQuestion.options?.map((option, index) => (
                        <Label key={index} className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-100 cursor-pointer">
                          <RadioGroupItem value={option} id={`option-${index}`} />
                          <span>{option}</span>
                        </Label>
                      ))}
                    </RadioGroup>
                  )}
                  {(currentQuestion.type === 'short_answer' || currentQuestion.type === 'essay') && (
                    <Textarea value={answers[currentQuestion.id] || ''} onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)} placeholder="Your answer..." rows={currentQuestion.type === 'essay' ? 8 : 3} />
                  )}
                </div>
                <div className="flex justify-between items-center">
                  <Button variant="outline" onClick={previousQuestion} disabled={currentQuestionIndex === 0}>Previous</Button>
                  {isLastQuestion ? (
                    <Button onClick={submitAssignment} disabled={isSubmitting}>
                      {isSubmitting ? 'Submitting...' : 'Submit Assessment'}
                    </Button>
                  ) : (
                    <Button onClick={nextQuestion}>Next Question</Button>
                  )}
                </div>
              </Card>
            </motion.div>
          </>
        )}
      </main>
    </div>
  );
};

export default TakeAssignment;