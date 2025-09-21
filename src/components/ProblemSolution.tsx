import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, CheckCircle, Zap, Users, Target, Brain } from 'lucide-react';

interface ProblemSolutionProps {
  variant?: 'default' | 'minimal' | 'detailed';
  theme?: 'default' | 'gradient' | 'dark';
}

const ProblemSolution: React.FC<ProblemSolutionProps> = ({ 
  variant = 'default', 
  theme = 'default' 
}) => {
  const [activeSection, setActiveSection] = useState<'problem' | 'solution'>('problem');
  const [isAnimating, setIsAnimating] = useState(false);

  const problems = [
    {
      icon: '📚',
      title: 'Static Learning',
      description: 'Traditional assessments are one-size-fits-all, leaving students disengaged',
      impact: 'Low engagement'
    },
    {
      icon: '📊',
      title: 'Limited Feedback',
      description: 'Students receive delayed or generic feedback, hindering improvement',
      impact: 'Slow progress'
    },
    {
      icon: '⏰',
      title: 'Inflexible Timing',
      description: 'Rigid schedules that don\'t accommodate different learning paces',
      impact: 'Stress & anxiety'
    },
    {
      icon: '🎯',
      title: 'Poor Targeting',
      description: 'Assessments don\'t adapt to individual skill levels and needs',
      impact: 'Ineffective learning'
    }
  ];

  const solutions = [
    {
      icon: '🧠',
      title: 'AI-Powered Adaptivity',
      description: 'Personalized learning paths that adjust to each student\'s pace and style',
      benefit: 'Enhanced engagement',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: '⚡',
      title: 'Real-time Feedback',
      description: 'Instant, actionable insights that help students improve immediately',
      benefit: 'Faster progress',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: '🎮',
      title: 'Gamified Experience',
      description: 'Interactive challenges and rewards that make learning addictive',
      benefit: 'Increased motivation',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: '📈',
      title: 'Smart Analytics',
      description: 'Detailed performance tracking with predictive insights',
      benefit: 'Data-driven learning',
      color: 'from-orange-500 to-red-500'
    }
  ];

  const getThemeClasses = () => {
    switch (theme) {
      case 'gradient':
        return 'bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50';
      case 'dark':
        return 'bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900';
      default:
        return 'bg-white';
    }
  };

  const getTextColor = () => {
    return theme === 'dark' ? 'text-white' : 'text-gray-900';
  };

  const getSubTextColor = () => {
    return theme === 'dark' ? 'text-gray-300' : 'text-gray-600';
  };

  const handleSectionToggle = () => {
    setIsAnimating(true);
    setActiveSection(activeSection === 'problem' ? 'solution' : 'problem');
    setTimeout(() => setIsAnimating(false), 500);
  };

  const renderDefaultVariant = () => (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className={`text-4xl md:text-6xl font-bold ${getTextColor()} mb-6`}>
            Transforming Assessment
          </h2>
          <p className={`text-xl ${getSubTextColor()} max-w-2xl mx-auto`}>
            Discover how we're revolutionizing the learning experience with intelligent, adaptive assessments
          </p>
        </motion.div>

        {/* Toggle Button */}
        <div className="flex justify-center mb-12">
          <motion.button
            onClick={handleSectionToggle}
            className="relative px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-semibold flex items-center gap-3 hover:shadow-lg transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              animate={{ rotate: activeSection === 'solution' ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <ArrowRight className="w-5 h-5" />
            </motion.div>
            {activeSection === 'problem' ? 'See Our Solutions' : 'View Problems'}
          </motion.button>
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {activeSection === 'problem' ? (
            <motion.div
              key="problems"
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-8"
            >
              {problems.map((problem, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-6 rounded-2xl border-2 border-red-200 bg-red-50 ${theme === 'dark' ? 'bg-red-900/20 border-red-700' : ''}`}
                >
                  <div className="flex items-start gap-4">
                    <div className="text-3xl">{problem.icon}</div>
                    <div className="flex-1">
                      <h3 className={`text-xl font-semibold ${getTextColor()} mb-2`}>
                        {problem.title}
                      </h3>
                      <p className={`${getSubTextColor()} mb-3`}>
                        {problem.description}
                      </p>
                      <div className="flex items-center gap-2 text-red-600">
                        <Target className="w-4 h-4" />
                        <span className="text-sm font-medium">{problem.impact}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="solutions"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-8"
            >
              {solutions.map((solution, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="group relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${solution.color} opacity-10 group-hover:opacity-20 transition-opacity`} />
                  <div className="relative p-6">
                    <div className="flex items-start gap-4">
                      <div className="text-3xl">{solution.icon}</div>
                      <div className="flex-1">
                        <h3 className={`text-xl font-semibold ${getTextColor()} mb-2`}>
                          {solution.title}
                        </h3>
                        <p className={`${getSubTextColor()} mb-3`}>
                          {solution.description}
                        </p>
                        <div className="flex items-center gap-2 text-green-600">
                          <CheckCircle className="w-4 h-4" />
                          <span className="text-sm font-medium">{solution.benefit}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-16 text-center"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-3xl mb-2"
              >
                🎯
              </motion.div>
              <div className={`text-2xl font-bold ${getTextColor()}`}>95%</div>
              <div className={`text-sm ${getSubTextColor()}`}>Accuracy Improvement</div>
            </div>
            <div className="text-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                className="text-3xl mb-2"
              >
                ⚡
              </motion.div>
              <div className={`text-2xl font-bold ${getTextColor()}`}>3x</div>
              <div className={`text-sm ${getSubTextColor()}`}>Faster Learning</div>
            </div>
            <div className="text-center">
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="text-3xl mb-2"
              >
                🚀
              </motion.div>
              <div className={`text-2xl font-bold ${getTextColor()}`}>87%</div>
              <div className={`text-sm ${getSubTextColor()}`}>Engagement Boost</div>
            </div>
            <div className="text-center">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-3xl mb-2"
              >
                💡
              </motion.div>
              <div className={`text-2xl font-bold ${getTextColor()}`}>10K+</div>
              <div className={`text-sm ${getSubTextColor()}`}>Students Helped</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );

  const renderMinimalVariant = () => (
    <div className="min-h-screen py-16 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className={`text-3xl font-bold ${getTextColor()} mb-8`}>
          Problems We Solve
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {problems.map((problem, index) => (
            <div key={index} className="p-4 rounded-lg bg-red-50 text-left">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">{problem.icon}</span>
                <h3 className="font-semibold">{problem.title}</h3>
              </div>
              <p className="text-sm text-gray-600">{problem.description}</p>
            </div>
          ))}
        </div>
        
        <h2 className={`text-3xl font-bold ${getTextColor()} mb-8`}>
          Our Solutions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {solutions.map((solution, index) => (
            <div key={index} className="p-4 rounded-lg bg-green-50 text-left">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">{solution.icon}</span>
                <h3 className="font-semibold">{solution.title}</h3>
              </div>
              <p className="text-sm text-gray-600">{solution.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderDetailedVariant = () => (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Problems Side */}
          <div>
            <h2 className={`text-4xl font-bold ${getTextColor()} mb-8 text-center`}>
              Current Challenges
            </h2>
            <div className="space-y-6">
              {problems.map((problem, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.2 }}
                  className="p-6 rounded-2xl bg-gradient-to-r from-red-100 to-orange-100"
                >
                  <div className="flex items-start gap-4">
                    <div className="text-4xl">{problem.icon}</div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">{problem.title}</h3>
                      <p className="text-gray-700 mb-3">{problem.description}</p>
                      <div className="flex items-center gap-2 text-red-600">
                        <Target className="w-5 h-5" />
                        <span className="font-medium">Impact: {problem.impact}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Solutions Side */}
          <div>
            <h2 className={`text-4xl font-bold ${getTextColor()} mb-8 text-center`}>
              Our Innovative Solutions
            </h2>
            <div className="space-y-6">
              {solutions.map((solution, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.2 }}
                  className="p-6 rounded-2xl bg-gradient-to-r from-green-100 to-blue-100"
                >
                  <div className="flex items-start gap-4">
                    <div className="text-4xl">{solution.icon}</div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">{solution.title}</h3>
                      <p className="text-gray-700 mb-3">{solution.description}</p>
                      <div className="flex items-center gap-2 text-green-600">
                        <CheckCircle className="w-5 h-5" />
                        <span className="font-medium">Benefit: {solution.benefit}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen ${getThemeClasses()}`}>
      {variant === 'default' && renderDefaultVariant()}
      {variant === 'minimal' && renderMinimalVariant()}
      {variant === 'detailed' && renderDetailedVariant()}
    </div>
  );
};

export default ProblemSolution;