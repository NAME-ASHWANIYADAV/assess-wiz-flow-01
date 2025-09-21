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
import { Brain, Clock, CheckCircle, AlertCircle, Send, ArrowRight, ArrowLeft } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Question {
  id: string;
  type: 'multiple_choice' | 'short_answer' | 'essay' | 'true_false';
  question: string;
  options?: string[];
  correctAnswer?: string;
  explanation?: string;
  points: number;
}

const TakeAssignment = () => {
  const { shareLink } = useParams();
  const [assignment, setAssignment] = useState<any>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{[key: string]: string}>({});
  const [learnerName, setLearnerName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [timeStarted] = useState(new Date());
  
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    fetchAssignment();
  }, [shareLink]);

  const fetchAssignment = async () => {
    if (!shareLink) return;

    const { data, error } = await supabase
      .from('assignments')
      .select('*')
      .eq('share_link', shareLink)
      .eq('is_active', true)
      .maybeSingle();

    if (error || !data) {
      toast({
        title: "Assignment Not Found",
        description: "The assignment link is invalid or has been disabled.",
        variant: "destructive"
      });
      navigate('/');
      return;
    }

    setAssignment(data);
    
    // Set questions from assignment data
    if (data.questions && Array.isArray(data.questions)) {
      const formattedQuestions: Question[] = data.questions.map((q: any) => ({
        id: q.id.toString(),
        type: q.type === 'multiple-choice' ? 'multiple_choice' : 
              q.type === 'true-false' ? 'true_false' :
              q.type === 'short-answer' ? 'short_answer' : 'essay',
        question: q.question,
        options: q.options || [],
        correctAnswer: q.correctAnswer,
        explanation: q.explanation,
        points: q.points || 10
      }));
      setQuestions(formattedQuestions);
    }
  };

  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const previousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const submitAssignment = async () => {
    if (!learnerName.trim()) {
      toast({
        title: "Name Required",
        description: "Please enter your name to submit the assessment.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Create submission first
      const submissionData = {
        assignment_id: assignment.id,
        learner_name: learnerName,
        answers: Object.entries(answers).map(([questionId, answer]) => ({
          questionId,
          answer,
          question: questions.find(q => q.id === questionId)?.question
        })),
        ai_feedback: [],
        total_score: 0,
        max_score: questions.reduce((sum, q) => sum + q.points, 0)
      };

      const { data: submission, error } = await supabase
        .from('assessment_submissions')
        .insert(submissionData)
        .select()
        .single();

      if (error) throw error;

      // Get AI evaluation
      toast({
        title: "Evaluating...",
        description: "AI is analyzing your responses",
      });

      const evaluationResponse = await supabase.functions.invoke('evaluate-assignment', {
        body: {
          submissionId: submission.id,
          questions: questions,
          answers: Object.entries(answers).map(([questionId, answer]) => ({
            questionId: parseInt(questionId),
            answer,
            question: questions.find(q => q.id === questionId)?.question,
            correctAnswer: questions.find(q => q.id === questionId)?.correctAnswer,
            options: questions.find(q => q.id === questionId)?.options
          }))
        }
      });

      if (evaluationResponse.error) {
        console.error('Evaluation error:', evaluationResponse.error);
        // Continue with basic scoring if AI evaluation fails
      }

      const evaluationData = evaluationResponse.data || {};
      const finalScore = evaluationData.totalScore || 0;
      const feedback = evaluationData.feedback || [];

      // Update submission with AI results
      await supabase
        .from('assessment_submissions')
        .update({
          total_score: finalScore,
          ai_feedback: feedback
        })
        .eq('id', submission.id);

      // Show results
      setResults({
        score: finalScore,
        maxScore: submissionData.max_score,
        percentage: Math.round((finalScore / submissionData.max_score) * 100),
        timeSpent: Math.round((new Date().getTime() - timeStarted.getTime()) / 1000 / 60),
        feedback
      });
      
      setIsCompleted(true);

      toast({
        title: "Assessment Complete!",
        description: "Your results have been generated with AI feedback.",
      });

    } catch (error: any) {
      toast({
        title: "Submission Failed",
        description: error.message || "Failed to submit assessment",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!assignment) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Loading assignment...</p>
        </div>
      </div>
    );
  }

  if (isCompleted && results) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background/50 to-primary/5 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl w-full"
        >
          <Card className="p-8 text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            
            <h1 className="text-3xl font-bold mb-4">Assessment Complete!</h1>
            <p className="text-muted-foreground mb-8">
              Great job completing "{assignment.title}". Here are your results:
            </p>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="p-4 bg-muted/30 rounded-lg">
                <p className="text-2xl font-bold text-primary">{results.percentage}%</p>
                <p className="text-sm text-muted-foreground">Final Score</p>
              </div>
              <div className="p-4 bg-muted/30 rounded-lg">
                <p className="text-2xl font-bold">{results.score}/{results.maxScore}</p>
                <p className="text-sm text-muted-foreground">Points Earned</p>
              </div>
              <div className="p-4 bg-muted/30 rounded-lg">
                <p className="text-2xl font-bold">{results.timeSpent}m</p>
                <p className="text-sm text-muted-foreground">Time Spent</p>
              </div>
            </div>

            <div className="space-y-4 mb-8">
              {results.feedback && results.feedback.length > 0 ? (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Detailed Feedback</h3>
                  {results.feedback.map((feedback: any, index: number) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">Question {feedback.questionId}</span>
                        <Badge variant={feedback.isCorrect ? "default" : "secondary"}>
                          {feedback.score}/{feedback.maxScore} points
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{feedback.feedback}</p>
                      {feedback.suggestions && (
                        <p className="text-sm text-blue-600">{feedback.suggestions}</p>
                      )}
                    </div>
                  ))}
                  {results.overallFeedback && (
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="font-medium text-blue-900 mb-2">Overall Feedback</p>
                      <p className="text-sm text-blue-700">{results.overallFeedback}</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-left">
                  <div className="flex items-start space-x-3">
                    <Brain className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-blue-900">AI Evaluation in Progress</p>
                      <p className="text-sm text-blue-700">
                        Your detailed feedback and personalized insights will be available shortly. 
                        The AI is analyzing your responses to provide constructive feedback.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={() => navigate('/')} className="px-8">
                Return Home
              </Button>
              <Button variant="outline" onClick={() => navigate('/auth')} className="px-8">
                Create Account to Track Progress
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/50 to-primary/5">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-primary to-primary/70 rounded-lg flex items-center justify-center">
                  <Brain className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold">EduGenius AI</span>
              </div>
              <Badge variant="secondary">Assessment</Badge>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>In Progress</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Assignment Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <Card className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold mb-2">{assignment.title}</h1>
                {assignment.description && (
                  <p className="text-muted-foreground">{assignment.description}</p>
                )}
              </div>
              <Badge variant="outline">
                {questions.length} Questions
              </Badge>
            </div>
            
            {/* Progress */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress: Question {currentQuestionIndex + 1} of {questions.length}</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} />
            </div>
          </Card>
        </motion.div>

        {/* Name Input (if not provided) */}
        {!learnerName && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-8"
          >
            <Card className="p-6">
              <div className="max-w-md">
                <Label htmlFor="learnerName" className="text-lg font-semibold">
                  Enter Your Name
                </Label>
                <p className="text-muted-foreground mb-4">
                  Please provide your name to track your progress
                </p>
                <Input
                  id="learnerName"
                  value={learnerName}
                  onChange={(e) => setLearnerName(e.target.value)}
                  placeholder="Your full name"
                  className="text-lg"
                />
              </div>
            </Card>
          </motion.div>
        )}

        {/* Question */}
        {learnerName && (
          <motion.div
            key={currentQuestionIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="p-8">
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <Badge variant="outline">
                    Question {currentQuestionIndex + 1}
                  </Badge>
                  <Badge>
                    {currentQuestion.points} points
                  </Badge>
                </div>
                
                <h2 className="text-2xl font-semibold mb-4">
                  {currentQuestion.question}
                </h2>
              </div>

              {/* Answer Input */}
              <div className="space-y-4 mb-8">
                {currentQuestion.type === 'multiple_choice' && (
                  <RadioGroup
                    value={answers[currentQuestion.id] || ''}
                    onValueChange={(value) => handleAnswerChange(currentQuestion.id, value)}
                  >
                    {currentQuestion.options?.map((option, index) => (
                      <div key={index} className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-muted/30 transition-colors">
                        <RadioGroupItem value={option} id={`option-${index}`} />
                        <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                          {option}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                )}

                {currentQuestion.type === 'short_answer' && (
                  <Input
                    value={answers[currentQuestion.id] || ''}
                    onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                    placeholder="Enter your answer..."
                    className="text-lg p-4"
                  />
                )}

                {currentQuestion.type === 'essay' && (
                  <Textarea
                    value={answers[currentQuestion.id] || ''}
                    onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                    placeholder="Write your essay response..."
                    rows={8}
                    className="text-lg p-4"
                  />
                )}
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between">
                <Button
                  variant="outline"
                  onClick={previousQuestion}
                  disabled={currentQuestionIndex === 0}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Previous
                </Button>

                {isLastQuestion ? (
                  <Button
                    onClick={submitAssignment}
                    disabled={isSubmitting}
                    className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Submit Assessment
                      </>
                    )}
                  </Button>
                ) : (
                  <Button onClick={nextQuestion}>
                    Next
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                )}
              </div>
            </Card>
          </motion.div>
        )}

        {/* Answer Status */}
        {learnerName && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-8"
          >
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Question Status</h3>
              <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
                {questions.map((question, index) => (
                  <button
                    key={question.id}
                    onClick={() => setCurrentQuestionIndex(index)}
                    className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-medium transition-colors ${
                      index === currentQuestionIndex
                        ? 'bg-primary text-primary-foreground'
                        : answers[question.id]
                        ? 'bg-green-100 text-green-700 hover:bg-green-200'
                        : 'bg-muted hover:bg-muted/70'
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default TakeAssignment;