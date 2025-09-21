import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Clock, 
  Brain, 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle,
  XCircle,
  Flag,
  Home
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Assessment = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{[key: number]: number}>({});
  const [timeRemaining, setTimeRemaining] = useState(1800); // 30 minutes
  const [isCompleted, setIsCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const navigate = useNavigate();

  const questions = [
    {
      id: 1,
      question: "What is the main purpose of React's useState hook?",
      options: [
        "To manage component lifecycle",
        "To handle component state",
        "To create side effects",
        "To optimize performance"
      ],
      correctAnswer: 1,
      explanation: "useState is React's built-in hook for managing local state in functional components."
    },
    {
      id: 2,
      question: "Which CSS property is used to create a flexible layout?",
      options: [
        "display: block",
        "display: flex",
        "display: inline",
        "display: table"
      ],
      correctAnswer: 1,
      explanation: "display: flex creates a flexible container that can arrange its children in rows or columns."
    },
    {
      id: 3,
      question: "What does API stand for?",
      options: [
        "Application Programming Interface",
        "Advanced Programming Interface",
        "Automated Program Integration",
        "Application Process Integration"
      ],
      correctAnswer: 0,
      explanation: "API stands for Application Programming Interface, which allows different software applications to communicate."
    },
    {
      id: 4,
      question: "Which JavaScript method is used to add elements to the end of an array?",
      options: [
        "append()",
        "add()",
        "push()",
        "insert()"
      ],
      correctAnswer: 2,
      explanation: "The push() method adds one or more elements to the end of an array and returns the new length."
    },
    {
      id: 5,
      question: "What is the default HTTP method used in HTML forms?",
      options: [
        "POST",
        "GET",
        "PUT",
        "DELETE"
      ],
      correctAnswer: 1,
      explanation: "GET is the default HTTP method for HTML forms, though POST is commonly used for form submissions."
    }
  ];

  useEffect(() => {
    if (timeRemaining > 0 && !isCompleted) {
      const timer = setTimeout(() => setTimeRemaining(timeRemaining - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeRemaining === 0 && !isCompleted) {
      handleSubmitAssessment();
    }
  }, [timeRemaining, isCompleted]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleAnswerSelect = (questionIndex: number, answerIndex: number) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionIndex]: answerIndex
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const calculateScore = () => {
    let correct = 0;
    questions.forEach((question, index) => {
      if (selectedAnswers[index] === question.correctAnswer) {
        correct++;
      }
    });
    return Math.round((correct / questions.length) * 100);
  };

  const handleSubmitAssessment = () => {
    const finalScore = calculateScore();
    setScore(finalScore);
    setIsCompleted(true);
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreMessage = (score: number) => {
    if (score >= 90) return 'Excellent work!';
    if (score >= 70) return 'Good job!';
    if (score >= 50) return 'Keep practicing!';
    return 'More study needed!';
  };

  if (isCompleted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl w-full"
        >
          <Card className="text-center">
            <CardHeader>
              <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4 ${
                score >= 70 ? 'bg-green-100 dark:bg-green-900/20' : 'bg-red-100 dark:bg-red-900/20'
              }`}>
                {score >= 70 ? (
                  <CheckCircle className="w-10 h-10 text-green-600" />
                ) : (
                  <XCircle className="w-10 h-10 text-red-600" />
                )}
              </div>
              <CardTitle className="text-3xl">Assessment Complete!</CardTitle>
              <CardDescription>{getScoreMessage(score)}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className={`text-6xl font-bold mb-2 ${getScoreColor(score)}`}>
                  {score}%
                </div>
                <p className="text-muted-foreground">
                  You answered {questions.filter((_, index) => selectedAnswers[index] === questions[index].correctAnswer).length} out of {questions.length} questions correctly
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Question Review</h3>
                {questions.map((question, index) => {
                  const isCorrect = selectedAnswers[index] === question.correctAnswer;
                  return (
                    <div key={index} className="text-left p-4 rounded-lg bg-muted/50">
                      <div className="flex items-start gap-3">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-1 ${
                          isCorrect ? 'bg-green-100 dark:bg-green-900/20' : 'bg-red-100 dark:bg-red-900/20'
                        }`}>
                          {isCorrect ? (
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          ) : (
                            <XCircle className="w-4 h-4 text-red-600" />
                          )}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium mb-2">{question.question}</h4>
                          <p className="text-sm text-muted-foreground mb-2">
                            <strong>Correct answer:</strong> {question.options[question.correctAnswer]}
                          </p>
                          {!isCorrect && selectedAnswers[index] !== undefined && (
                            <p className="text-sm text-red-600 mb-2">
                              <strong>Your answer:</strong> {question.options[selectedAnswers[index]]}
                            </p>
                          )}
                          <p className="text-sm text-muted-foreground">
                            {question.explanation}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex gap-4 justify-center">
                <Button onClick={() => navigate('/dashboard')} variant="outline">
                  <Home className="w-4 h-4 mr-2" />
                  Dashboard
                </Button>
                <Button onClick={() => window.location.reload()}>
                  Take Again
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  const currentQ = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const answeredQuestions = Object.keys(selectedAnswers).length;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/dashboard" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Dashboard</span>
              </Link>
              <div className="h-6 w-px bg-border"></div>
              <div className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-primary" />
                <span className="font-semibold">JavaScript Assessment</span>
              </div>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4" />
                <span className="font-mono">{formatTime(timeRemaining)}</span>
              </div>
              <div className="text-sm text-muted-foreground">
                Question {currentQuestion + 1} of {questions.length}
              </div>
            </div>
          </div>
          
          <div className="mt-4">
            <Progress value={progress} className="h-2" />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Question Navigation Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="text-lg">Questions</CardTitle>
                <CardDescription>
                  {answeredQuestions} of {questions.length} answered
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-5 lg:grid-cols-3 gap-2">
                  {questions.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentQuestion(index)}
                      className={`w-10 h-10 rounded-lg font-medium text-sm transition-all ${
                        currentQuestion === index
                          ? 'bg-primary text-white'
                          : selectedAnswers[index] !== undefined
                          ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300'
                          : 'bg-muted hover:bg-muted/80 text-muted-foreground'
                      }`}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>
                
                <div className="mt-6 space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-primary rounded"></div>
                    <span>Current</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-100 dark:bg-green-900/20 rounded"></div>
                    <span>Answered</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-muted rounded"></div>
                    <span>Not answered</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Question Area */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentQuestion}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-xl mb-2">
                          Question {currentQuestion + 1}
                        </CardTitle>
                        <CardDescription className="text-lg font-medium text-foreground leading-relaxed">
                          {currentQ.question}
                        </CardDescription>
                      </div>
                      <Button variant="ghost" size="icon" className="flex-shrink-0">
                        <Flag className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {currentQ.options.map((option, index) => (
                      <motion.div
                        key={index}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <button
                          onClick={() => handleAnswerSelect(currentQuestion, index)}
                          className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                            selectedAnswers[currentQuestion] === index
                              ? 'border-primary bg-primary/10'
                              : 'border-border hover:border-border/80 hover:bg-muted/50'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                              selectedAnswers[currentQuestion] === index
                                ? 'border-primary bg-primary'
                                : 'border-border'
                            }`}>
                              {selectedAnswers[currentQuestion] === index && (
                                <CheckCircle className="w-4 h-4 text-white" />
                              )}
                            </div>
                            <span className="font-medium">
                              {String.fromCharCode(65 + index)}. {option}
                            </span>
                          </div>
                        </button>
                      </motion.div>
                    ))}

                    <div className="flex justify-between pt-6">
                      <Button
                        variant="outline"
                        onClick={handlePreviousQuestion}
                        disabled={currentQuestion === 0}
                      >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Previous
                      </Button>

                      {currentQuestion === questions.length - 1 ? (
                        <Button
                          onClick={handleSubmitAssessment}
                          disabled={answeredQuestions < questions.length}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          Submit Assessment
                        </Button>
                      ) : (
                        <Button
                          onClick={handleNextQuestion}
                          disabled={selectedAnswers[currentQuestion] === undefined}
                        >
                          Next
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Assessment;