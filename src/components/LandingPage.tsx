import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Play, Star, Zap, Users, Award, Brain, ChevronDown } from 'lucide-react';
import AnimatedMascot from './AnimatedMascot';

interface LandingPageProps {
  onGetStarted: () => void;
  onViewDemo: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted, onViewDemo }) => {
  const [showDemoModal, setShowDemoModal] = useState(false);

  const features = [
    {
      icon: <Brain className="w-8 h-8" />,
      title: "AI-Powered Learning",
      description: "Adaptive assessments that learn from your responses"
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Instant Feedback",
      description: "Real-time insights and personalized recommendations"
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: "Gamified Experience",
      description: "Earn badges, points, and unlock achievements"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Collaborative Learning",
      description: "Study with friends and compete on leaderboards"
    }
  ];

  const stats = [
    { number: "50K+", label: "Active Students" },
    { number: "1M+", label: "Quizzes Completed" },
    { number: "95%", label: "Satisfaction Rate" },
    { number: "24/7", label: "AI Support" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900">
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            <div className="mb-8">
              <AnimatedMascot variant="excited" size="large" />
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-6">
              Learn Smarter with{' '}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                AI-Powered
              </span>{' '}
              Assessments
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
              Transform your learning experience with adaptive quizzes, real-time analytics, 
              and personalized study paths powered by artificial intelligence.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <motion.button
                onClick={onGetStarted}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-blue-600 text-white rounded-full font-semibold text-lg flex items-center gap-2 hover:bg-blue-700 transition-colors shadow-lg"
              >
                Start Learning Free
                <ArrowRight className="w-5 h-5" />
              </motion.button>
              
              <motion.button
                onClick={() => setShowDemoModal(true)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-white text-blue-600 rounded-full font-semibold text-lg flex items-center gap-2 hover:bg-gray-50 transition-colors shadow-lg border border-blue-200"
              >
                <Play className="w-5 h-5" />
                Watch Demo
              </motion.button>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-2xl mx-auto">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  className="text-center"
                >
                  <div className="text-3xl md:text-4xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                    {stat.number}
                  </div>
                  <div className="text-gray-600 dark:text-gray-400 text-sm">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
        
        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="flex flex-col items-center gap-2 text-gray-500 dark:text-gray-400"
          >
            <span className="text-sm">Scroll to explore</span>
            <ChevronDown className="w-5 h-5" />
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Why Choose AssessWiz?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Experience the future of learning with our cutting-edge features
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="flex justify-center mb-4 text-blue-600 dark:text-blue-400">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-3xl mx-auto bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-white"
          >
            <Star className="w-12 h-12 mx-auto mb-4" />
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Transform Your Learning?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of students who are already learning smarter with AssessWiz
            </p>
            <motion.button
              onClick={onGetStarted}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-white text-blue-600 rounded-full font-semibold text-lg hover:bg-gray-100 transition-colors shadow-lg"
            >
              Get Started Now - It's Free!
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Demo Modal */}
      <AnimatePresence>
        {showDemoModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowDemoModal(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-2xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  See AssessWiz in Action
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Experience our AI-powered learning platform with a live demo
                </p>
                <div className="bg-gray-100 dark:bg-gray-700 rounded-xl p-8 mb-6">
                  <div className="aspect-video bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <Play className="w-16 h-16 text-white" />
                  </div>
                </div>
                <div className="flex gap-4 justify-center">
                  <button
                    onClick={() => setShowDemoModal(false)}
                    className="px-6 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                  >
                    Close
                  </button>
                  <button
                    onClick={onViewDemo}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Start Demo
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LandingPage;