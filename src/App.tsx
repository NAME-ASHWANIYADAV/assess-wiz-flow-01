import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Menu, X, Sparkles, Twitter, Github, Linkedin } from 'lucide-react';

import LandingPage from './components/LandingPage';
import AuthWrapper from './components/AuthWrapper';
import AnimatedDashboard from './components/AnimatedDashboard';
import QuizInterface from './components/QuizInterface';

// Demo data
const features = [
  {
    title: "Seamless Authentication",
    description: "Experience frictionless login with social authentication and biometric options.",
    icon: "🔐",
    color: "from-blue-500 to-purple-600"
  },
  {
    title: "Interactive Dashboard",
    description: "Navigate through our feature-rich dashboard with real-time analytics and insights.",
    icon: "📊",
    color: "from-green-500 to-teal-600"
  },
  {
    title: "Adaptive Quiz Interface",
    description: "Experience intelligent quizzes that adapt to your skill level in real-time.",
    icon: "🎯",
    color: "from-purple-500 to-pink-600"
  },
  {
    title: "Gamified Learning",
    description: "Stay motivated with achievements, leaderboards, and interactive elements.",
    icon: "🏆",
    color: "from-orange-500 to-red-600"
  }
];

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Product Manager",
    company: "TechCorp",
    content: "The gamified assessment experience is incredible. Our team engagement increased by 300%!",
    avatar: "👩‍💼"
  },
  {
    name: "Michael Chen",
    role: "CTO",
    company: "StartupXYZ",
    content: "AssessWiz transformed how we evaluate candidates. The AI-powered insights are game-changing.",
    avatar: "👨‍💻"
  },
  {
    name: "Emily Rodriguez",
    role: "HR Director",
    company: "GlobalCorp",
    content: "The seamless authentication and intuitive interface made onboarding a breeze.",
    avatar: "👩‍💼"
  }
];

const stats = [
  { label: "Active Users", value: "50K+", icon: "👥" },
  { label: "Assessments", value: "100K+", icon: "📋" },
  { label: "Success Rate", value: "95%", icon: "✅" },
  { label: "Avg. Score", value: "87%", icon: "📈" }
];

function App() {
  const [currentView, setCurrentView] = useState('landing');
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const handleGetStarted = () => {
    setCurrentView('auth');
  };

  const handleAuthClose = () => {
    setCurrentView('landing');
  };

  const handleLoginSuccess = () => {
    setCurrentView('dashboard');
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const scrollToSection = (sectionId: string) => {
    setCurrentView('landing');
    // Scroll will be handled by the LandingPage component
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-800 shadow-lg backdrop-blur-sm bg-opacity-90">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent cursor-pointer"
              onClick={() => scrollToSection('landing')}
            >
              AssessWiz
            </motion.div>
            
            <div className="hidden md:flex items-center gap-8">
              <button
                onClick={() => scrollToSection('landing')}
                className={`font-medium transition-colors ${
                  currentView === 'landing' 
                    ? 'text-blue-600 dark:text-blue-400' 
                    : 'text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
                }`}
              >
                Home
              </button>
              <button
                onClick={() => scrollToSection('features')}
                className={`font-medium transition-colors ${
                  currentView === 'features' 
                    ? 'text-blue-600 dark:text-blue-400' 
                    : 'text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
                }`}
              >
                Features
              </button>
              <button
                onClick={() => scrollToSection('pricing')}
                className={`font-medium transition-colors ${
                  currentView === 'pricing' 
                    ? 'text-blue-600 dark:text-blue-400' 
                    : 'text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
                }`}
              >
                Pricing
              </button>
              <button
                onClick={() => scrollToSection('about')}
                className={`font-medium transition-colors ${
                  currentView === 'about' 
                    ? 'text-blue-600 dark:text-blue-400' 
                    : 'text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
                }`}
              >
                About
              </button>
              <button
                onClick={() => scrollToSection('testimonials')}
                className={`font-medium transition-colors ${
                  currentView === 'testimonials' 
                    ? 'text-blue-600 dark:text-blue-400' 
                    : 'text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
                }`}
              >
                Testimonials
              </button>
              <button
                onClick={() => scrollToSection('demo')}
                className={`font-medium transition-colors ${
                  currentView === 'demo' 
                    ? 'text-blue-600 dark:text-blue-400' 
                    : 'text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
                }`}
              >
                Demo
              </button>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                {isDarkMode ? '☀️' : '🌙'}
              </button>
              <button
                onClick={handleGetStarted}
                className="px-6 py-2 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition-colors"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10">
        {currentView === 'landing' && <LandingPage onGetStarted={handleGetStarted} />}
        {currentView === 'auth' && <AuthWrapper isOpen={true} onClose={handleAuthClose} onLoginSuccess={handleLoginSuccess} />}
        {currentView === 'dashboard' && <AnimatedDashboard isOpen={true} onClose={() => setCurrentView('landing')} />}
        {currentView === 'quiz' && <QuizInterface isOpen={true} onClose={() => setCurrentView('dashboard')} />}
        {currentView === 'features' && (
          <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-blue-900 py-20">
            <div className="container mx-auto px-4">
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-center mb-16"
              >
                <h2 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4">
                  Powerful Features
                </h2>
                <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                  Discover the tools that make AssessWiz the ultimate assessment platform
                </p>
              </motion.div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.2 }}
                    className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-shadow"
                  >
                    <div className="text-4xl mb-4">{feature.icon}</div>
                    <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        )}
        {currentView === 'testimonials' && (
          <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-900 py-20">
            <div className="container mx-auto px-4">
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-center mb-16"
              >
                <h2 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4">
                  What Our Users Say
                </h2>
                <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                  Join thousands of satisfied users who transformed their assessment experience
                </p>
              </motion.div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {testimonials.map((testimonial, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.2 }}
                    className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl"
                  >
                    <div className="text-4xl mb-4">{testimonial.avatar}</div>
                    <p className="text-gray-600 dark:text-gray-300 mb-6 italic">"{testimonial.content}"</p>
                    <div>
                      <h4 className="font-bold">{testimonial.name}</h4>
                      <p className="text-gray-500">{testimonial.role} at {testimonial.company}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        )}
        {currentView === 'pricing' && (
          <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-green-900 py-20">
            <div className="container mx-auto px-4">
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-center mb-16"
              >
                <h2 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4">
                  Simple Pricing
                </h2>
                <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                  Choose the plan that works best for you
                </p>
              </motion.div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl">
                  <h3 className="text-2xl font-bold mb-4">Free</h3>
                  <p className="text-4xl font-bold mb-6">$0<span className="text-lg text-gray-600">/month</span></p>
                  <ul className="space-y-3 mb-8">
                    <li className="flex items-center gap-2">✓ Basic quizzes</li>
                    <li className="flex items-center gap-2">✓ Limited analytics</li>
                    <li className="flex items-center gap-2">✓ Community support</li>
                  </ul>
                  <button className="w-full py-3 bg-gray-200 dark:bg-gray-700 rounded-full font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                    Get Started
                  </button>
                </div>
                <div className="bg-blue-600 dark:bg-blue-700 rounded-2xl p-8 shadow-xl text-white transform scale-105">
                  <h3 className="text-2xl font-bold mb-4">Pro</h3>
                  <p className="text-4xl font-bold mb-6">$9<span className="text-lg opacity-80">/month</span></p>
                  <ul className="space-y-3 mb-8">
                    <li className="flex items-center gap-2">✓ Unlimited quizzes</li>
                    <li className="flex items-center gap-2">✓ Advanced analytics</li>
                    <li className="flex items-center gap-2">✓ AI-powered insights</li>
                    <li className="flex items-center gap-2">✓ Priority support</li>
                  </ul>
                  <button className="w-full py-3 bg-white text-blue-600 rounded-full font-semibold hover:bg-gray-100 transition-colors">
                    Start Free Trial
                  </button>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl">
                  <h3 className="text-2xl font-bold mb-4">Enterprise</h3>
                  <p className="text-4xl font-bold mb-6">Custom</p>
                  <ul className="space-y-3 mb-8">
                    <li className="flex items-center gap-2">✓ Everything in Pro</li>
                    <li className="flex items-center gap-2">✓ Custom branding</li>
                    <li className="flex items-center gap-2">✓ API access</li>
                    <li className="flex items-center gap-2">✓ Dedicated support</li>
                  </ul>
                  <button className="w-full py-3 bg-gray-200 dark:bg-gray-700 rounded-full font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                    Contact Sales
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        {currentView === 'about' && (
          <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 dark:from-gray-900 dark:to-orange-900 py-20">
            <div className="container mx-auto px-4">
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-center mb-16"
              >
                <h2 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4">
                  About AssessWiz
                </h2>
                <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                  We're on a mission to revolutionize how people learn and assess their knowledge through AI-powered technology.
                </p>
              </motion.div>
              <div className="max-w-4xl mx-auto space-y-16">
                <div className="text-center">
                  <h3 className="text-3xl font-bold mb-6">Our Story</h3>
                  <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                    Founded in 2024, AssessWiz was born from the belief that learning should be personalized, 
                    engaging, and accessible to everyone. Our team of educators and technologists came together 
                    to create an AI-powered platform that adapts to each learner's unique needs.
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-xl">
                    <div className="text-4xl mb-4">🎯</div>
                    <h4 className="text-xl font-bold mb-2">Our Mission</h4>
                    <p className="text-gray-600 dark:text-gray-300">Make quality education accessible and personalized for everyone.</p>
                  </div>
                  <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-xl">
                    <div className="text-4xl mb-4">💡</div>
                    <h4 className="text-xl font-bold mb-2">Our Vision</h4>
                    <p className="text-gray-600 dark:text-gray-300">Empower learners worldwide with AI-driven educational tools.</p>
                  </div>
                  <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-xl">
                    <div className="text-4xl mb-4">🚀</div>
                    <h4 className="text-xl font-bold mb-2">Our Values</h4>
                    <p className="text-gray-600 dark:text-gray-300">Innovation, accessibility, and learner success above all.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {currentView === 'demo' && (
          <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-900 dark:to-purple-900 py-20">
            <div className="container mx-auto px-4">
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-center mb-16"
              >
                <h2 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4">
                  Interactive Demo
                </h2>
                <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                  Try out our interactive components and see AssessWiz in action
                </p>
              </motion.div>
              
              <div className="space-y-16 max-w-6xl mx-auto">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl"
                >
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-bold">Dashboard Preview</h3>
                    <button
                      onClick={() => setCurrentView('dashboard')}
                      className="px-6 py-2 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition-colors"
                    >
                      Open Full Dashboard
                    </button>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <QuickStatsCards stats={stats} variant="card" />
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl"
                >
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-bold">Quiz Interface</h3>
                    <button
                      onClick={() => setCurrentView('quiz')}
                      className="px-6 py-2 bg-purple-600 text-white rounded-full font-semibold hover:bg-purple-700 transition-colors"
                    >
                      Start Quiz
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <h4 className="font-semibold mb-3">Confidence Level</h4>
                      <ConfidenceSlider />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-3">Difficulty</h4>
                      <AdaptiveDifficultyIndicator />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-3">Timer</h4>
                      <CircularCountdown />
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl"
                >
                  <h3 className="text-2xl font-bold mb-6">Component Showcase</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="text-center">
                      <h4 className="font-semibold mb-3">Social Login</h4>
                      <SocialLoginButtons />
                    </div>
                    <div className="text-center">
                      <h4 className="font-semibold mb-3">Hero Banner</h4>
                      <HeroBanner />
                    </div>
                    <div className="text-center">
                      <h4 className="font-semibold mb-3">Animated Form</h4>
                      <AnimatedForm formType="signup" onSubmit={(data) => {}} />
                    </div>
                    <div className="text-center">
                      <h4 className="font-semibold mb-3">Gamification</h4>
                      <GamificationUI />
                    </div>
                    <div className="text-center">
                      <h4 className="font-semibold mb-3">Leaderboard</h4>
                      <AnimatedLeaderboard />
                    </div>
                    <div className="text-center">
                      <h4 className="font-semibold mb-3">Mascot</h4>
                      <AnimatedMascot />
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-6 h-6 text-blue-400" />
                <span className="text-xl font-bold">AssessWiz</span>
              </div>
              <p className="text-gray-400">
                Revolutionizing assessment with AI-powered, gamified learning experiences.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li><button onClick={() => scrollToSection('features')} className="hover:text-white transition-colors">Features</button></li>
                <li><button onClick={() => scrollToSection('pricing')} className="hover:text-white transition-colors">Pricing</button></li>
                <li><button onClick={() => scrollToSection('demo')} className="hover:text-white transition-colors">Demo</button></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li><button onClick={() => scrollToSection('about')} className="hover:text-white transition-colors">About</button></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Connect</h3>
              <div className="flex gap-4">
                <Twitter className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer transition-colors" />
                <Github className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer transition-colors" />
                <Linkedin className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer transition-colors" />
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 AssessWiz. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
