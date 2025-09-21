import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Star, Zap, Trophy, Target, ArrowRight, Play } from 'lucide-react';

interface ConfettiParticle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  rotation: number;
  rotationSpeed: number;
}

interface SparkleParticle {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  delay: number;
}

const HeroBanner: React.FC = () => {
  const [confettiParticles, setConfettiParticles] = useState<ConfettiParticle[]>([]);
  const [sparkleParticles, setSparkleParticles] = useState<SparkleParticle[]>([]);
  const [showBanner, setShowBanner] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE'];

  useEffect(() => {
    // Trigger banner entry animation after component mounts
    setShowBanner(true);

    // Generate confetti particles
    const confetti: ConfettiParticle[] = [];
    for (let i = 0; i < 50; i++) {
      confetti.push({
        id: i,
        x: Math.random() * window.innerWidth,
        y: -20,
        vx: (Math.random() - 0.5) * 10,
        vy: Math.random() * 5 + 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 8 + 4,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 20
      });
    }
    setConfettiParticles(confetti);

    // Generate sparkle particles
    const sparkles: SparkleParticle[] = [];
    for (let i = 0; i < 20; i++) {
      sparkles.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 4 + 2,
        opacity: Math.random() * 0.8 + 0.2,
        delay: Math.random() * 2
      });
    }
    setSparkleParticles(sparkles);

    // Mouse move handler for parallax effect
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const bannerVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.8,
      y: 100,
      rotateX: -15
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      y: 0,
      rotateX: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 20
      }
    }
  };

  const sparkleVariants = {
    hidden: { opacity: 0, scale: 0 },
    visible: { 
      opacity: [0, 1, 0],
      scale: [0, 1, 0],
      transition: {
        duration: 2,
        repeat: Infinity,
        repeatDelay: Math.random() * 3
      }
    }
  };

  const confettiVariants = {
    hidden: { opacity: 0, y: -20, rotate: 0 },
    visible: (custom: ConfettiParticle) => ({
      opacity: [1, 1, 0],
      y: [custom.y, window.innerHeight + 20],
      x: [custom.x, custom.x + custom.vx * 100],
      rotate: [custom.rotation, custom.rotation + custom.rotationSpeed * 10],
      transition: {
        duration: 3 + Math.random() * 2,
        ease: "easeOut",
        delay: Math.random() * 0.5
      }
    })
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 overflow-hidden">
      {/* Animated background gradient */}
      <motion.div
        className="absolute inset-0 opacity-50"
        animate={{
          background: [
            'radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.3) 0%, transparent 50%)',
            'radial-gradient(circle at 80% 50%, rgba(255, 119, 198, 0.3) 0%, transparent 50%)',
            'radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.3) 0%, transparent 50%)'
          ]
        }}
        transition={{ duration: 8, repeat: Infinity }}
      />

      {/* Mouse parallax background */}
      <motion.div
        className="absolute inset-0"
        style={{
          transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)`
        }}
      >
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" />
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000" />
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000" />
      </motion.div>

      {/* Sparkle particles */}
      <AnimatePresence>
        {showBanner && sparkleParticles.map((sparkle) => (
          <motion.div
            key={sparkle.id}
            className="absolute pointer-events-none"
            style={{
              left: `${sparkle.x}%`,
              top: `${sparkle.y}%`,
            }}
            variants={sparkleVariants}
            initial="hidden"
            animate="visible"
            custom={sparkle}
          >
            <Star
              className="text-yellow-300"
              style={{
                width: sparkle.size,
                height: sparkle.size,
                filter: 'drop-shadow(0 0 4px rgba(255, 255, 255, 0.8))'
              }}
              fill="currentColor"
            />
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Confetti particles */}
      <AnimatePresence>
        {showBanner && confettiParticles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute pointer-events-none"
            style={{
              left: particle.x,
              top: particle.y,
              width: particle.size,
              height: particle.size,
              backgroundColor: particle.color,
              transform: `rotate(${particle.rotation}deg)`
            }}
            variants={confettiVariants}
            initial="hidden"
            animate="visible"
            custom={particle}
          />
        ))}
      </AnimatePresence>

      {/* Hero banner content */}
      <AnimatePresence>
        {showBanner && (
          <motion.div
            className="relative z-10 flex items-center justify-center min-h-screen px-4"
            variants={bannerVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="max-w-6xl mx-auto text-center">
              {/* Badge */}
              <motion.div
                variants={itemVariants}
                className="inline-flex items-center gap-2 bg-white bg-opacity-10 backdrop-blur-sm rounded-full px-6 py-3 mb-8 border border-white border-opacity-20"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                >
                  <Zap className="w-5 h-5 text-yellow-300" />
                </motion.div>
                <span className="text-white font-medium">New AI-Powered Assessment Platform</span>
              </motion.div>

              {/* Main heading */}
              <motion.h1
                variants={itemVariants}
                className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight"
              >
                Transform Your
                <motion.span
                  className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400"
                  animate={{
                    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
                  }}
                  transition={{ duration: 4, repeat: Infinity }}
                >
                  Learning Journey
                </motion.span>
              </motion.h1>

              {/* Subheading */}
              <motion.p
                variants={itemVariants}
                className="text-xl text-white text-opacity-80 mb-12 max-w-3xl mx-auto leading-relaxed"
              >
                Experience the future of education with our adaptive AI technology that personalizes 
                your learning path and helps you achieve your goals faster than ever before.
              </motion.p>

              {/* Feature pills */}
              <motion.div
                variants={itemVariants}
                className="flex flex-wrap justify-center gap-4 mb-12"
              >
                {[
                  { icon: <Trophy className="w-4 h-4" />, text: 'AI-Powered' },
                  { icon: <Target className="w-4 h-4" />, text: 'Personalized' },
                  { icon: <Zap className="w-4 h-4" />, text: 'Lightning Fast' }
                ].map((feature, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center gap-2 bg-white bg-opacity-10 backdrop-blur-sm rounded-full px-4 py-2 border border-white border-opacity-20"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {feature.icon}
                    <span className="text-white text-sm font-medium">{feature.text}</span>
                  </motion.div>
                ))}
              </motion.div>

              {/* CTA buttons */}
              <motion.div
                variants={itemVariants}
                className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              >
                <motion.button
                  className="bg-gradient-to-r from-purple-600 to-pink-500 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Get Started Free
                  <ArrowRight className="w-5 h-5" />
                </motion.button>

                <motion.button
                  className="bg-white bg-opacity-10 backdrop-blur-sm text-white px-8 py-4 rounded-xl font-semibold text-lg border border-white border-opacity-30 hover:bg-opacity-20 transition-all duration-300 flex items-center gap-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Play className="w-5 h-5" />
                  Watch Demo
                </motion.button>
              </motion.div>

              {/* Stats */}
              <motion.div
                variants={itemVariants}
                className="grid grid-cols-3 gap-8 mt-16 max-w-2xl mx-auto"
              >
                {[
                  { number: '50K+', label: 'Active Students' },
                  { number: '95%', label: 'Success Rate' },
                  { number: '4.9/5', label: 'User Rating' }
                ].map((stat, index) => (
                  <motion.div
                    key={index}
                    className="text-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1 + index * 0.1 }}
                  >
                    <motion.div
                      className="text-3xl font-bold text-white mb-2"
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
                    >
                      {stat.number}
                    </motion.div>
                    <div className="text-white text-opacity-70 text-sm">{stat.label}</div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <motion.div
          className="w-6 h-10 border-2 border-white border-opacity-50 rounded-full flex justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
        >
          <motion.div
            className="w-1 h-3 bg-white rounded-full mt-2"
            animate={{ y: [0, 15, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default HeroBanner;