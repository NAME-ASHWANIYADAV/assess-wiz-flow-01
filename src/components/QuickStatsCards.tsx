import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, 
  Users, 
  BookOpen, 
  Award, 
  Clock, 
  Target,
  Zap,
  Star,
  ArrowUp,
  ArrowDown,
  Minus
} from 'lucide-react';

interface StatCard {
  id: string;
  title: string;
  value: number;
  target: number;
  unit: string;
  icon: React.ReactNode;
  color: string;
  trend: 'up' | 'down' | 'stable';
  trendValue: number;
  description: string;
  progressColor: string;
}

interface QuickStatsCardsProps {
  className?: string;
  layout?: 'grid' | 'list' | 'compact';
  showProgress?: boolean;
  animated?: boolean;
}

const QuickStatsCards: React.FC<QuickStatsCardsProps> = ({ 
  className = '', 
  layout = 'grid', 
  showProgress = true,
  animated = true 
}) => {
  const [stats, setStats] = useState<StatCard[]>([
    {
      id: 'completion',
      title: 'Course Completion',
      value: 75,
      target: 100,
      unit: '%',
      icon: <BookOpen className="w-6 h-6" />,
      color: 'bg-blue-500',
      trend: 'up',
      trendValue: 12,
      description: 'Above target',
      progressColor: 'from-blue-400 to-blue-600'
    },
    {
      id: 'students',
      title: 'Active Students',
      value: 1247,
      target: 1500,
      unit: '',
      icon: <Users className="w-6 h-6" />,
      color: 'bg-green-500',
      trend: 'up',
      trendValue: 8,
      description: 'Growing fast',
      progressColor: 'from-green-400 to-green-600'
    },
    {
      id: 'performance',
      title: 'Avg Performance',
      value: 87,
      target: 90,
      unit: '%',
      icon: <TrendingUp className="w-6 h-6" />,
      color: 'bg-purple-500',
      trend: 'up',
      trendValue: 5,
      description: 'Excellent',
      progressColor: 'from-purple-400 to-purple-600'
    },
    {
      id: 'achievements',
      title: 'Achievements',
      value: 42,
      target: 50,
      unit: '',
      icon: <Award className="w-6 h-6" />,
      color: 'bg-yellow-500',
      trend: 'stable',
      trendValue: 0,
      description: 'On track',
      progressColor: 'from-yellow-400 to-yellow-600'
    },
    {
      id: 'study-time',
      title: 'Study Time',
      value: 156,
      target: 200,
      unit: 'h',
      icon: <Clock className="w-6 h-6" />,
      color: 'bg-orange-500',
      trend: 'down',
      trendValue: -3,
      description: 'Needs improvement',
      progressColor: 'from-orange-400 to-orange-600'
    },
    {
      id: 'goals',
      title: 'Goals Achieved',
      value: 23,
      target: 30,
      unit: '',
      icon: <Target className="w-6 h-6" />,
      color: 'bg-red-500',
      trend: 'up',
      trendValue: 15,
      description: 'Great progress',
      progressColor: 'from-red-400 to-red-600'
    }
  ]);

  const [animatedValues, setAnimatedValues] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    if (!animated) return;

    // Animate the values on mount
    stats.forEach((stat, index) => {
      setTimeout(() => {
        let current = 0;
        const increment = stat.value / 60; // 60 frames for 1 second animation
        const timer = setInterval(() => {
          current += increment;
          if (current >= stat.value) {
            current = stat.value;
            clearInterval(timer);
          }
          setAnimatedValues(prev => ({ ...prev, [stat.id]: Math.floor(current) }));
        }, 16); // ~60fps
      }, index * 100);
    });
  }, [animated, stats]);

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return <ArrowUp className="w-4 h-4" />;
      case 'down':
        return <ArrowDown className="w-4 h-4" />;
      case 'stable':
        return <Minus className="w-4 h-4" />;
    }
  };

  const getTrendColor = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return 'text-green-600 bg-green-100';
      case 'down':
        return 'text-red-600 bg-red-100';
      case 'stable':
        return 'text-gray-600 bg-gray-100';
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.9 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    },
    hover: {
      scale: 1.02,
      y: -5,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    }
  };

  const progressVariants = {
    hidden: { width: 0 },
    visible: (width: number) => ({
      width: `${width}%`,
      transition: {
        duration: 1.5,
        ease: "easeOut",
        delay: 0.5
      }
    })
  };

  const iconVariants = {
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
      scale: 1.1,
      rotate: 10,
      transition: {
        duration: 0.2
      }
    }
  };

  const renderGridLayout = () => (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
      {stats.map((stat, index) => {
        const progress = (stat.value / stat.target) * 100;
        const displayValue = animatedValues[stat.id] || (animated ? 0 : stat.value);

        return (
          <motion.div
            key={stat.id}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 dark:border-gray-700"
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            whileHover="hover"
            transition={{ delay: index * 0.1 }}
          >
            <div className="flex items-center justify-between mb-4">
              <motion.div
                className={`${stat.color} p-3 rounded-xl text-white`}
                variants={iconVariants}
                whileHover="hover"
              >
                {stat.icon}
              </motion.div>
              
              <motion.div
                className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getTrendColor(stat.trend)}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
              >
                {getTrendIcon(stat.trend)}
                <span>{Math.abs(stat.trendValue)}%</span>
              </motion.div>
            </div>

            <div className="mb-3">
              <h3 className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-1">
                {stat.title}
              </h3>
              <div className="flex items-baseline gap-2">
                <motion.span
                  className="text-2xl font-bold text-gray-900 dark:text-white"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
                >
                  {displayValue.toLocaleString()}
                </motion.span>
                <span className="text-gray-500 dark:text-gray-500 text-sm">
                  {stat.unit}
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {stat.description}
              </p>
            </div>

            {showProgress && (
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                  <span>Progress</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                  <motion.div
                    className={`h-full bg-gradient-to-r ${stat.progressColor} rounded-full`}
                    variants={progressVariants}
                    initial="hidden"
                    animate="visible"
                    custom={progress}
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                  <span>Target: {stat.target.toLocaleString()}</span>
                  <span>{(stat.target - stat.value).toLocaleString()} remaining</span>
                </div>
              </div>
            )}
          </motion.div>
        );
      })}
    </div>
  );

  const renderListLayout = () => (
    <div className={`space-y-4 ${className}`}>
      {stats.map((stat, index) => {
        const progress = (stat.value / stat.target) * 100;
        const displayValue = animatedValues[stat.id] || (animated ? 0 : stat.value);

        return (
          <motion.div
            key={stat.id}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-4 border border-gray-100 dark:border-gray-700"
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            whileHover="hover"
            transition={{ delay: index * 0.1 }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <motion.div
                  className={`${stat.color} p-2 rounded-lg text-white`}
                  variants={iconVariants}
                  whileHover="hover"
                >
                  {stat.icon}
                </motion.div>
                
                <div>
                  <h3 className="text-gray-600 dark:text-gray-400 text-sm font-medium">
                    {stat.title}
                  </h3>
                  <div className="flex items-baseline gap-2">
                    <motion.span
                      className="text-xl font-bold text-gray-900 dark:text-white"
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
                    >
                      {displayValue.toLocaleString()}
                    </motion.span>
                    <span className="text-gray-500 dark:text-gray-500 text-sm">
                      {stat.unit}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <motion.div
                  className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getTrendColor(stat.trend)}`}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                >
                  {getTrendIcon(stat.trend)}
                  <span>{Math.abs(stat.trendValue)}%</span>
                </motion.div>

                {showProgress && (
                  <div className="w-24">
                    <motion.div
                      className={`h-2 bg-gradient-to-r ${stat.progressColor} rounded-full`}
                      variants={progressVariants}
                      initial="hidden"
                      animate="visible"
                      custom={progress}
                    />
                  </div>
                )}
              </div>
            </div>

            {showProgress && (
              <div className="mt-3 flex justify-between text-xs text-gray-500 dark:text-gray-400">
                <span>Target: {stat.target.toLocaleString()}</span>
                <span>{Math.round(progress)}% complete</span>
              </div>
            )}
          </motion.div>
        );
      })}
    </div>
  );

  const renderCompactLayout = () => (
    <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 ${className}`}>
      {stats.map((stat, index) => {
        const displayValue = animatedValues[stat.id] || (animated ? 0 : stat.value);

        return (
          <motion.div
            key={stat.id}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-4 border border-gray-100 dark:border-gray-700 text-center"
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            whileHover="hover"
            transition={{ delay: index * 0.05 }}
          >
            <motion.div
              className={`${stat.color} w-10 h-10 rounded-lg text-white mx-auto mb-3 flex items-center justify-center`}
              variants={iconVariants}
              whileHover="hover"
            >
              {stat.icon}
            </motion.div>
            
            <h3 className="text-gray-600 dark:text-gray-400 text-xs font-medium mb-1">
              {stat.title}
            </h3>
            
            <motion.div
              className="text-lg font-bold text-gray-900 dark:text-white mb-1"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity, delay: index * 0.1 }}
            >
              {displayValue.toLocaleString()}
            </motion.div>
            
            <motion.div
              className={`flex items-center justify-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getTrendColor(stat.trend)}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.05 }}
            >
              {getTrendIcon(stat.trend)}
              <span>{Math.abs(stat.trendValue)}%</span>
            </motion.div>
          </motion.div>
        );
      })}
    </div>
  );

  return (
    <AnimatePresence mode="wait">
      {layout === 'grid' && renderGridLayout()}
      {layout === 'list' && renderListLayout()}
      {layout === 'compact' && renderCompactLayout()}
    </AnimatePresence>
  );
};

export default QuickStatsCards;