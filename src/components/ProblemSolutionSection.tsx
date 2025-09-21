import React from 'react';
import { motion } from 'framer-motion';
import { Target, Brain, TrendingUp, Users, BookOpen, Zap } from 'lucide-react';

const ProblemSolutionSection: React.FC = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
      },
    },
  };

  const iconVariants = {
    hidden: { scale: 0, rotate: -180 },
    visible: {
      scale: 1,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 15,
      },
    },
  };

  const problems = [
    {
      icon: Target,
      title: "One-Size-Fits-All Assessments",
      description: "Traditional quizzes don't adapt to individual learning styles and skill levels, leaving some students bored and others overwhelmed.",
      color: "from-red-400 to-pink-400",
    },
    {
      icon: Brain,
      title: "Limited Feedback Loops",
      description: "Students wait days or weeks for results, missing crucial opportunities to learn from mistakes while the material is fresh.",
      color: "from-orange-400 to-red-400",
    },
    {
      icon: TrendingUp,
      title: "Static Difficulty Levels",
      description: "Fixed difficulty settings don't adjust based on student performance, leading to frustration or lack of challenge.",
      color: "from-yellow-400 to-orange-400",
    },
  ];

  const solutions = [
    {
      icon: Zap,
      title: "AI-Powered Adaptation",
      description: "Our intelligent system adjusts question difficulty in real-time based on your performance, ensuring optimal challenge levels.",
      color: "from-purple-400 to-pink-400",
      highlight: "Real-time adaptation",
    },
    {
      icon: Users,
      title: "Instant Feedback & Analytics",
      description: "Get immediate insights on your answers with detailed explanations and personalized learning recommendations.",
      color: "from-blue-400 to-purple-400",
      highlight: "Instant insights",
    },
    {
      icon: BookOpen,
      title: "Gamified Learning Experience",
      description: "Earn points, unlock achievements, and compete on leaderboards while mastering concepts at your own pace.",
      color: "from-green-400 to-blue-400",
      highlight: "Gamified mastery",
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-purple-50 dark:from-gray-900 dark:to-purple-950">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <motion.h2
            className="text-4xl md:text-5xl font-bold mb-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
          >
            <span className="text-gradient bg-gradient-primary bg-clip-text text-transparent">
              The Problem &
            </span>
            <br />
            <span className="text-gradient bg-gradient-secondary bg-clip-text text-transparent">
              Our Solution
            </span>
          </motion.h2>
          <motion.p
            className="text-xl text-muted-foreground max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            viewport={{ once: true }}
          >
            Traditional assessment methods are failing modern learners. Here's how we're revolutionizing the experience.
          </motion.p>
        </motion.div>

        {/* Problems Section */}
        <motion.div
          className="mb-20"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.div
            className="text-center mb-12"
            variants={itemVariants}
          >
            <h3 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-2">
              The Challenges We Solve
            </h3>
            <div className="w-24 h-1 bg-gradient-to-r from-red-400 to-pink-400 mx-auto rounded-full"></div>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {problems.map((problem, index) => (
              <motion.div
                key={problem.title}
                className="relative group"
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-card hover:shadow-red-200/50 dark:hover:shadow-red-900/30 transition-all duration-300">
                  <motion.div
                    className={`w-16 h-16 bg-gradient-to-br ${problem.color} rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:shadow-xl transition-shadow duration-300`}
                    variants={iconVariants}
                  >
                    <problem.icon className="w-8 h-8 text-white" />
                  </motion.div>
                  <h4 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3">
                    {problem.title}
                  </h4>
                  <p className="text-muted-foreground leading-relaxed">
                    {problem.description}
                  </p>
                  <motion.div
                    className="absolute top-2 right-2 w-3 h-3 bg-red-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.7, 1, 0.7],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                    }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Arrow Transition */}
        <motion.div
          className="flex justify-center mb-12"
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          viewport={{ once: true }}
        >
          <motion.div
            className="w-16 h-16 bg-gradient-to-r from-red-400 to-purple-400 rounded-full flex items-center justify-center shadow-lg"
            animate={{
              y: [0, -10, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </motion.div>
        </motion.div>

        {/* Solutions Section */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.div
            className="text-center mb-12"
            variants={itemVariants}
          >
            <h3 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-2">
              Our Revolutionary Approach
            </h3>
            <div className="w-24 h-1 bg-gradient-to-r from-purple-400 to-pink-400 mx-auto rounded-full"></div>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {solutions.map((solution, index) => (
              <motion.div
                key={solution.title}
                className="relative group"
                variants={itemVariants}
                whileHover={{ scale: 1.02, y: -5 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-card hover:shadow-purple-200/50 dark:hover:shadow-purple-900/30 transition-all duration-300">
                  <motion.div
                    className={`w-16 h-16 bg-gradient-to-br ${solution.color} rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:shadow-xl transition-shadow duration-300`}
                    variants={iconVariants}
                  >
                    <solution.icon className="w-8 h-8 text-white" />
                  </motion.div>
                  <h4 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3">
                    {solution.title}
                  </h4>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    {solution.description}
                  </p>
                  <motion.div
                    className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/50 dark:to-pink-900/50 rounded-full text-sm font-medium text-primary"
                    whileHover={{ scale: 1.05 }}
                  >
                    <span className="bg-gradient-primary bg-clip-text text-transparent">
                      {solution.highlight}
                    </span>
                    <motion.div
                      className="ml-2 w-2 h-2 bg-primary rounded-full"
                      animate={{
                        scale: [1, 1.3, 1],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                      }}
                    />
                  </motion.div>
                  <motion.div
                    className="absolute top-2 right-2 w-3 h-3 bg-green-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.7, 1, 0.7],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: 0.5,
                    }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
        >
          <motion.div
            className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-full px-6 py-3 mb-6"
            whileHover={{ scale: 1.05 }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="w-5 h-5 text-primary" />
            </motion.div>
            <span className="text-sm font-medium text-primary">
              Ready to transform your assessments?
            </span>
          </motion.div>
          <motion.h4
            className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            viewport={{ once: true }}
          >
            Join thousands of educators already using Assess AI Wizard
          </motion.h4>
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            viewport={{ once: true }}
          >
            <motion.button
              className="bg-gradient-primary text-white px-8 py-3 rounded-xl font-semibold shadow-glow hover:shadow-primary transition-all duration-300"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              Start Free Trial
            </motion.button>
            <motion.button
              className="border-2 border-primary text-primary px-8 py-3 rounded-xl font-semibold hover:bg-primary hover:text-white transition-all duration-300"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              Schedule Demo
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default ProblemSolutionSection;