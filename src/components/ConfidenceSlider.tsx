import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Frown, 
  Meh, 
  Smile, 
  Laugh, 
  Heart, 
  Zap, 
  Star,
  TrendingUp,
  TrendingDown,
  Minus,
  Target,
  Brain,
  Award
} from 'lucide-react';

interface ConfidenceLevel {
  min: number;
  max: number;
  emoji: string;
  label: string;
  color: string;
  bgColor: string;
  description: string;
}

const confidenceLevels: ConfidenceLevel[] = [
  {
    min: 0,
    max: 20,
    emoji: '😰',
    label: 'Very Low',
    color: 'text-red-600',
    bgColor: 'bg-red-100',
    description: 'Need more practice'
  },
  {
    min: 21,
    max: 40,
    emoji: '😟',
    label: 'Low',
    color: 'text-orange-600',
    bgColor: 'bg-orange-100',
    description: 'Getting there'
  },
  {
    min: 41,
    max: 60,
    emoji: '😐',
    label: 'Moderate',
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100',
    description: 'Room for improvement'
  },
  {
    min: 61,
    max: 80,
    emoji: '😊',
    label: 'High',
    color: 'text-green-600',
    bgColor: 'bg-green-100',
    description: 'Doing well'
  },
  {
    min: 81,
    max: 100,
    emoji: '🤩',
    label: 'Very High',
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    description: 'Excellent!'
  }
];

interface ConfidenceSliderProps {
  initialValue?: number;
  onChange?: (value: number) => void;
  showEmoji?: boolean;
  showLabels?: boolean;
  showDescription?: boolean;
  animated?: boolean;
  size?: 'small' | 'medium' | 'large';
  theme?: 'default' | 'gradient' | 'minimal';
  showHistory?: boolean;
  showSuggestions?: boolean;
}

const ConfidenceSlider: React.FC<ConfidenceSliderProps> = ({
  initialValue = 50,
  onChange,
  showEmoji = true,
  showLabels = true,
  showDescription = true,
  animated = true,
  size = 'medium',
  theme = 'default',
  showHistory = false,
  showSuggestions = false
}) => {
  const [confidence, setConfidence] = useState(initialValue);
  const [isDragging, setIsDragging] = useState(false);
  const [history, setHistory] = useState<number[]>([initialValue]);
  const [currentLevel, setCurrentLevel] = useState(confidenceLevels.find(level => 
    confidence >= level.min && confidence <= level.max
  ) || confidenceLevels[2]);

  const sizeClasses = {
    small: 'w-64 h-2',
    medium: 'w-80 h-3',
    large: 'w-96 h-4'
  };

  const thumbSizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-6 h-6',
    large: 'w-8 h-8'
  };

  useEffect(() => {
    const newLevel = confidenceLevels.find(level => 
      confidence >= level.min && confidence <= level.max
    ) || confidenceLevels[2];
    setCurrentLevel(newLevel);
    
    if (onChange) {
      onChange(confidence);
    }
  }, [confidence, onChange]);

  const handleSliderChange = (value: number) => {
    setConfidence(value);
    setHistory(prev => [...prev.slice(-9), value]); // Keep last 10 values
  };

  const getSliderBackground = () => {
    if (theme === 'gradient') {
      return 'bg-gradient-to-r from-red-500 via-yellow-500 to-green-500';
    }
    return 'bg-gray-200 dark:bg-gray-700';
  };

  const getProgressColor = () => {
    if (theme === 'gradient') {
      return 'bg-gradient-to-r from-red-500 to-green-500';
    }
    return 'bg-gradient-to-r from-purple-500 to-pink-500';
  };

  const emojiVariants = {
    hidden: { scale: 0, rotate: -180 },
    visible: {
      scale: 1,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 15
      }
    },
    hover: {
      scale: 1.2,
      rotate: [0, -10, 10, -10, 0],
      transition: {
        duration: 0.5
      }
    },
    bounce: {
      scale: [1, 1.3, 0.9, 1.1, 1],
      transition: {
        duration: 0.6,
        times: [0, 0.3, 0.5, 0.7, 1]
      }
    }
  };

  const pulseVariants = {
    pulse: {
      scale: [1, 1.1, 1],
      opacity: [0.7, 1, 0.7],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const renderDefaultTheme = () => (
    <div className="space-y-6">
      {/* Emoji and Label Display */}
      <AnimatePresence mode="wait">
        {showEmoji && (
          <motion.div
            key={currentLevel.emoji}
            variants={emojiVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            whileHover="hover"
            className="text-center"
          >
            <motion.div
              className="text-6xl mb-4 inline-block"
              animate={confidence > 80 ? "bounce" : {}}
              transition={{ duration: 0.6 }}
            >
              {currentLevel.emoji}
            </motion.div>
            
            {showLabels && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-2"
              >
                <h3 className={`text-2xl font-bold ${currentLevel.color}`}>
                  {currentLevel.label}
                </h3>
                <div className="text-4xl font-bold text-gray-800 dark:text-white">
                  {confidence}%
                </div>
              </motion.div>
            )}

            {showDescription && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className={`text-sm ${currentLevel.color} mt-2`}
              >
                {currentLevel.description}
              </motion.p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Slider */}
      <div className="space-y-4">
        <div className="relative">
          <input
            type="range"
            min="0"
            max="100"
            value={confidence}
            onChange={(e) => handleSliderChange(Number(e.target.value))}
            onMouseDown={() => setIsDragging(true)}
            onMouseUp={() => setIsDragging(false)}
            className={`w-full ${sizeClasses[size]} rounded-full appearance-none cursor-pointer slider relative z-10 bg-transparent`}
            style={{
              background: `linear-gradient(to right, ${currentLevel.color.replace('text-', 'var(--tw-color-')} 0%, ${currentLevel.color.replace('text-', 'var(--tw-color-')} ${confidence}%, ${getSliderBackground()} ${confidence}%, ${getSliderBackground()} 100%)`
            }}
          />
          
          {/* Animated thumb */}
          <motion.div
            className={`absolute top-1/2 transform -translate-y-1/2 ${thumbSizeClasses[size]} ${currentLevel.bgColor} rounded-full border-4 border-white shadow-lg`}
            style={{
              left: `calc(${confidence}% - ${size === 'small' ? '8px' : size === 'medium' ? '12px' : '16px'})`
            }}
            animate={isDragging ? { scale: 1.2 } : { scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <motion.div
              className="w-full h-full rounded-full flex items-center justify-center"
              animate={{ rotate: confidence * 3.6 }}
              transition={{ duration: 0.3 }}
            >
              <Zap className={`w-3 h-3 ${currentLevel.color.replace('text-', 'text-')}`} />
            </motion.div>
          </motion.div>
        </div>

        {/* Confidence level indicators */}
        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
          {confidenceLevels.map((level, index) => (
            <motion.div
              key={index}
              className={`text-center ${confidence >= level.min && confidence <= level.max ? 'font-bold ' + currentLevel.color : ''}`}
              animate={{ scale: confidence >= level.min && confidence <= level.max ? 1.1 : 1 }}
              transition={{ duration: 0.2 }}
            >
              <div>{level.emoji}</div>
              <div>{level.min}%</div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* History Chart */}
      {showHistory && history.length > 1 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4"
        >
          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
            Confidence History
          </h4>
          <div className="flex items-end gap-1 h-16">
            {history.slice(-10).map((value, index) => {
              const height = (value / 100) * 100;
              const level = confidenceLevels.find(l => value >= l.min && value <= l.max);
              return (
                <motion.div
                  key={index}
                  className={`flex-1 rounded-t ${level?.bgColor || 'bg-gray-300'}`}
                  style={{ height: `${height}%` }}
                  initial={{ height: 0 }}
                  animate={{ height: `${height}%` }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  title={`${value}% - ${level?.label || 'Unknown'}`}
                />
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Suggestions */}
      {showSuggestions && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800"
        >
          <div className="flex items-start gap-3">
            <Brain className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-blue-800 dark:text-blue-300 mb-1">
                AI Suggestion
              </h4>
              <p className="text-sm text-blue-700 dark:text-blue-400">
                {confidence < 40 && "Consider reviewing the material and practicing more exercises to build confidence."}
                {confidence >= 40 && confidence < 70 && "You're making good progress! Try some challenging problems to boost your confidence."}
                {confidence >= 70 && confidence < 90 && "Great job! You're well-prepared. Consider helping others to solidify your understanding."}
                {confidence >= 90 && "Excellent! You're ready for advanced topics and real-world applications."}
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );

  const renderGradientTheme = () => (
    <div className="space-y-6">
      <div className="text-center">
        <motion.div
          className="text-6xl mb-4"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {currentLevel.emoji}
        </motion.div>
        
        <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
          {confidence}%
        </div>
        <div className={`text-lg font-semibold ${currentLevel.color}`}>
          {currentLevel.label}
        </div>
      </div>

      <div className="relative">
        <div className={`w-full ${sizeClasses[size]} rounded-full bg-gradient-to-r from-red-200 via-yellow-200 to-green-200 dark:from-red-800 dark:via-yellow-800 dark:to-green-800 relative overflow-hidden`}>
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 rounded-full"
            style={{ width: `${confidence}%` }}
            initial={{ width: 0 }}
            animate={{ width: `${confidence}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        
        <input
          type="range"
          min="0"
          max="100"
          value={confidence}
          onChange={(e) => handleSliderChange(Number(e.target.value))}
          className={`absolute inset-0 w-full ${sizeClasses[size]} opacity-0 cursor-pointer z-10`}
        />
        
        <motion.div
          className="absolute top-1/2 transform -translate-y-1/2 w-6 h-6 bg-white rounded-full shadow-lg border-2 border-purple-500"
          style={{ left: `calc(${confidence}% - 12px)` }}
          animate={{ scale: isDragging ? 1.2 : 1 }}
          transition={{ type: "spring", stiffness: 300 }}
        />
      </div>
    </div>
  );

  const renderMinimalTheme = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Confidence Level
        </span>
        <motion.span
          className="text-lg font-bold text-gray-900 dark:text-white"
          key={confidence}
          initial={{ scale: 1.2 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.2 }}
        >
          {confidence}%
        </motion.span>
      </div>

      <div className="relative">
        <div className={`w-full ${sizeClasses[size]} rounded-full bg-gray-200 dark:bg-gray-700`}>
          <motion.div
            className={`h-full rounded-full ${currentLevel.bgColor}`}
            style={{ width: `${confidence}%` }}
            initial={{ width: 0 }}
            animate={{ width: `${confidence}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        
        <input
          type="range"
          min="0"
          max="100"
          value={confidence}
          onChange={(e) => handleSliderChange(Number(e.target.value))}
          className={`absolute inset-0 w-full ${sizeClasses[size]} opacity-0 cursor-pointer`}
        />
      </div>

      {showEmoji && (
        <div className="text-center">
          <motion.span
            className="text-2xl"
            key={currentLevel.emoji}
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            {currentLevel.emoji}
          </motion.span>
        </div>
      )}
    </div>
  );

  return (
    <div className="w-full max-w-md mx-auto p-6">
      {theme === 'default' && renderDefaultTheme()}
      {theme === 'gradient' && renderGradientTheme()}
      {theme === 'minimal' && renderMinimalTheme()}
    </div>
  );
};

export default ConfidenceSlider;