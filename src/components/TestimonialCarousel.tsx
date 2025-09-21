import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react';

interface Testimonial {
  id: number;
  name: string;
  role: string;
  company: string;
  content: string;
  rating: number;
  avatar: string;
  color: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Dr. Sarah Johnson",
    role: "Professor of Computer Science",
    company: "Stanford University",
    content: "Assess AI Wizard has completely transformed how I create and manage quizzes. The AI-powered question generation saves me hours of work, and my students love the instant feedback feature. The adaptive difficulty system ensures every student is appropriately challenged.",
    rating: 5,
    avatar: "SJ",
    color: "from-purple-400 to-pink-400",
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "High School Math Teacher",
    company: "Lincoln High School",
    content: "The gamification features have made my students actually excited about assessments. They're competing for leaderboard positions and earning badges while learning. It's incredible to see them so engaged with math concepts they used to dread.",
    rating: 5,
    avatar: "MC",
    color: "from-blue-400 to-purple-400",
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    role: "Corporate Training Manager",
    company: "TechCorp Solutions",
    content: "Our training completion rates have increased by 40% since implementing Assess AI Wizard. The analytics dashboard gives us incredible insights into employee learning patterns, and the adaptive system ensures everyone masters the material.",
    rating: 5,
    avatar: "ER",
    color: "from-green-400 to-blue-400",
  },
  {
    id: 4,
    name: "Prof. David Kim",
    role: "Department Head",
    company: "MIT",
    content: "The AI's ability to generate high-quality questions from our existing materials is remarkable. It's like having a teaching assistant that never gets tired. The plagiarism detection and learning recommendations are game-changers for academic integrity.",
    rating: 5,
    avatar: "DK",
    color: "from-yellow-400 to-orange-400",
  },
  {
    id: 5,
    name: "Lisa Thompson",
    role: "Instructional Designer",
    company: "EduTech Innovations",
    content: "I love how the platform adapts to different learning styles. Visual learners get image-based questions, while analytical thinkers receive problem-solving challenges. It's truly personalized education at scale.",
    rating: 5,
    avatar: "LT",
    color: "from-pink-400 to-red-400",
  },
  {
    id: 6,
    name: "Robert Martinez",
    role: "Training Director",
    company: "Global Finance Corp",
    content: "The ROI has been phenomenal. We've reduced training time by 30% while improving knowledge retention. The real-time analytics help us identify knowledge gaps instantly and adjust our training programs accordingly.",
    rating: 5,
    avatar: "RM",
    color: "from-indigo-400 to-purple-400",
  },
];

const TestimonialCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const nextTestimonial = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  }, []);

  const prevTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length);
  };

  const goToTestimonial = (index: number) => {
    setCurrentIndex(index);
  };

  // Auto-play functionality
  useEffect(() => {
    if (isAutoPlaying) {
      const interval = setInterval(nextTestimonial, 5000);
      return () => clearInterval(interval);
    }
  }, [isAutoPlaying, nextTestimonial]);

  // Touch/swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      nextTestimonial();
    }
    if (isRightSwipe) {
      prevTestimonial();
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        prevTestimonial();
      } else if (e.key === 'ArrowRight') {
        nextTestimonial();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const slideVariants = {
    enter: (direction: number) => {
      return {
        x: direction > 0 ? 1000 : -1000,
        opacity: 0
      };
    },
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => {
      return {
        zIndex: 0,
        x: direction < 0 ? 1000 : -1000,
        opacity: 0
      };
    }
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  const [[page, direction], setPage] = useState([0, 0]);

  const paginate = (newDirection: number) => {
    setPage([page + newDirection, newDirection]);
    if (newDirection > 0) {
      nextTestimonial();
    } else {
      prevTestimonial();
    }
  };

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
          <motion.div
            className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-full px-6 py-3 mb-6"
            whileHover={{ scale: 1.05 }}
          >
            <Star className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium text-primary">
              Loved by Educators Worldwide
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
              What Our Users Say
            </span>
          </motion.h2>
          
          <motion.p
            className="text-xl text-muted-foreground max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            viewport={{ once: true }}
          >
            Join thousands of educators who have transformed their assessment experience
          </motion.p>
        </motion.div>

        <div className="max-w-4xl mx-auto relative">
          {/* Main Testimonial Display */}
          <div 
            className="relative overflow-hidden rounded-3xl bg-white dark:bg-gray-800 shadow-2xl"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 }
                }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={1}
                onDragEnd={(e, { offset, velocity }) => {
                  const swipe = swipePower(offset.x, velocity.x);

                  if (swipe < -swipeConfidenceThreshold) {
                    paginate(1);
                  } else if (swipe > swipeConfidenceThreshold) {
                    paginate(-1);
                  }
                }}
                className="p-8 md:p-12"
              >
                <motion.div
                  className="absolute top-6 right-6 opacity-10"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                >
                  <Quote className="w-16 h-16 text-primary" />
                </motion.div>

                <motion.div
                  className="flex items-center mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <motion.div
                    className={`w-16 h-16 bg-gradient-to-br ${testimonials[currentIndex].color} rounded-2xl flex items-center justify-center mr-4 shadow-lg`}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="text-white font-bold text-lg">
                      {testimonials[currentIndex].avatar}
                    </span>
                  </motion.div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">
                      {testimonials[currentIndex].name}
                    </h3>
                    <p className="text-muted-foreground">
                      {testimonials[currentIndex].role}
                    </p>
                    <p className="text-sm text-primary font-medium">
                      {testimonials[currentIndex].company}
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  className="flex mb-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: 0.2 + i * 0.1, type: "spring", stiffness: 200 }}
                    >
                      <Star className="w-5 h-5 text-yellow-400 fill-current" />
                    </motion.div>
                  ))}
                </motion.div>

                <motion.p
                  className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  {testimonials[currentIndex].content}
                </motion.p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Buttons */}
          <motion.button
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white dark:bg-gray-800 rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 z-10"
            onClick={() => paginate(-1)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <ChevronLeft className="w-6 h-6 text-primary" />
          </motion.button>

          <motion.button
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white dark:bg-gray-800 rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 z-10"
            onClick={() => paginate(1)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <ChevronRight className="w-6 h-6 text-primary" />
          </motion.button>

          {/* Dots Indicator */}
          <motion.div
            className="flex justify-center mt-8 space-x-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            {testimonials.map((_, index) => (
              <motion.button
                key={index}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? "bg-primary scale-125"
                    : "bg-gray-300 dark:bg-gray-600 hover:bg-gray-400"
                }`}
                onClick={() => goToTestimonial(index)}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.8 }}
                animate={{
                  scale: index === currentIndex ? [1, 1.3, 1] : 1,
                }}
                transition={{
                  duration: 0.6,
                  repeat: index === currentIndex ? Infinity : 0,
                  repeatDelay: 2,
                }}
              />
            ))}
          </motion.div>

          {/* Auto-play Toggle */}
          <motion.div
            className="flex justify-center mt-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <motion.button
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                isAutoPlaying
                  ? "bg-primary text-white"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
              }`}
              onClick={() => setIsAutoPlaying(!isAutoPlaying)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isAutoPlaying ? "Pause Auto-play" : "Resume Auto-play"}
            </motion.button>
          </motion.div>

          {/* Stats */}
          <motion.div
            className="grid grid-cols-3 gap-8 mt-12 text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-card"
            >
              <motion.div
                className="text-3xl font-bold text-primary mb-2"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                50,000+
              </motion.div>
              <div className="text-sm text-muted-foreground">Active Users</div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-card"
            >
              <motion.div
                className="text-3xl font-bold text-secondary mb-2"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
              >
                1M+
              </motion.div>
              <div className="text-sm text-muted-foreground">Assessments Created</div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-card"
            >
              <motion.div
                className="text-3xl font-bold text-green-500 mb-2"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}
              >
                98%
              </motion.div>
              <div className="text-sm text-muted-foreground">Satisfaction Rate</div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialCarousel;