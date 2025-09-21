import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Zap, Target, Sparkles, TrendingUp, Users, BookOpen, Award } from 'lucide-react';

interface FeatureCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
  color: string;
  features: string[];
  index: number;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon: Icon, title, description, color, features, index }) => {
  const cardVariants = {
    hidden: { 
      opacity: 0, 
      rotateY: -15,
      scale: 0.9
    },
    visible: {
      opacity: 1,
      rotateY: 0,
      scale: 1,
      transition: {
        delay: index * 0.2,
        duration: 0.6,
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
    hover: {
      rotateY: 5,
      rotateX: -5,
      scale: 1.05,
      transition: {
        duration: 0.3,
        type: "spring",
        stiffness: 300,
        damping: 20,
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
        delay: index * 0.2 + 0.3,
      },
    },
    hover: {
      rotate: 360,
      transition: {
        duration: 0.6,
        type: "spring",
        stiffness: 200,
      },
    },
  };

  return (
    <motion.div
      className="relative group perspective-1000"
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      whileHover="hover"
      viewport={{ once: true }}
    >
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-card hover:shadow-2xl transition-all duration-300 transform-gpu preserve-3d h-full">
        {/* 3D Background Effect */}
        <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-10 rounded-3xl transition-opacity duration-300`}></div>
        
        {/* Floating Icon */}
        <motion.div
          className="relative mb-6"
          variants={iconVariants}
          initial="hidden"
          whileInView="visible"
        >
          <motion.div
            className={`w-20 h-20 bg-gradient-to-br ${color} rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-2xl transition-all duration-300`}
            whileHover={{ scale: 1.1 }}
          >
            <Icon className="w-10 h-10 text-white" />
          </motion.div>
          
          {/* Floating particles */}
          <motion.div
            className="absolute top-0 right-0 w-4 h-4 bg-primary rounded-full opacity-0 group-hover:opacity-100"
            animate={{
              y: [-10, -20, -10],
              x: [0, 10, 0],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: index * 0.1,
            }}
          />
          <motion.div
            className="absolute bottom-0 left-0 w-3 h-3 bg-secondary rounded-full opacity-0 group-hover:opacity-100"
            animate={{
              y: [10, 20, 10],
              x: [0, -10, 0],
              scale: [0.6, 1, 0.6],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: index * 0.1 + 0.5,
            }}
          />
        </motion.div>

        {/* Card Content */}
        <div className="relative">
          <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4 group-hover:scale-105 transition-transform duration-300">
            {title}
          </h3>
          <p className="text-muted-foreground mb-6 leading-relaxed group-hover:scale-105 transition-transform duration-300">
            {description}
          </p>
          
          {/* Feature List */}
          <div className="space-y-3">
            {features.map((feature, featureIndex) => (
              <motion.div
                key={featureIndex}
                className="flex items-center space-x-3 group/item"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.2 + featureIndex * 0.1 + 0.5 }}
                whileHover={{ scale: 1.02 }}
                viewport={{ once: true }}
              >
                <motion.div
                  className="w-2 h-2 bg-gradient-primary rounded-full group-hover/item:scale-150 transition-transform duration-300"
                  whileHover={{
                    scale: [1, 1.5, 1],
                    transition: { duration: 0.3 },
                  }}
                />
                <span className="text-sm text-muted-foreground group-hover/item:text-primary transition-colors duration-300">
                  {feature}
                </span>
              </motion.div>
            ))}
          </div>

          {/* Hover Effect Overlay */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
            initial={false}
          />
        </div>

        {/* 3D Corner Effect */}
        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-transparent to-primary/10 rounded-tr-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>
    </motion.div>
  );
};

const FeaturesGrid: React.FC = () => {
  const features = [
    {
      icon: Brain,
      title: "AI-Powered Quiz Generation",
      description: "Transform your content into intelligent assessments with our advanced AI technology.",
      color: "from-purple-400 to-pink-400",
      features: [
        "Automatic question generation from PDFs/DOCX",
        "Smart difficulty calibration",
        "Multiple question types (MCQ, True/False, Essay)",
        "Context-aware answer validation",
      ],
    },
    {
      icon: Target,
      title: "Adaptive Difficulty System",
      description: "Our AI adjusts question complexity in real-time based on your performance.",
      color: "from-blue-400 to-purple-400",
      features: [
        "Real-time difficulty adjustment",
        "Personalized learning paths",
        "Performance-based recommendations",
        "Smart question sequencing",
      ],
    },
    {
      icon: Zap,
      title: "Instant Feedback Engine",
      description: "Get immediate insights on your answers with detailed explanations.",
      color: "from-green-400 to-blue-400",
      features: [
        "Real-time answer validation",
        "Detailed explanation generation",
        "Learning gap identification",
        "Progress tracking analytics",
      ],
    },
    {
      icon: TrendingUp,
      title: "Advanced Analytics Dashboard",
      description: "Comprehensive insights into student performance and learning patterns.",
      color: "from-yellow-400 to-orange-400",
      features: [
        "Individual performance tracking",
        "Class-wide analytics",
        "Learning trend visualization",
        "Predictive performance modeling",
      ],
    },
    {
      icon: Users,
      title: "Collaborative Learning",
      description: "Foster engagement through peer interaction and competitive elements.",
      color: "from-pink-400 to-red-400",
      features: [
        "Real-time leaderboards",
        "Team challenges and competitions",
        "Peer review capabilities",
        "Social learning features",
      ],
    },
    {
      icon: Award,
      title: "Gamification System",
      description: "Make learning fun with points, badges, achievements, and rewards.",
      color: "from-indigo-400 to-purple-400",
      features: [
        "Point-based reward system",
        "Achievement badges and unlocks",
        "Streak tracking and bonuses",
        "Level progression system",
      ],
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const headerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        type: "spring",
        stiffness: 100,
        damping: 12,
      },
    },
  };

  return (
    <section className="py-20 bg-gradient-to-br from-white to-purple-50 dark:from-gray-900 dark:to-purple-950">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-16"
          variants={headerVariants}
          initial="hidden"
          whileInView="visible"
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
              Powered by Advanced AI
            </span>
          </motion.div>
          
          <motion.h2
            className="text-4xl md:text-5xl font-bold mb-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
          >
            <span className="text-gradient bg-gradient-primary bg-clip-text text-transparent">
              Revolutionary Features
            </span>
            <br />
            <span className="text-gradient bg-gradient-secondary bg-clip-text text-transparent">
              That Transform Learning
            </span>
          </motion.h2>
          
          <motion.p
            className="text-xl text-muted-foreground max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            viewport={{ once: true }}
          >
            Discover how our cutting-edge AI technology creates personalized, engaging, and effective assessment experiences that adapt to every learner.
          </motion.p>
        </motion.div>

        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {features.map((feature, index) => (
            <FeatureCard key={feature.title} {...feature} index={index} />
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
        >
          <motion.div
            className="inline-flex items-center gap-2 bg-gradient-to-r from-green-100 to-blue-100 dark:from-green-900/30 dark:to-blue-900/30 rounded-full px-6 py-3 mb-6"
            whileHover={{ scale: 1.05 }}
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <Award className="w-5 h-5 text-green-600" />
            </motion.div>
            <span className="text-sm font-medium text-green-600">
              Trusted by 10,000+ educators worldwide
            </span>
          </motion.div>
          
          <motion.h4
            className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-6"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            viewport={{ once: true }}
          >
            Ready to experience the future of assessments?
          </motion.h4>
          
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            viewport={{ once: true }}
          >
            <motion.button
              className="bg-gradient-primary text-white px-8 py-4 rounded-xl font-semibold shadow-glow hover:shadow-primary transition-all duration-300 text-lg"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              Start Your Free Trial
            </motion.button>
            <motion.button
              className="border-2 border-primary text-primary px-8 py-4 rounded-xl font-semibold hover:bg-primary hover:text-white transition-all duration-300 text-lg"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              Explore All Features
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesGrid;