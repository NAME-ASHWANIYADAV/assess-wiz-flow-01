import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, Eye, EyeOff, Sparkles, ArrowRight, Globe, Github, Twitter } from 'lucide-react';
import AnimatedMascot from './AnimatedMascot';
import { useContext } from 'react';
import { AuthContext } from '../App'; // Adjust path if needed

interface AuthFlowProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthFlow: React.FC<AuthFlowProps> = ({ isOpen, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [mascotVariant, setMascotVariant] = useState<'default' | 'thinking' | 'excited' | 'happy'>('default');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Change mascot expression based on input
    if (value.length > 0) {
      setMascotVariant('thinking');
    } else {
      setMascotVariant('default');
    }
  };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsLoading(true);
  setMascotVariant('excited');
  try {
    if (isLogin) {
      // LOGIN
      console.log("Attempting login with:", formData.email);
      const form = new URLSearchParams();
      form.append("username", formData.email);
      form.append("password", formData.password);

      const res = await fetch("https://natwest-backend.onrender.com/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: form,
      });

      console.log("Login response status:", res.status);
      if (!res.ok) {
        const errText = await res.text();
        console.error("Login failed:", errText);
        setMascotVariant('default');
        setIsLoading(false);
        alert("Login failed: " + errText);
        return;
      }
      const data = await res.json();
      console.log("Login success, token:", data.access_token);
      localStorage.setItem("token", data.access_token);

      // Fetch user info for debugging
      const userRes = await fetch("https://natwest-backend.onrender.com/users/me", {
        headers: { Authorization: `Bearer ${data.access_token}` }
      });
      console.log("User info response status:", userRes.status);
      if (userRes.ok) {
        const userData = await userRes.json();
        console.log("Fetched user info:", userData);
      } else {
        const errText = await userRes.text();
        console.error("Failed to fetch user info:", errText);
      }

      setMascotVariant('happy');
      setIsLoading(false);
      console.log("Login done, closing modal.");
      onClose();
    } else {
      // REGISTER
      if (formData.password !== formData.confirmPassword) {
        setIsLoading(false);
        setMascotVariant('default');
        alert("Passwords do not match!");
        return;
      }
      console.log("Attempting registration with:", formData.email);
      const res = await fetch("https://natwest-backend.onrender.com/users/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          name: formData.name,
        }),
      });

      console.log("Register response status:", res.status);
      if (!res.ok) {
        const errText = await res.text();
        console.error("Registration failed:", errText);
        setMascotVariant('default');
        setIsLoading(false);
        alert("Registration failed: " + errText);
        return;
      }
      setMascotVariant('happy');
      setIsLoading(false);
      alert("Registration successful! Please login.");
      setIsLogin(true);
    }
  } catch (err: any) {
    setMascotVariant('default');
    setIsLoading(false);
    console.error("Authentication error:", err.message);
    alert("Authentication error: " + err.message);
  }
};
  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setFormData({ name: '', email: '', password: '', confirmPassword: '' });
    setMascotVariant('winking');
  };

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.3, ease: "easeOut" }
    },
    exit: { 
      opacity: 0,
      transition: { duration: 0.2, ease: "easeIn" }
    }
  };

  const modalVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.8,
      y: 50
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      y: 0,
      transition: { 
        duration: 0.4, 
        ease: "easeOut",
        staggerChildren: 0.1
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.8,
      y: 50,
      transition: { duration: 0.3, ease: "easeIn" }
    }
  };

  const formItemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.3, ease: "easeOut" }
    }
  };

  const socialButtonVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.3, 
        ease: "easeOut",
        staggerChildren: 0.1
      }
    },
    hover: { 
      scale: 1.05,
      transition: { duration: 0.2 }
    },
    tap: { scale: 0.95 }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={onClose}
        >
          <motion.div
            className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-w-6xl w-full overflow-hidden"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col lg:flex-row min-h-[600px]">
              {/* Left Panel - Branding/Welcome */}
              <motion.div 
                className="lg:w-1/2 bg-gradient-to-br from-purple-600 via-pink-500 to-blue-500 p-8 flex flex-col justify-center items-center text-white relative overflow-hidden"
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                {/* Animated background elements */}
                <motion.div
                  className="absolute top-10 left-10 w-20 h-20 bg-white bg-opacity-10 rounded-full"
                  animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 180, 360]
                  }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                />
                <motion.div
                  className="absolute bottom-20 right-20 w-16 h-16 bg-white bg-opacity-10 rounded-full"
                  animate={{
                    scale: [1, 1.3, 1],
                    y: [0, -20, 0]
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />

                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
                  className="text-center"
                >
                  <AnimatedMascot 
                    variant={mascotVariant} 
                    size="large" 
                    className="mx-auto mb-6"
                  />
                  
                  <motion.h1 
                    className="text-4xl font-bold mb-4"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6 }}
                  >
                    {isLogin ? 'Welcome Back!' : 'Join Assess AI'}
                  </motion.h1>
                  
                  <motion.p 
                    className="text-xl opacity-90 mb-8"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.8 }}
                  >
                    {isLogin 
                      ? 'Sign in to continue your learning journey'
                      : 'Create your account and start learning smarter'
                    }
                  </motion.p>

                  <motion.div
                    className="space-y-4 text-left max-w-sm mx-auto"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                  >
                    <div className="flex items-center gap-3">
                      <Sparkles className="w-5 h-5" />
                      <span>AI-powered assessments</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Sparkles className="w-5 h-5" />
                      <span>Personalized learning paths</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Sparkles className="w-5 h-5" />
                      <span>Real-time progress tracking</span>
                    </div>
                  </motion.div>
                </motion.div>
              </motion.div>

              {/* Right Panel - Form */}
              <motion.div 
                className="lg:w-1/2 p-8 flex flex-col justify-center"
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">
                    {isLogin ? 'Sign In' : 'Create Account'}
                  </h2>

                  {/* Social Login */}
                  <motion.div 
                    className="space-y-3 mb-6"
                    variants={socialButtonVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <motion.button
                      className="w-full flex items-center justify-center gap-3 bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl px-4 py-3 text-gray-700 dark:text-gray-300 font-medium transition-all duration-300"
                      variants={socialButtonVariants}
                      whileHover="hover"
                      whileTap="tap"
                    >
                      <Globe className="w-5 h-5" />
                      Continue with Google
                    </motion.button>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <motion.button
                        className="flex items-center justify-center gap-2 bg-gray-900 dark:bg-gray-700 text-white rounded-xl px-4 py-3 font-medium transition-all duration-300"
                        variants={socialButtonVariants}
                        whileHover="hover"
                        whileTap="tap"
                      >
                        <Github className="w-4 h-4" />
                        GitHub
                      </motion.button>
                      
                      <motion.button
                        className="flex items-center justify-center gap-2 bg-blue-500 text-white rounded-xl px-4 py-3 font-medium transition-all duration-300"
                        variants={socialButtonVariants}
                        whileHover="hover"
                        whileTap="tap"
                      >
                        <Twitter className="w-4 h-4" />
                        Twitter
                      </motion.button>
                    </div>
                  </motion.div>

                  <div className="relative mb-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300 dark:border-gray-600" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                        or continue with email
                      </span>
                    </div>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <AnimatePresence mode="wait">
                      {!isLogin && (
                        <motion.div
                          variants={formItemVariants}
                          initial="hidden"
                          animate="visible"
                          exit="hidden"
                        >
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Full Name
                          </label>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                              type="text"
                              name="name"
                              value={formData.name}
                              onChange={handleInputChange}
                              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-300"
                              placeholder="Enter your full name"
                              required={!isLogin}
                            />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <motion.div variants={formItemVariants}>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-300"
                          placeholder="Enter your email"
                          required
                        />
                      </div>
                    </motion.div>

                    <motion.div variants={formItemVariants}>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type={showPassword ? "text" : "password"}
                          name="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-12 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-300"
                          placeholder="Enter your password"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </motion.div>

                    <AnimatePresence mode="wait">
                      {!isLogin && (
                        <motion.div
                          variants={formItemVariants}
                          initial="hidden"
                          animate="visible"
                          exit="hidden"
                        >
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Confirm Password
                          </label>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                              type={showPassword ? "text" : "password"}
                              name="confirmPassword"
                              value={formData.confirmPassword}
                              onChange={handleInputChange}
                              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-300"
                              placeholder="Confirm your password"
                              required={!isLogin}
                            />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <motion.div variants={formItemVariants} className="flex items-center justify-between">
                      <label className="flex items-center">
                        <input type="checkbox" className="rounded border-gray-300 text-purple-600 focus:ring-purple-500" />
                        <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">Remember me</span>
                      </label>
                      {isLogin && (
                        <a href="#" className="text-sm text-purple-600 hover:text-purple-800 dark:text-purple-400">
                          Forgot password?
                        </a>
                      )}
                    </motion.div>

                    <motion.button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-500 text-white py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {isLoading ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          >
                            <ArrowRight className="w-5 h-5" />
                          </motion.div>
                          Processing...
                        </>
                      ) : (
                        <>
                          {isLogin ? 'Sign In' : 'Create Account'}
                          <ArrowRight className="w-5 h-5" />
                        </>
                      )}
                    </motion.button>
                  </form>

                  <motion.div
                    className="text-center mt-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                  >
                    <p className="text-gray-600 dark:text-gray-400">
                      {isLogin ? "Don't have an account?" : "Already have an account?"}
                      <button
                        onClick={toggleAuthMode}
                        className="ml-2 text-purple-600 hover:text-purple-800 dark:text-purple-400 font-medium"
                      >
                        {isLogin ? 'Sign Up' : 'Sign In'}
                      </button>
                    </p>
                  </motion.div>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AuthFlow;