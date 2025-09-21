import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  ChevronRight, 
  ChevronLeft, 
  Flag, 
  Heart, 
  Brain, 
  Zap, 
  Star,
  BarChart3,
  Target,
  Award,
  RotateCcw,
  Volume2
} from 'lucide-react';

interface Question {
  id: number;
  type: 'multiple-choice' | 'true-false' | 'fill-blank' | 'drag-drop' | 'matching';
  question: string;
  options?: string[];
  correctAnswer: string | string[];
  explanation?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  points: number;
  image?: string;
  audio?: string;
}

interface QuizInterfaceProps {
  isOpen: boolean;
  onClose: () => void;
}

const sampleQuestions: Question[] = [
  {
    id: 1,
    type: 'multiple-choice',
    question: 'What is the primary function of machine learning algorithms?',
    options: ['Data storage', 'Pattern recognition', 'File compression', 'Network security'],
    correctAnswer: 'Pattern recognition',
    explanation: 'Machine learning algorithms are designed to identify patterns in data and make predictions based on those patterns.',
    difficulty: 'medium',
    points: 10
  },
  {
    id: 2,
    type: 'true-false',
    question: 'Neural networks are inspired by the structure and function of the human brain.',
    correctAnswer: 'true',
    explanation: 'Neural networks are computational models inspired by biological neural networks in the human brain.',
    difficulty: 'easy',
    points: 5
  },
  {
    id: 3,
    type: 'fill-blank',
    question: 'The process of training a machine learning model is called _______.',
    correctAnswer: 'training',
    explanation: 'Training is the process where a model learns from data to make accurate predictions.',
    difficulty: 'easy',
    points: 8
  },
  {
    id: 4,
    type: 'drag-drop',
    question: 'Match the following machine learning concepts with their descriptions:',
    options: ['Supervised Learning', 'Unsupervised Learning', 'Reinforcement Learning'],
    correctAnswer: ['Uses labeled data', 'Finds patterns without labels', 'Learning through rewards'],
    explanation: 'These are the three main types of machine learning approaches.',
    difficulty: 'hard',
    points: 15
  },
  {
    id: 5,
    type: 'matching',
    question: 'Match the activation functions with their characteristics:',
    options: ['ReLU', 'Sigmoid', 'Tanh'],
    correctAnswer: ['f(x) = max(0,x)', 'f(x) = 1/(1+e^-x)', 'f(x) = tanh(x)'],
    explanation: 'These are common activation functions used in neural networks.',
    difficulty: 'hard',
    points: 20
  }
];

