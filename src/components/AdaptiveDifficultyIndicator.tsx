import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, 
  Target, 
  TrendingUp, 
  TrendingDown, 
  Zap, 
  Star,
  Award,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  Activity,
  Gauge,
  Thermometer,
  Battery,
  Cpu,
  TargetIcon,
  Crosshair,
  Layers,
  Filter,
  Settings,
  RefreshCw,
  Play,
  Pause
} from 'lucide-react';

interface DifficultyLevel {
  name: string;
  level: number;
  color: string;
  bgColor: string;
  borderColor: string;
  gradient: string;
  description: string;
  icon: React.ReactNode;
  minAccuracy: number;
  maxAccuracy: number;
  avgTime: number;
  complexity: 'low' | 'medium' | 'high';
}

const difficultyLevels: DifficultyLevel[] = [
  {
    name: 'Beginner',
    level: 1,
    color: 'text-green-600',
    bgColor: 'bg-green-100',
    borderColor: 'border-green-300',
    gradient: 'from-green-400 to-green-600',
    description: 'Perfect for starting your journey',
    icon: <Star className="w-4 h-4" />,
    minAccuracy: 80,
    maxAccuracy: 100,
    avgTime: 30,
    complexity: 'low'
  },
  {
    name: 'Elementary',
    level: 2,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    borderColor: 'border-blue-300',
    gradient: 'from-blue-400 to-blue-600',
    description: 'Building fundamental skills',
    icon: <Target className="w-4 h-4" />,
    minAccuracy: 70,
    maxAccuracy: 90,
    avgTime: 45,
    complexity: 'low'
  },
  {
    name: 'Intermediate',
    level: 3,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100',
    borderColor: 'border-yellow-300',
    gradient: 'from-yellow-400 to-yellow-600',
    description: 'Challenging but achievable',
    icon: <Brain className="w-4 h-4" />,
    minAccuracy: 60,
    maxAccuracy: 80,
    avgTime: 60,
    complexity: 'medium'
  },
  {
    name: 'Advanced',
    level: 4,
    color: 'text-orange-600',
    bgColor: 'bg-orange-100',
    borderColor: 'border-orange-300',
    gradient: 'from-orange-400 to-orange-600',
    description: 'Pushing your limits',
    icon: <Zap className="w-4 h-4" />,
    minAccuracy: 50,
    maxAccuracy: 70,
    avgTime: 90,
    complexity: 'high'
  },
  {
    name: 'Expert',
    level: 5,
    color: 'text-red-600',
    bgColor: 'bg-red-100',
    borderColor: 'border-red-300',
    gradient: 'from-red-400 to-red-600',
    description: 'Master level challenges',
    icon: <Award className="w-4 h-4" />,
    minAccuracy: 40,
    maxAccuracy: 60,
    avgTime: 120,
    complexity: 'high'
  }
];

interface AdaptiveDifficultyIndicatorProps {
  currentLevel?: number;
  accuracy?: number;
  avgResponseTime?: number;
  totalQuestions?: number;
  correctAnswers?: number;
  showAnimation?: boolean;
  showTrend?: boolean;
  showPrediction?: boolean;
  variant?: 'card' | 'minimal' | 'detailed' | 'gauge';
  size?: 'small' | 'medium' | 'large';
  theme?: 'default' | 'gradient' | 'glass';
  autoAdjust?: boolean;
  onLevelChange?: (newLevel: number) => void;
}

const AdaptiveDifficultyIndicator: React.FC<AdaptiveDifficultyIndicatorProps> = ({
  currentLevel = 3,
  accuracy = 75,
  avgResponseTime = 45,
  totalQuestions = 50,
  correctAnswers = 38,
  showAnimation = true,
  showTrend = true,
  showPrediction = true,
  variant = 'card',
  size = 'medium',
  theme = 'default',
  autoAdjust = false,
  onLevelChange
}) => {
  const [currentDifficulty, setCurrentDifficulty] = useState(currentLevel);
  const [isAdjusting, setIsAdjusting] = useState(false);
  const [trendDirection, setTrendDirection] = useState<'up' | 'down' | 'stable'>('stable');
  const [predictedLevel, setPredictedLevel] = useState(currentLevel);
  const [showAdjustment, setShowAdjustment] = useState(false);

  const currentDifficultyData = difficultyLevels[currentDifficulty - 1];
  const predictedDifficultyData = difficultyLevels[predictedLevel - 1];

  useEffect(() => {
    // Calculate trend based on recent performance
    const recentAccuracy = (correctAnswers / totalQuestions) * 100;
    const performanceRatio = recentAccuracy / currentDifficultyData.maxAccuracy;
    
    if (performanceRatio > 0.85 && avgResponseTime < currentDifficultyData.avgTime) {
      setTrendDirection('up');
      setPredictedLevel(Math.min(5, currentDifficulty + 1));
    } else if (performanceRatio < 0.6 || avgResponseTime > currentDifficultyData.avgTime * 1.2) {
      setTrendDirection('down');
      setPredictedLevel(Math.max(1, currentDifficulty - 1));
    } else {
      setTrendDirection('stable');
      setPredictedLevel(currentDifficulty);
    }
  }, [accuracy, avgResponseTime, totalQuestions, correctAnswers, currentDifficulty, currentDifficultyData]);

  const handleAutoAdjust = () => {
    if (autoAdjust && predictedLevel !== currentDifficulty) {
      setIsAdjusting(true);
      setShowAdjustment(true);
      
      setTimeout(() => {
        setCurrentDifficulty(predictedLevel);
        if (onLevelChange) {
          onLevelChange(predictedLevel);
        }
        setIsAdjusting(false);
        setTimeout(() => setShowAdjustment(false), 2000);
      }, 1000);
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 20
      }
    },
    adjusting: {
      scale: [1, 1.05, 1],
      rotate: [0, 2, -2, 0],
      transition: {
        duration: 0.5,
        repeat: isAdjusting ? Infinity : 0
      }
    }
  };

  const levelIndicatorVariants = {
    inactive: { scale: 0.8, opacity: 0.3 },
    active: { 
      scale: 1, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20
      }
    },
    pulse: {
      scale: [1, 1.1, 1],
      opacity: [0.8, 1, 0.8],
      transition: {
        duration: 1.5,
        repeat: Infinity
      }
    }
  };

  const trendVariants = {
    up: { y: [-2, -5, -2], color: '#10b981' },
    down: { y: [2, 5, 2], color: '#ef4444' },
    stable: { y: 0, color: '#6b7280' }
  };

  const renderCardVariant = () => (
    <motion.div
      variants={{
        hidden: { opacity: 0, scale: 0.8, y: 20 },
        visible: { 
          opacity: 1,
          scale: 1,
          y: 0,
          transition: {
            type: "spring" as const,
            stiffness: 200,
            damping: 20
          }
        },
        adjusting: {
          scale: [1, 1.05, 1],
          rotate: [0, 2, -2, 0],
          transition: {
            duration: 0.5,
            repeat: isAdjusting ? Infinity : 0
          }
        }
      }}
      initial="hidden"
      animate={isAdjusting ? "adjusting" : "visible"}
      className={`p-6 rounded-2xl border-2 ${currentDifficultyData.borderColor} ${
        theme === 'glass' 
          ? 'bg-white/10 backdrop-blur-md border-white/20' 
          : theme === 'gradient'
          ? `bg-gradient-to-br ${currentDifficultyData.gradient} text-white`
          : currentDifficultyData.bgColor
      } shadow-lg`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <motion.div
            animate={showAnimation ? { rotate: 360 } : {}}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className={`p-2 rounded-full ${
              theme === 'gradient' ? 'bg-white/20' : currentDifficultyData.bgColor
            }`}
          >
            {currentDifficultyData.icon}
          </motion.div>
          <div>
            <h3 className={`text-lg font-bold ${
              theme === 'gradient' ? 'text-white' : currentDifficultyData.color
            }`}>
              {currentDifficultyData.name}
            </h3>
            <p className={`text-sm ${
              theme === 'gradient' ? 'text-white/80' : 'text-gray-600'
            }`}>
              {currentDifficultyData.description}
            </p>
          </div>
        </div>
        
        {showTrend && (
          <motion.div
            variants={trendVariants}
            animate={trendDirection}
            className="flex items-center gap-1"
          >
            {trendDirection === 'up' && <TrendingUp className="w-5 h-5" />}
            {trendDirection === 'down' && <TrendingDown className="w-5 h-5" />}
            {trendDirection === 'stable' && <BarChart3 className="w-5 h-5" />}
          </motion.div>
        )}
      </div>

      {/* Level Indicators */}
      <div className="flex justify-between mb-4">
        {difficultyLevels.map((level, index) => (
          <motion.div
            key={level.level}
            variants={{
              inactive: { 
                scale: 0.8, 
                opacity: 0.3 
              },
              active: { 
                scale: 1, 
                opacity: 1,
                transition: {
                  type: "spring" as const,
                  stiffness: 300,
                  damping: 20
                }
              },
              pulse: {
                scale: [1, 1.1, 1],
                opacity: [0.8, 1, 0.8],
                transition: {
                  duration: 1.5,
                  repeat: Infinity
                }
              }
            }}
            initial="inactive"
            animate={currentDifficulty === level.level ? "active" : "inactive"}
            className="flex flex-col items-center gap-1"
          >
            <motion.div
              className={`w-3 h-3 rounded-full ${
                currentDifficulty >= level.level
                  ? theme === 'gradient' 
                    ? 'bg-white'
                    : level.color.replace('text-', 'bg-')
                  : 'bg-gray-300 dark:bg-gray-600'
              }`}
              whileHover={{ scale: 1.2 }}
            />
            <span className={`text-xs ${
              currentDifficulty === level.level
                ? theme === 'gradient' ? 'text-white' : level.color
                : 'text-gray-400'
            }`}>
              {level.level}
            </span>
          </motion.div>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className={`p-3 rounded-lg ${
          theme === 'glass' 
            ? 'bg-white/5' 
            : theme === 'gradient' 
            ? 'bg-white/10' 
            : 'bg-white/50'
        }`}>
          <div className="flex items-center gap-2 mb-1">
            <Target className="w-4 h-4 text-gray-600" />
            <span className="text-sm text-gray-600">Accuracy</span>
          </div>
          <div className={`text-lg font-bold ${
            theme === 'gradient' ? 'text-white' : 'text-gray-900'
          }`}>
            {accuracy}%
          </div>
        </div>
        
        <div className={`p-3 rounded-lg ${
          theme === 'glass' 
            ? 'bg-white/5' 
            : theme === 'gradient' 
            ? 'bg-white/10' 
            : 'bg-white/50'
        }`}>
          <div className="flex items-center gap-2 mb-1">
            <Activity className="w-4 h-4 text-gray-600" />
            <span className="text-sm text-gray-600">Avg Time</span>
          </div>
          <div className={`text-lg font-bold ${
            theme === 'gradient' ? 'text-white' : 'text-gray-900'
          }`}>
            {avgResponseTime}s
          </div>
        </div>
      </div>

      {/* Prediction */}
      {showPrediction && predictedLevel !== currentDifficulty && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-3 rounded-lg border ${
            theme === 'glass'
              ? 'bg-white/10 border-white/20'
              : theme === 'gradient'
              ? 'bg-white/20 border-white/30'
              : predictedDifficultyData.borderColor
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Brain className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-600">
                Next Level Recommended
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-sm font-bold ${
                theme === 'gradient' ? 'text-white' : predictedDifficultyData.color
              }`}>
                {predictedDifficultyData.name}
              </span>
              {predictedDifficultyData.icon}
            </div>
          </div>
        </motion.div>
      )}

      {/* Auto-adjust button */}
      {autoAdjust && predictedLevel !== currentDifficulty && (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleAutoAdjust}
          disabled={isAdjusting}
          className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isAdjusting ? 'Adjusting...' : 'Auto-Adjust Difficulty'}
        </motion.button>
      )}

      {/* Adjustment Animation */}
      <AnimatePresence>
        {showAdjustment && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="bg-white rounded-2xl p-8 shadow-2xl"
            >
              <div className="text-6xl mb-4 text-center">⚡</div>
              <h3 className="text-xl font-bold text-center mb-2">Adjusting Difficulty</h3>
              <p className="text-gray-600 text-center">
                Moving to {predictedDifficultyData.name} level
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );

  const renderMinimalVariant = () => (
    <div className="flex items-center gap-3">
      <div className={`px-3 py-1 rounded-full text-sm font-medium ${
        currentDifficultyData.bgColor
      } ${currentDifficultyData.color}`}>
        {currentDifficultyData.name}
      </div>
      {showTrend && (
        <motion.div
          animate={trendDirection}
          className="text-gray-500"
        >
          {trendDirection === 'up' && <TrendingUp className="w-4 h-4" />}
          {trendDirection === 'down' && <TrendingDown className="w-4 h-4" />}
        </motion.div>
      )}
    </div>
  );

  const renderGaugeVariant = () => (
    <div className="relative w-32 h-32">
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
        <motion.circle
          cx="50"
          cy="50"
          r="40"
          stroke="currentColor"
          strokeWidth="8"
          fill="none"
          className="text-gray-200 dark:text-gray-700"
        />
        <motion.circle
          cx="50"
          cy="50"
          r="40"
          stroke="currentColor"
          strokeWidth="8"
          fill="none"
          strokeLinecap="round"
          className={currentDifficultyData.color.replace('text-', 'text-')}
          strokeDasharray={`${(currentDifficulty / 5) * 251.2} 251.2`}
          initial={{ strokeDasharray: "0 251.2" }}
          animate={{ strokeDasharray: `${(currentDifficulty / 5) * 251.2} 251.2` }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className={`text-2xl font-bold ${currentDifficultyData.color}`}>
            {currentDifficulty}
          </div>
          <div className="text-xs text-gray-500">
            {currentDifficultyData.name}
          </div>
        </div>
      </div>
    </div>
  );

  const renderDetailedVariant = () => (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      className="p-6 rounded-2xl border-2 border-gray-200 bg-white shadow-lg"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-gray-900">Difficulty Analysis</h3>
        <div className={`px-3 py-1 rounded-full text-sm font-medium ${
          currentDifficultyData.bgColor
        } ${currentDifficultyData.color}`}>
          {currentDifficultyData.name}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Performance</span>
          <div className="flex items-center gap-2">
            <div className="w-24 bg-gray-200 rounded-full h-2">
              <motion.div
                className="bg-blue-600 h-2 rounded-full"
                style={{ width: `${accuracy}%` }}
                initial={{ width: 0 }}
                animate={{ width: `${accuracy}%` }}
                transition={{ duration: 1 }}
              />
            </div>
            <span className="text-sm font-medium">{accuracy}%</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Complexity</span>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((level) => (
              <div
                key={level}
                className={`w-2 h-2 rounded-full ${
                  level <= currentDifficulty ? 'bg-purple-600' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Recommended</span>
          <div className="flex items-center gap-2">
            {predictedDifficultyData.icon}
            <span className="text-sm font-medium">{predictedDifficultyData.name}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="w-full max-w-md mx-auto">
      {variant === 'card' && renderCardVariant()}
      {variant === 'minimal' && renderMinimalVariant()}
      {variant === 'gauge' && renderGaugeVariant()}
      {variant === 'detailed' && renderDetailedVariant()}
    </div>
  );
};

export default AdaptiveDifficultyIndicator;