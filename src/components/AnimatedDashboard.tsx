import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart3, 
  BookOpen, 
  Trophy, 
  Users, 
  Settings, 
  Home, 
  Clock, 
  Target,
  TrendingUp,
  Award,
  Brain,
  Zap,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Bell,
  Search,
  User
} from 'lucide-react';
import AnimatedMascot from './AnimatedMascot';

interface DashboardProps {
  isOpen: boolean;
  onClose: () => void;
}

const AnimatedDashboard: React.FC<DashboardProps> = ({ isOpen, onClose }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeSection, setActiveSection] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications, setNotifications] = useState(3);

  const sidebarItems = [
    { id: 'overview', icon: Home, label: 'Overview', color: 'text-purple-500' },
    { id: 'analytics', icon: BarChart3, label: 'Analytics', color: 'text-blue-500' },
    { id: 'courses', icon: BookOpen, label: 'My Courses', color: 'text-green-500' },
    { id: 'achievements', icon: Trophy, label: 'Achievements', color: 'text-yellow-500' },
    { id: 'community', icon: Users, label: 'Community', color: 'text-pink-500' },
    { id: 'settings', icon: Settings, label: 'Settings', color: 'text-gray-500' }
  ];

  const quickStats = [
    { title: 'Courses Completed', value: '12', change: '+2', icon: BookOpen, color: 'from-green-400 to-green-600' },
    { title: 'Study Streak', value: '7 days', change: '+1', icon: TrendingUp, color: 'from-blue-400 to-blue-600' },
    { title: 'Total Points', value: '2,450', change: '+180', icon: Award, color: 'from-yellow-400 to-yellow-600' },
    { title: 'Accuracy Rate', value: '87%', change: '+5%', icon: Target, color: 'from-purple-400 to-purple-600' }
  ];

  const recentActivities = [
    { type: 'quiz', title: 'Advanced Calculus Quiz', score: '95%', time: '2 hours ago', icon: Brain, color: 'text-purple-500' },
    { type: 'achievement', title: 'Speed Demon Badge', description: 'Completed 5 quizzes in under 30 minutes', time: '1 day ago', icon: Zap, color: 'text-yellow-500' },
    { type: 'course', title: 'Machine Learning Fundamentals', progress: 75, time: '3 days ago', icon: BookOpen, color: 'text-green-500' }
  ];

  const upcomingQuizzes = [
    { title: 'Data Structures', dueDate: 'Today, 3:00 PM', difficulty: 'Medium', questions: 15 },
    { title: 'Linear Algebra', dueDate: 'Tomorrow, 10:00 AM', difficulty: 'Hard', questions: 20 },
    { title: 'Web Development', dueDate: 'Friday, 2:00 PM', difficulty: 'Easy', questions: 10 }
  ];

  const sidebarVariants = {
    expanded: { 
      width: 280,
      transition: { duration: 0.3, ease: "easeInOut" }
    },
    collapsed: { 
      width: 80,
      transition: { duration: 0.3, ease: "easeInOut" }
    }
  };

  const contentVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.4, ease: "easeOut" }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5, 
        ease: "easeOut",
        staggerChildren: 0.1
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={onClose}
        >
          <motion.div
            className="fixed inset-0 bg-white dark:bg-gray-900"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <motion.header 
              className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between"
              initial={{ y: -100 }}
              animate={{ y: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
            >
              <div className="flex items-center gap-4">
                <AnimatedMascot variant="happy" size="small" />
                <div>
                  <h1 className="text-xl font-bold text-gray-800 dark:text-white">Assess AI Dashboard</h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Welcome back, Student!</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <motion.div 
                  className="relative"
                  whileHover={{ scale: 1.05 }}
                >
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search courses..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all duration-300"
                  />
                </motion.div>
                
                <motion.button
                  className="relative p-2 text-gray-600 dark:text-gray-300 hover:text-purple-500 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Bell className="w-5 h-5" />
                  {notifications > 0 && (
                    <motion.span
                      className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      {notifications}
                    </motion.span>
                  )}
                </motion.button>
                
                <motion.button
                  className="p-2 text-gray-600 dark:text-gray-300 hover:text-purple-500 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <User className="w-5 h-5" />
                </motion.button>
                
                <motion.button
                  onClick={onClose}
                  className="p-2 text-gray-600 dark:text-gray-300 hover:text-red-500 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <LogOut className="w-5 h-5" />
                </motion.button>
              </div>
            </motion.header>

            <div className="flex h-[calc(100vh-80px)]">
              {/* Sidebar */}
              <motion.aside
                className="bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col"
                variants={sidebarVariants}
                animate={sidebarCollapsed ? "collapsed" : "expanded"}
                initial="expanded"
              >
                <div className="p-4">
                  <motion.button
                    onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                    className="p-2 text-gray-600 dark:text-gray-300 hover:text-purple-500 transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {sidebarCollapsed ? <ChevronRight /> : <ChevronLeft />}
                  </motion.button>
                </div>

                <nav className="flex-1 px-4 space-y-2">
                  {sidebarItems.map((item, index) => (
                    <motion.button
                      key={item.id}
                      onClick={() => setActiveSection(item.id)}
                      className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-300 ${
                        activeSection === item.id
                          ? 'bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300'
                          : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * index }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <item.icon className={`w-5 h-5 ${item.color}`} />
                      {!sidebarCollapsed && (
                        <motion.span
                          initial={{ opacity: 0, width: 0 }}
                          animate={{ opacity: 1, width: 'auto' }}
                          transition={{ delay: 0.2 }}
                          className="font-medium"
                        >
                          {item.label}
                        </motion.span>
                      )}
                    </motion.button>
                  ))}
                </nav>
              </motion.aside>

              {/* Main Content */}
              <main className="flex-1 overflow-auto p-6">
                <motion.div
                  key={activeSection}
                  variants={contentVariants}
                  initial="hidden"
                  animate="visible"
                  className="space-y-6"
                >
                  {/* Quick Stats */}
                  <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    {quickStats.map((stat, index) => (
                      <motion.div
                        key={stat.title}
                        className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-card hover:shadow-lg transition-all duration-300"
                        variants={cardVariants}
                        whileHover={{ scale: 1.02, y: -2 }}
                      >
                        <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center mb-4`}>
                          <stat.icon className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-1">{stat.value}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{stat.title}</p>
                        <div className="flex items-center text-green-500 text-sm">
                          <span>{stat.change}</span>
                          <span className="ml-1">this week</span>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Recent Activity */}
                    <motion.div
                      className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-card"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                        <Clock className="w-5 h-5 text-purple-500" />
                        Recent Activity
                      </h3>
                      <div className="space-y-4">
                        {recentActivities.map((activity, index) => (
                          <motion.div
                            key={index}
                            className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 * index }}
                          >
                            <div className={`w-10 h-10 ${activity.color} bg-opacity-10 rounded-lg flex items-center justify-center`}>
                              <activity.icon className={`w-5 h-5 ${activity.color}`} />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-800 dark:text-white">{activity.title}</h4>
                              {activity.description && (
                                <p className="text-sm text-gray-600 dark:text-gray-400">{activity.description}</p>
                              )}
                              {activity.score && (
                                <p className="text-sm font-medium text-green-500">Score: {activity.score}</p>
                              )}
                              {activity.progress && (
                                <div className="mt-2">
                                  <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
                                    <span>Progress</span>
                                    <span>{activity.progress}%</span>
                                  </div>
                                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                    <motion.div
                                      className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                                      initial={{ width: 0 }}
                                      animate={{ width: `${activity.progress}%` }}
                                      transition={{ duration: 1, delay: 0.5 }}
                                    />
                                  </div>
                                </div>
                              )}
                            </div>
                            <span className="text-sm text-gray-500 dark:text-gray-400">{activity.time}</span>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>

                    {/* Upcoming Quizzes */}
                    <motion.div
                      className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-card"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                        <Target className="w-5 h-5 text-purple-500" />
                        Upcoming Quizzes
                      </h3>
                      <div className="space-y-3">
                        {upcomingQuizzes.map((quiz, index) => (
                          <motion.div
                            key={index}
                            className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 * index }}
                            whileHover={{ scale: 1.02 }}
                          >
                            <div>
                              <h4 className="font-medium text-gray-800 dark:text-white">{quiz.title}</h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400">{quiz.dueDate}</p>
                            </div>
                            <div className="text-right">
                              <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                                quiz.difficulty === 'Easy' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
                                quiz.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' :
                                'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                              }`}>
                                {quiz.difficulty}
                              </span>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{quiz.questions} questions</p>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              </main>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AnimatedDashboard;