const QuizInterface: React.FC<QuizInterfaceProps> = ({ isOpen, onClose }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: string | string[] }>({});
  const [timeRemaining, setTimeRemaining] = useState(300); // 5 minutes
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [confidence, setConfidence] = useState(50);
  const [showExplanation, setShowExplanation] = useState(false);
  const [bookmarkedQuestions, setBookmarkedQuestions] = useState<number[]>([]);

  useEffect(() => {
    if (quizStarted && timeRemaining > 0) {
      const timer = setTimeout(() => setTimeRemaining(timeRemaining - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeRemaining === 0 && !quizCompleted) {
      handleQuizComplete();
    }
  }, [timeRemaining, quizStarted, quizCompleted]);

  const handleAnswerSelect = (answer: string | string[]) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [currentQuestion]: answer
    }));
    setShowExplanation(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < sampleQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setShowExplanation(false);
    } else {
      handleQuizComplete();
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setShowExplanation(false);
    }
  };

  const handleQuizComplete = () => {
    let totalScore = 0;
    sampleQuestions.forEach((question, index) => {
      const userAnswer = selectedAnswers[index];
      if (userAnswer === question.correctAnswer || 
          (Array.isArray(userAnswer) && Array.isArray(question.correctAnswer) && 
           userAnswer.every((ans, i) => ans === question.correctAnswer[i]))) {
        totalScore += question.points;
      }
    });
    setScore(totalScore);
    setQuizCompleted(true);
  };

  const toggleBookmark = (questionId: number) => {
    setBookmarkedQuestions(prev => 
      prev.includes(questionId) 
        ? prev.filter(id => id !== questionId)
        : [...prev, questionId]
    );
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const questionVariants = {
    hidden: { opacity: 0, x: 100 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -100 }
  };

  const answerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    selected: { 
      scale: 1.02,
      boxShadow: "0 10px 25px rgba(0,0,0,0.1)"
    }
  };

  if (!isOpen) return null;

  if (!quizStarted) {
    return (
      <motion.div
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-w-2xl w-full p-8"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ type: "spring", stiffness: 200 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="text-center mb-8">
            <motion.div
              className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4"
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <Brain className="w-10 h-10 text-white" />
            </motion.div>
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Machine Learning Quiz</h2>
            <p className="text-gray-600 dark:text-gray-400">Test your knowledge with our adaptive AI-powered quiz</p>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-8">
            <motion.div 
              className="bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-2xl p-4 text-center"
              whileHover={{ scale: 1.05 }}
            >
              <Target className="w-8 h-8 text-purple-500 mx-auto mb-2" />
              <h3 className="font-semibold text-gray-800 dark:text-white">{sampleQuestions.length} Questions</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Multiple question types</p>
            </motion.div>

            <motion.div 
              className="bg-gradient-to-br from-green-100 to-blue-100 dark:from-green-900/30 dark:to-blue-900/30 rounded-2xl p-4 text-center"
              whileHover={{ scale: 1.05 }}
            >
              <Clock className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <h3 className="font-semibold text-gray-800 dark:text-white">5 Minutes</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Time limit</p>
            </motion.div>

            <motion.div 
              className="bg-gradient-to-br from-yellow-100 to-orange-100 dark:from-yellow-900/30 dark:to-orange-900/30 rounded-2xl p-4 text-center"
              whileHover={{ scale: 1.05 }}
            >
              <Award className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
              <h3 className="font-semibold text-gray-800 dark:text-white">Max Score: 58</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total points</p>
            </motion.div>

            <motion.div 
              className="bg-gradient-to-br from-red-100 to-pink-100 dark:from-red-900/30 dark:to-pink-900/30 rounded-2xl p-4 text-center"
              whileHover={{ scale: 1.05 }}
            >
              <BarChart3 className="w-8 h-8 text-red-500 mx-auto mb-2" />
              <h3 className="font-semibold text-gray-800 dark:text-white">Adaptive</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Difficulty adjusts</p>
            </motion.div>
          </div>

          <div className="flex gap-4">
            <motion.button
              onClick={() => setQuizStarted(true)}
              className="flex-1 bg-gradient-to-r from-purple-600 to-pink-500 text-white py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-600 transition-all duration-300"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Start Quiz
            </motion.button>
            <motion.button
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-xl font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Cancel
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    );
  }

  if (quizCompleted) {
    return (
      <motion.div
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-w-2xl w-full p-8 text-center"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ type: "spring", stiffness: 200 }}
          onClick={(e) => e.stopPropagation()}
        >
          <motion.div
            className="w-24 h-24 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Award className="w-12 h-12 text-white" />
          </motion.div>

          <h2 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">Quiz Complete!</h2>
          <p className="text-2xl text-purple-600 dark:text-purple-400 mb-6">Score: {score}/58 points</p>
          
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-2xl p-4">
              <div className="text-2xl font-bold text-purple-600">{sampleQuestions.length}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Questions</div>
            </div>
            <div className="bg-gradient-to-br from-green-100 to-blue-100 dark:from-green-900/30 dark:to-blue-900/30 rounded-2xl p-4">
              <div className="text-2xl font-bold text-green-600">{Object.keys(selectedAnswers).length}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Answered</div>
            </div>
            <div className="bg-gradient-to-br from-yellow-100 to-orange-100 dark:from-yellow-900/30 dark:to-orange-900/30 rounded-2xl p-4">
              <div className="text-2xl font-bold text-yellow-600">{formatTime(300 - timeRemaining)}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Time</div>
            </div>
          </div>

          <div className="flex gap-4">
            <motion.button
              onClick={() => {
                setCurrentQuestion(0);
                setSelectedAnswers({});
                setTimeRemaining(300);
                setQuizStarted(false);
                setQuizCompleted(false);
                setScore(0);
              }}
              className="flex-1 bg-gradient-to-r from-purple-600 to-pink-500 text-white py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-600 transition-all duration-300 flex items-center justify-center gap-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <RotateCcw className="w-5 h-5" />
              Retake Quiz
            </motion.button>
            <motion.button
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-xl font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Close
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ type: "spring", stiffness: 200 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-500 p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <motion.div
                className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center"
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              >
                <Brain className="w-6 h-6" />
              </motion.div>
              <div>
                <h2 className="text-xl font-bold">Machine Learning Quiz</h2>
                <p className="text-sm opacity-90">Question {currentQuestion + 1} of {sampleQuestions.length}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <motion.div 
                className="text-2xl font-bold"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                {formatTime(timeRemaining)}
              </motion.div>
              <button
                onClick={() => toggleBookmark(sampleQuestions[currentQuestion].id)}
                className={`p-2 rounded-lg transition-colors ${
                  bookmarkedQuestions.includes(sampleQuestions[currentQuestion].id)
                    ? 'bg-white text-purple-600'
                    : 'bg-white bg-opacity-20 hover:bg-opacity-30'
                }`}
              >
                <Flag className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(sampleQuestions[currentQuestion].difficulty)}`}>
                {sampleQuestions[currentQuestion].difficulty.toUpperCase()}
              </span>
              <span className="text-sm opacity-90">
                {sampleQuestions[currentQuestion].points} points
              </span>
            </div>
            
            <div className="flex gap-2">
              {sampleQuestions.map((_, index) => (
                <motion.div
                  key={index}
                  className={`w-3 h-3 rounded-full ${
                    index === currentQuestion
                      ? 'bg-white'
                      : selectedAnswers[index]
                      ? 'bg-white bg-opacity-60'
                      : 'bg-white bg-opacity-30'
                  }`}
                  whileHover={{ scale: 1.2 }}
                  onClick={() => setCurrentQuestion(index)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Question Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestion}
              variants={questionVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* Question */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                  {sampleQuestions[currentQuestion].question}
                </h3>
              </motion.div>

              {/* Answer Options */}
              <div className="space-y-3">
                {sampleQuestions[currentQuestion].type === 'multiple-choice' && (
                  sampleQuestions[currentQuestion].options?.map((option, index) => (
                    <motion.button
                      key={index}
                      onClick={() => handleAnswerSelect(option)}
                      className={`w-full p-4 text-left rounded-xl border-2 transition-all duration-300 ${
                        selectedAnswers[currentQuestion] === option
                          ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300'
                          : 'border-gray-200 dark:border-gray-600 hover:border-purple-300 dark:hover:border-purple-600'
                      }`}
                      variants={answerVariants}
                      initial="hidden"
                      animate={selectedAnswers[currentQuestion] === option ? "selected" : "visible"}
                      transition={{ delay: 0.1 * index }}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                          selectedAnswers[currentQuestion] === option
                            ? 'border-purple-500 bg-purple-500'
                            : 'border-gray-300 dark:border-gray-500'
                        }`}>
                          {selectedAnswers[currentQuestion] === option && (
                            <CheckCircle className="w-4 h-4 text-white" />
                          )}
                        </div>
                        <span>{option}</span>
                      </div>
                    </motion.button>
                  ))
                )}

                {sampleQuestions[currentQuestion].type === 'true-false' && (
                  ['True', 'False'].map((option, index) => (
                    <motion.button
                      key={option}
                      onClick={() => handleAnswerSelect(option.toLowerCase())}
                      className={`w-full p-4 text-left rounded-xl border-2 transition-all duration-300 ${
                        selectedAnswers[currentQuestion] === option.toLowerCase()
                          ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300'
                          : 'border-gray-200 dark:border-gray-600 hover:border-purple-300 dark:hover:border-purple-600'
                      }`}
                      variants={answerVariants}
                      initial="hidden"
                      animate={selectedAnswers[currentQuestion] === option.toLowerCase() ? "selected" : "visible"}
                      transition={{ delay: 0.1 * index }}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                          selectedAnswers[currentQuestion] === option.toLowerCase()
                            ? 'border-purple-500 bg-purple-500'
                            : 'border-gray-300 dark:border-gray-500'
                        }`}>
                          {selectedAnswers[currentQuestion] === option.toLowerCase() && (
                            <CheckCircle className="w-4 h-4 text-white" />
                          )}
                        </div>
                        <span>{option}</span>
                      </div>
                    </motion.button>
                  ))
                )}

                {sampleQuestions[currentQuestion].type === 'fill-blank' && (
                  <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={answerVariants}
                  >
                    <input
                      type="text"
                      placeholder="Type your answer here..."
                      className="w-full p-4 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-purple-500 focus:outline-none transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      onChange={(e) => handleAnswerSelect(e.target.value)}
                      value={selectedAnswers[currentQuestion] as string || ''}
                    />
                  </motion.div>
                )}
              </div>

              {/* Explanation */}
              {showExplanation && sampleQuestions[currentQuestion].explanation && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-4 border border-purple-200 dark:border-purple-700"
                >
                  <h4 className="font-semibold text-purple-700 dark:text-purple-300 mb-2 flex items-center gap-2">
                    <Brain className="w-5 h-5" />
                    Explanation
                  </h4>
                  <p className="text-gray-700 dark:text-gray-300">
                    {sampleQuestions[currentQuestion].explanation}
                  </p>
                </motion.div>
              )}

              {/* Confidence Slider */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4"
              >
                <h4 className="font-medium text-gray-800 dark:text-white mb-3">How confident are you in your answer?</h4>
                <div className="flex items-center gap-4">
                  <motion.div
                    animate={{ scale: confidence < 30 ? [1, 1.2, 1] : 1 }}
                    transition={{ duration: 1, repeat: confidence < 30 ? Infinity : 0 }}
                  >
                    <Heart className="w-6 h-6 text-red-400" />
                  </motion.div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={confidence}
                    onChange={(e) => setConfidence(Number(e.target.value))}
                    className="flex-1 h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <motion.div
                    animate={{ scale: confidence > 70 ? [1, 1.2, 1] : 1 }}
                    transition={{ duration: 1, repeat: confidence > 70 ? Infinity : 0 }}
                  >
                    <Zap className="w-6 h-6 text-yellow-400" />
                  </motion.div>
                </div>
                <div className="text-center mt-2">
                  <span className="text-lg font-semibold text-purple-600 dark:text-purple-400">{confidence}%</span>
                </div>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <motion.button
              onClick={handlePrevQuestion}
              disabled={currentQuestion === 0}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              whileHover={{ scale: currentQuestion === 0 ? 1 : 1.05 }}
              whileTap={{ scale: currentQuestion === 0 ? 1 : 0.95 }}
            >
              <ChevronLeft className="w-5 h-5" />
              Previous
            </motion.button>

            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {currentQuestion + 1} / {sampleQuestions.length}
              </span>
              <motion.button
                onClick={handleNextQuestion}
                className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-lg hover:from-purple-700 hover:to-pink-600 transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {currentQuestion === sampleQuestions.length - 1 ? 'Finish' : 'Next'}
                <ChevronRight className="w-5 h-5" />
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default QuizInterface;