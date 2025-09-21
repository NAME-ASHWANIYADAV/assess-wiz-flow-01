import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Brain, Zap, Heart, Star, Smile, Eye } from 'lucide-react';

interface MascotProps {
  variant?: 'default' | 'thinking' | 'excited' | 'happy' | 'winking' | 'loving';
  size?: 'small' | 'medium' | 'large';
  animated?: boolean;
  className?: string;
}

const AnimatedMascot: React.FC<MascotProps> = ({ 
  variant = 'default', 
  size = 'medium', 
  animated = true,
  className = '' 
}) => {
  const [currentExpression, setCurrentExpression] = useState(variant);
  const [isHovered, setIsHovered] = useState(false);

  const sizeClasses = {
    small: 'w-16 h-16',
    medium: 'w-32 h-32',
    large: 'w-48 h-48'
  };

  // Random expression changes for idle animation
  useEffect(() => {
    if (animated && variant === 'default') {
      const interval = setInterval(() => {
        const expressions = ['default', 'thinking', 'winking', 'happy'];
        const randomExpression = expressions[Math.floor(Math.random() * expressions.length)];
        setCurrentExpression(randomExpression);
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [animated, variant]);

  // Reset to default when not hovered
  useEffect(() => {
    if (!isHovered && variant !== currentExpression) {
      const timer = setTimeout(() => {
        setCurrentExpression(variant);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isHovered, variant, currentExpression]);

  const mascotVariants = {
    default: {
      scale: [1, 1.02, 1],
      rotate: [0, -2, 2, 0],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
      }
    },
    thinking: {
      scale: 1,
      rotate: [-5, 5, -5],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    },
    excited: {
      scale: [1, 1.1, 1],
      rotate: [0, 360],
      transition: {
        duration: 0.8,
        repeat: 0,
        ease: "easeOut"
      }
    },
    happy: {
      scale: [1, 1.05, 1],
      y: [0, -5, 0],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut"
      }
    },
    winking: {
      scale: 1,
      rotate: [0, 10, 0],
      transition: {
        duration: 0.5,
        repeat: 0,
        ease: "easeOut"
      }
    },
    loving: {
      scale: [1, 1.08, 1],
      transition: {
        duration: 1,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const eyeVariants = {
    default: { scale: 1, opacity: 1 },
    thinking: { scale: 0.7, opacity: 0.8 },
    excited: { scale: 1.2, opacity: 1 },
    happy: { scale: 0.8, opacity: 1, y: -2 },
    winking: { scale: [1, 0.1, 1], opacity: [1, 0, 1] },
    loving: { scale: 1.1, opacity: 1 }
  };

  const getExpressionIcon = () => {
    switch (currentExpression) {
      case 'thinking':
        return <Brain className="w-6 h-6 text-purple-400" />;
      case 'excited':
        return <Zap className="w-6 h-6 text-yellow-400" />;
      case 'happy':
        return <Smile className="w-6 h-6 text-green-400" />;
      case 'winking':
        return <Eye className="w-6 h-6 text-blue-400" />;
      case 'loving':
        return <Heart className="w-6 h-6 text-red-400" />;
      default:
        return <Star className="w-6 h-6 text-primary" />;
    }
  };

  return (
    <motion.div
      className={`relative ${sizeClasses[size]} ${className}`}
      variants={mascotVariants}
      animate={currentExpression}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {/* Main body */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-purple-400 via-pink-400 to-blue-400 rounded-full shadow-lg"
        animate={{
          boxShadow: [
            "0 0 20px rgba(168, 85, 247, 0.3)",
            "0 0 40px rgba(168, 85, 247, 0.5)",
            "0 0 20px rgba(168, 85, 247, 0.3)"
          ]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Face */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative">
          {/* Eyes */}
          <div className="flex space-x-4 mb-2">
            <motion.div
              className="w-3 h-3 bg-white rounded-full relative"
              variants={eyeVariants}
              animate={currentExpression}
            >
              <motion.div
                className="absolute inset-1 bg-gray-800 rounded-full"
                animate={{
                  x: currentExpression === 'thinking' ? [-1, 1, -1] : 0,
                  transition: {
                    duration: 1,
                    repeat: currentExpression === 'thinking' ? Infinity : 0
                  }
                }}
              />
            </motion.div>
            <motion.div
              className="w-3 h-3 bg-white rounded-full relative"
              variants={eyeVariants}
              animate={currentExpression}
            >
              <motion.div
                className="absolute inset-1 bg-gray-800 rounded-full"
                animate={{
                  x: currentExpression === 'thinking' ? [1, -1, 1] : 0,
                  transition: {
                    duration: 1,
                    repeat: currentExpression === 'thinking' ? Infinity : 0
                  }
                }}
              />
            </motion.div>
          </div>

          {/* Mouth */}
          <motion.div
            className="w-6 h-3 border-b-2 border-white rounded-b-full mx-auto"
            animate={{
              scaleX: currentExpression === 'happy' || currentExpression === 'loving' ? [1, 1.2, 1] : 1,
              borderRadius: currentExpression === 'excited' ? "50%" : "0% 0% 50% 50%"
            }}
            transition={{
              duration: 0.5,
              repeat: currentExpression === 'happy' || currentExpression === 'loving' ? Infinity : 0
            }}
          />
        </div>
      </div>

      {/* Expression icon */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentExpression}
          className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-md"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          exit={{ scale: 0, rotate: 180 }}
          transition={{ type: "spring", stiffness: 200 }}
        >
          {getExpressionIcon()}
        </motion.div>
      </AnimatePresence>

      {/* Sparkle effects */}
      {animated && (
        <>
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute"
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
                x: [0, (i - 1) * 30],
                y: [0, -20, -40]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.7,
                ease: "easeOut"
              }}
              style={{
                top: '20%',
                left: `${30 + i * 20}%`
              }}
            >
              <Sparkles className="w-4 h-4 text-yellow-300" />
            </motion.div>
          ))}
        </>
      )}

      {/* Hover effects */}
      {isHovered && (
        <motion.div
          className="absolute inset-0 rounded-full"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1.2, opacity: 0.3 }}
          transition={{ duration: 0.3 }}
          style={{
            background: "radial-gradient(circle, rgba(168, 85, 247, 0.4) 0%, transparent 70%)"
          }}
        />
      )}
    </motion.div>
  );
};

// Helper component for different mascot states
export const MascotWithMessage: React.FC<{
  message: string;
  variant?: 'default' | 'thinking' | 'excited' | 'happy' | 'winking' | 'loving';
  position?: 'left' | 'right' | 'top' | 'bottom';
}> = ({ message, variant = 'default', position = 'right' }) => {
  const positionClasses = {
    left: 'flex-row-reverse',
    right: 'flex-row',
    top: 'flex-col-reverse',
    bottom: 'flex-col'
  };

  return (
    <motion.div
      className={`flex items-center gap-4 ${positionClasses[position]}`}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 200 }}
    >
      <AnimatedMascot variant={variant} size="small" />
      <motion.div
        className="bg-white dark:bg-gray-800 rounded-2xl px-4 py-3 shadow-lg max-w-xs"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="text-sm text-gray-800 dark:text-gray-200">
          {message}
        </div>
        <div className="absolute w-3 h-3 bg-white dark:bg-gray-800 transform rotate-45 -left-1 top-4" />
      </motion.div>
    </motion.div>
  );
};

export default AnimatedMascot;