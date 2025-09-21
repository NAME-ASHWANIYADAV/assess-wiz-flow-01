import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, Brain, Trophy } from 'lucide-react';

const HeroSection: React.FC = () => {
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
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
      },
    },
  };

  const logoVariants = {
    hidden: { scale: 0, rotate: -180 },
    visible: {
      scale: 1,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 15,
        delay: 0.5,
      },
    },
  };

  const ctaVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        delay: 1,
        type: "spring",
        stiffness: 150,
        damping: 12,
      },
    },
    hover: {
      scale: 1.05,
      transition: { type: "spring", stiffness: 400, damping: 10 },
    },
    tap: {
      scale: 0.95,
    },
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-purple-950 dark:via-gray-900 dark:to-pink-950">
      
      {/* Glowing orbs */}
      <motion.div
        className="absolute top-20 left-20 w-32 h-32 bg-primary/20 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-20 right-20 w-40 h-40 bg-secondary/20 rounded-full blur-3xl"
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.4, 0.7, 0.4],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          className="text-center max-w-5xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Animated Logo */}
          <motion.div
            className="flex items-center justify-center mb-8"
            initial="hidden"
            animate="visible"
          >
            <div className="relative">
              <motion.div
                className="w-20 h-20 bg-gradient-primary rounded-2xl flex items-center justify-center shadow-glow"
                animate={{
                  rotate: [0, 360],
                }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  ease: "linear",
                }}
              >
                <Brain className="w-10 h-10 text-white" />
              </motion.div>
              <motion.div
                className="absolute -top-2 -right-2 w-6 h-6 bg-secondary rounded-full flex items-center justify-center"
                animate={{
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <Sparkles className="w-3 h-3 text-white" />
              </motion.div>
            </div>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
            initial="hidden"
            animate="visible"
          >
            <span className="text-gradient bg-gradient-primary bg-clip-text text-transparent">
              Assess AI Wizard
            </span>
            <br />
            <motion.span
              className="text-gray-800 dark:text-gray-200"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              Smarter Assessments,
            </motion.span>
            <br />
            <motion.span
              className="text-gradient bg-gradient-secondary bg-clip-text text-transparent"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              Better Results
            </motion.span>
          </motion.h1>

          {/* Animated Tagline */}
          <motion.p
            className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed"
            initial="hidden"
            animate="visible"
          >
            Transform your assessment experience with AI-powered quizzes that adapt to your learning style. 
            <motion.span
              className="inline-block"
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              ✨
            </motion.span>
            <br />
            Real-time feedback, personalized difficulty, and gamified learning await.
          </motion.p>

          {/* Feature Pills */}
          <motion.div
            className="flex flex-wrap justify-center gap-4 mb-12"
            initial="hidden"
            animate="visible"
          >
            {[
              { icon: Brain, text: 'AI-Powered' },
              { icon: Trophy, text: 'Gamified Learning' },
              { icon: Sparkles, text: 'Adaptive Difficulty' },
            ].map((feature, index) => (
              <motion.div
                key={feature.text}
                className="flex items-center gap-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-card"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <feature.icon className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-foreground">
                  {feature.text}
                </span>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 1, type: "spring", stiffness: 150, damping: 12 }}
          >
            <motion.div whileHover="hover" whileTap="tap">
              <Button
                size="lg"
                className="bg-gradient-primary text-white px-8 py-6 text-lg rounded-xl shadow-glow hover:shadow-primary transition-all duration-300"
              >
                Try Assessment Wizard
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                size="lg"
                variant="outline"
                className="border-primary text-primary px-8 py-6 text-lg rounded-xl hover:bg-primary hover:text-white transition-all duration-300"
              >
                Watch Demo
              </Button>
            </motion.div>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
            animate={{
              y: [0, 10, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <div className="w-6 h-10 border-2 border-primary/30 rounded-full flex justify-center">
              <motion.div
                className="w-1 h-3 bg-primary rounded-full mt-2"
                animate={{
                  y: [0, 15, 0],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;