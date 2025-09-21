import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Sparkles, Zap, Star, Play, Users, Trophy, Brain, Target, ChevronDown } from 'lucide-react';

interface AnimatedLandingProps {
  variant?: 'default' | 'minimal' | 'video';
  theme?: 'default' | 'gradient' | 'dark';
}

const AnimatedLanding: React.FC<AnimatedLandingProps> = ({ 
  variant = 'default', 
  theme = 'default' 
}) => {
  const [currentWord, setCurrentWord] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const words = ['Smarter', 'Faster', 'Personalized', 'Gamified', 'Intelligent'];
  const features = [
    { icon: '🧠', title: 'AI-Powered', description: 'Adaptive learning algorithms' },
    { icon: '⚡', title: 'Lightning Fast', description: 'Real-time feedback and analytics' },
    { icon: '🎯', title: 'Precision Targeted', description: 'Personalized study paths' },
    { icon: '🏆', title: 'Gamified', description: 'Engaging challenges and rewards' }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentWord((prev) => (prev + 1) % words.length);
        setIsAnimating(false);
      }, 300);
    }, 3000);

    return () => clearInterval(interval);
  }, [words.length]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const getThemeClasses = () => {
    switch (theme) {
      case 'gradient':
        return 'bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50';
      case 'dark':
        return 'bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900';
      default:
        return 'bg-gradient-to-br from-blue-50 to-purple-50';
    }
  };

  const getTextColor = () => {
    return theme === 'dark' ? 'text-white' : 'text-gray-900';
  };

  const getSubTextColor = () => {
    return theme === 'dark' ? 'text-gray-300' : 'text-gray-600';
  };

  const renderDefaultVariant = () => (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20" />
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-blue-400 rounded-full opacity-50"
            animate={{
              x: [Math.random() * 100, Math.random() * 100],
              y: [Math.random() * 100, Math.random() * 100],
            }}
            transition={{
              duration: Math.random() * 20 + 10,
              repeat: Infinity,
              ease: "linear"
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 pt-32 pb-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Heading */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <h1 className={`text-5xl md:text-7xl font-bold ${getTextColor()} mb-6`}>
              Assessment Made
              <span className="relative inline-block ml-4">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={currentWord}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
                  >
                    {words[currentWord]}
                  </motion.span>
                </AnimatePresence>
              </span>
            </h1>
            <p className={`text-xl md:text-2xl ${getSubTextColor()} max-w-2xl mx-auto leading-relaxed`}>
              Experience the future of learning with AI-powered assessments that adapt to your unique learning style and pace.
            </p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
          >
            <motion.button
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-semibold text-lg flex items-center gap-2 shadow-lg hover:shadow-xl transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Sparkles className="w-5 h-5" />
              Get Started Free
            </motion.button>
            
            <motion.button
              className="px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-full font-semibold text-lg flex items-center gap-2 hover:border-gray-400 transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Play className="w-5 h-5" />
              Watch Demo
            </motion.button>
          </motion.div>

          {/* Features Grid */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + index * 0.1 }}
                className="p-6 rounded-2xl bg-white/80 backdrop-blur-sm border border-white/20 shadow-lg hover:shadow-xl transition-all group"
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-600">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="flex flex-wrap justify-center gap-8 text-center"
          >
            <div>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                className="text-2xl mb-2"
              >
                🚀
              </motion.div>
              <div className="text-2xl font-bold text-gray-900">50K+</div>
              <div className="text-sm text-gray-600">Active Users</div>
            </div>
            <div>
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-2xl mb-2"
              >
                📊
              </motion.div>
              <div className="text-2xl font-bold text-gray-900">1M+</div>
              <div className="text-sm text-gray-600">Assessments</div>
            </div>
            <div>
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="text-2xl mb-2"
              >
                ⭐
              </motion.div>
              <div className="text-2xl font-bold text-gray-900">4.9</div>
              <div className="text-sm text-gray-600">User Rating</div>
            </div>
            <div>
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-2xl mb-2"
              >
                🏆
              </motion.div>
              <div className="text-2xl font-bold text-gray-900">95%</div>
              <div className="text-sm text-gray-600">Success Rate</div>
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex flex-col items-center gap-2 text-gray-500"
          >
            <span className="text-sm">Scroll to explore</span>
            <ChevronDown className="w-6 h-6" />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );

  const renderMinimalVariant = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center px-4">
      <div className="max-w-2xl text-center">
        <h1 className={`text-4xl md:text-5xl font-bold ${getTextColor()} mb-6`}>
          Assessment Made
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {' '}Intelligent
          </span>
        </h1>
        <p className={`text-lg ${getSubTextColor()} mb-8`}>
          AI-powered assessments that adapt to your learning style
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="px-6 py-3 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition-colors">
            Get Started
          </button>
          <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-full font-semibold hover:border-gray-400 transition-colors">
            Learn More
          </button>
        </div>
      </div>
    </div>
  );

  const renderVideoVariant = () => (
    <div className="min-h-screen relative">
      {/* Video Background Placeholder */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-purple-600 opacity-90" />
      
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
        <div className="max-w-4xl text-center text-white">
          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-bold mb-6"
          >
            The Future of
            <span className="block bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
              Assessment
            </span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-xl mb-8 text-gray-200"
          >
            Experience learning like never before with our AI-powered platform
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="flex justify-center"
          >
            <button className="px-8 py-4 bg-white text-blue-600 rounded-full font-semibold text-lg flex items-center gap-3 hover:shadow-xl transition-all">
              <Play className="w-6 h-6" />
              Watch Demo
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );

  return (
    <div className={getThemeClasses()}>
      {variant === 'default' && renderDefaultVariant()}
      {variant === 'minimal' && renderMinimalVariant()}
      {variant === 'video' && renderVideoVariant()}
    </div>
  );
};

export default AnimatedLanding;