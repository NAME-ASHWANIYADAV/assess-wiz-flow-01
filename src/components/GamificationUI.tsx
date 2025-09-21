import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Star, 
  Trophy, 
  Zap, 
  Target, 
  Award, 
  Gem, 
  Crown, 
  Flame,
  Sparkles,
  Gift,
  Lock,
  CheckCircle,
  TrendingUp,
  TrendingDown,
  RotateCcw,
  Share2,
  Download,
  Settings,
  Info,
  Play,
  Pause,
  SkipForward,
  Plus,
  Minus
} from 'lucide-react';

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  borderColor: string;
  requirement: number;
  type: 'points' | 'streak' | 'accuracy' | 'completion' | 'special';
  unlocked: boolean;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  animation?: string;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  points: number;
  icon: React.ReactNode;
  unlocked: boolean;
  progress: number;
  maxProgress: number;
}

interface LeaderboardEntry {
  id: string;
  name: string;
  score: number;
  avatar: string;
  streak: number;
  level: number;
  isCurrentUser?: boolean;
}

const badges: Badge[] = [
  {
    id: 'first-quiz',
    name: 'First Steps',
    description: 'Complete your first quiz',
    icon: <Star className="w-6 h-6" />,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100',
    borderColor: 'border-yellow-300',
    requirement: 1,
    type: 'completion',
    unlocked: true,
    rarity: 'common',
    animation: 'bounce'
  },
  {
    id: 'streak-7',
    name: 'Week Warrior',
    description: 'Maintain a 7-day streak',
    icon: <Flame className="w-6 h-6" />,
    color: 'text-orange-600',
    bgColor: 'bg-orange-100',
    borderColor: 'border-orange-300',
    requirement: 7,
    type: 'streak',
    unlocked: false,
    rarity: 'rare',
    animation: 'pulse'
  },
  {
    id: 'accuracy-90',
    name: 'Precision Master',
    description: 'Achieve 90% accuracy',
    icon: <Target className="w-6 h-6" />,
    color: 'text-green-600',
    bgColor: 'bg-green-100',
    borderColor: 'border-green-300',
    requirement: 90,
    type: 'accuracy',
    unlocked: false,
    rarity: 'epic',
    animation: 'spin'
  },
  {
    id: 'points-1000',
    name: 'Point Collector',
    description: 'Earn 1000 points',
    icon: <Gem className="w-6 h-6" />,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
    borderColor: 'border-purple-300',
    requirement: 1000,
    type: 'points',
    unlocked: false,
    rarity: 'rare',
    animation: 'float'
  },
  {
    id: 'quiz-master',
    name: 'Quiz Master',
    description: 'Complete 50 quizzes',
    icon: <Trophy className="w-6 h-6" />,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    borderColor: 'border-blue-300',
    requirement: 50,
    type: 'completion',
    unlocked: false,
    rarity: 'epic',
    animation: 'glow'
  },
  {
    id: 'speed-demon',
    name: 'Speed Demon',
    description: 'Complete 10 quizzes under 2 minutes',
    icon: <Zap className="w-6 h-6" />,
    color: 'text-red-600',
    bgColor: 'bg-red-100',
    borderColor: 'border-red-300',
    requirement: 10,
    type: 'special',
    unlocked: false,
    rarity: 'legendary',
    animation: 'lightning'
  }
];

const achievements: Achievement[] = [
  {
    id: 'quick-learner',
    title: 'Quick Learner',
    description: 'Complete 5 quizzes in one day',
    points: 100,
    icon: <Zap className="w-5 h-5" />,
    unlocked: true,
    progress: 5,
    maxProgress: 5
  },
  {
    id: 'consistent',
    title: 'Consistent Performer',
    description: 'Score above 80% for 7 days straight',
    points: 250,
    icon: <TrendingUp className="w-5 h-5" />,
    unlocked: false,
    progress: 4,
    maxProgress: 7
  },
  {
    id: 'perfectionist',
    title: 'Perfectionist',
    description: 'Get 100% on 3 consecutive quizzes',
    points: 500,
    icon: <Award className="w-5 h-5" />,
    unlocked: false,
    progress: 1,
    maxProgress: 3
  }
];

const leaderboardData: LeaderboardEntry[] = [
  { id: '1', name: 'Alex Chen', score: 2450, avatar: '🦊', streak: 15, level: 8, isCurrentUser: false },
  { id: '2', name: 'Sarah Johnson', score: 2380, avatar: '🦄', streak: 12, level: 7, isCurrentUser: false },
  { id: '3', name: 'You', score: 2250, avatar: '🐉', streak: 10, level: 7, isCurrentUser: true },
  { id: '4', name: 'Mike Wilson', score: 2100, avatar: '🦁', streak: 8, level: 6, isCurrentUser: false },
  { id: '5', name: 'Emma Davis', score: 1950, avatar: '🦅', streak: 5, level: 5, isCurrentUser: false }
];

interface GamificationUIProps {
  currentPoints?: number;
  currentStreak?: number;
  currentLevel?: number;
  showAnimations?: boolean;
  showLeaderboard?: boolean;
  showBadges?: boolean;
  showAchievements?: boolean;
  theme?: 'default' | 'dark' | 'colorful' | 'minimal';
  size?: 'small' | 'medium' | 'large';
  onPointsEarn?: (points: number) => void;
  onBadgeUnlock?: (badge: Badge) => void;
  variant?: 'dashboard' | 'compact' | 'full' | 'floating';
}

const GamificationUI: React.FC<GamificationUIProps> = ({
  currentPoints = 1250,
  currentStreak = 10,
  currentLevel = 7,
  showAnimations = true,
  showLeaderboard = true,
  showBadges = true,
  showAchievements = true,
  theme = 'default',
  size = 'medium',
  onPointsEarn,
  onBadgeUnlock,
  variant = 'dashboard'
}) => {
  const [points, setPoints] = useState(currentPoints);
  const [streak, setStreak] = useState(currentStreak);
  const [level, setLevel] = useState(currentLevel);
  const [userBadges, setUserBadges] = useState(badges);
  const [newBadge, setNewBadge] = useState<Badge | null>(null);
  const [pointsAnimation, setPointsAnimation] = useState(false);
  const [streakAnimation, setStreakAnimation] = useState(false);
  const [showBadgeAnimation, setShowBadgeAnimation] = useState(false);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [nextLevelPoints, setNextLevelPoints] = useState((currentLevel + 1) * 500);
  const pointsRef = useRef<HTMLSpanElement>(null);

  const themeClasses = {
    default: 'bg-white text-gray-900',
    dark: 'bg-gray-900 text-white',
    colorful: 'bg-gradient-to-br from-purple-600 to-pink-600 text-white',
    minimal: 'bg-gray-50 text-gray-900'
  };

  const sizeClasses = {
    small: 'p-4 space-y-3',
    medium: 'p-6 space-y-4',
    large: 'p-8 space-y-6'
  };

  // Animate points counter
  const animatePoints = (newPoints: number) => {
    const difference = newPoints - points;
    const steps = Math.abs(difference);
    const stepSize = difference / steps;
    
    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < steps) {
        setPoints(prev => prev + stepSize);
        currentStep++;
      } else {
        clearInterval(interval);
        setPoints(newPoints);
      }
    }, 50);
  };

  // Check for badge unlocks
  const checkBadgeUnlocks = (newPoints: number, newStreak: number) => {
    userBadges.forEach(badge => {
      if (!badge.unlocked) {
        let shouldUnlock = false;
        
        switch (badge.type) {
          case 'points':
            shouldUnlock = newPoints >= badge.requirement;
            break;
          case 'streak':
            shouldUnlock = newStreak >= badge.requirement;
            break;
          case 'completion':
            // This would come from actual completion data
            break;
          case 'accuracy':
            // This would come from actual accuracy data
            break;
        }
        
        if (shouldUnlock) {
          unlockBadge(badge);
        }
      }
    });
  };

  const unlockBadge = (badge: Badge) => {
    setUserBadges(prev => 
      prev.map(b => b.id === badge.id ? { ...b, unlocked: true } : b)
    );
    setNewBadge(badge);
    setShowBadgeAnimation(true);
    
    if (onBadgeUnlock) {
      onBadgeUnlock(badge);
    }
    
    // Add points for unlocking badge
    const badgePoints = badge.rarity === 'common' ? 50 : 
                        badge.rarity === 'rare' ? 100 : 
                        badge.rarity === 'epic' ? 200 : 500;
    
    setTimeout(() => {
      animatePoints(points + badgePoints);
      setShowBadgeAnimation(false);
      setNewBadge(null);
    }, 3000);
  };

  // Simulate earning points
  const earnPoints = (amount: number) => {
    setPointsAnimation(true);
    animatePoints(points + amount);
    
    // Check for level up
    if (points + amount >= nextLevelPoints) {
      setTimeout(() => {
        setLevel(prev => prev + 1);
        setNextLevelPoints((level + 1) * 500);
        setShowLevelUp(true);
        setTimeout(() => setShowLevelUp(false), 3000);
      }, 1000);
    }
    
    setTimeout(() => setPointsAnimation(false), 1000);
    
    if (onPointsEarn) {
      onPointsEarn(amount);
    }
    
    checkBadgeUnlocks(points + amount, streak);
  };

  // Badge animation variants
  const badgeVariants = {
    locked: { 
      scale: 0.9, 
      opacity: 0.5,
      filter: 'grayscale(100%)'
    },
    unlocked: { 
      scale: 1, 
      opacity: 1,
      filter: 'grayscale(0%)',
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 20
      }
    },
    hover: {
      scale: 1.05,
      transition: { duration: 0.2 }
    }
  };

  const newBadgeVariants = {
    hidden: { scale: 0, rotate: -180, opacity: 0 },
    visible: {
      scale: 1,
      rotate: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 15,
        staggerChildren: 0.1
      }
    },
    exit: {
      scale: 0,
      rotate: 180,
      opacity: 0,
      transition: { duration: 0.3 }
    }
  };

  const pointsCounterVariants = {
    idle: { scale: 1 },
    animate: {
      scale: [1, 1.1, 1],
      transition: {
        duration: 0.3,
        repeat: pointsAnimation ? 2 : 0
      }
    }
  };

  const streakVariants = {
    idle: { scale: 1, rotate: 0 },
    animate: {
      scale: [1, 1.2, 1],
      rotate: [0, 10, -10, 0],
      transition: {
        duration: 0.5,
        repeat: streakAnimation ? 1 : 0
      }
    }
  };

  const leaderboardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const leaderboardItemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { type: "spring", stiffness: 200 }
    }
  };

  const renderDashboardVariant = () => (
    <div className={`${themeClasses[theme]} ${sizeClasses[size]} rounded-2xl shadow-lg`}>
      {/* Header Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <motion.div
          variants={pointsCounterVariants}
          animate={pointsAnimation ? "animate" : "idle"}
          className="text-center"
        >
          <div className={`text-2xl font-bold ${theme === 'colorful' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
            {Math.floor(points).toLocaleString()}
          </div>
          <div className={`text-sm ${theme === 'colorful' ? 'text-white/80' : 'text-gray-500'}`}>
            Points
          </div>
          <div className={`w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1 mt-2`}>
            <motion.div
              className={`h-1 rounded-full ${
                theme === 'colorful' ? 'bg-white' : 'bg-blue-600'
              }`}
              style={{ width: `${(points / nextLevelPoints) * 100}%` }}
              initial={{ width: 0 }}
              animate={{ width: `${(points / nextLevelPoints) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </motion.div>

        <motion.div
          variants={streakVariants}
          animate={streakAnimation ? "animate" : "idle"}
          className="text-center"
        >
          <div className="flex items-center justify-center gap-1 mb-1">
            <Flame className={`w-5 h-5 ${theme === 'colorful' ? 'text-yellow-300' : 'text-orange-500'}`} />
            <div className={`text-2xl font-bold ${theme === 'colorful' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
              {streak}
            </div>
          </div>
          <div className={`text-sm ${theme === 'colorful' ? 'text-white/80' : 'text-gray-500'}`}>
            Day Streak
          </div>
        </motion.div>

        <div className="text-center">
          <div className={`text-2xl font-bold ${theme === 'colorful' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
            Lv. {level}
          </div>
          <div className={`text-sm ${theme === 'colorful' ? 'text-white/80' : 'text-gray-500'}`}>
            Level
          </div>
        </div>
      </div>

      {/* Badges Section */}
      {showBadges && (
        <div className="mb-6">
          <h3 className={`text-lg font-semibold mb-3 ${theme === 'colorful' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
            Badges
          </h3>
          <div className="grid grid-cols-3 gap-3">
            {userBadges.slice(0, 6).map((badge) => (
              <motion.div
                key={badge.id}
                variants={badgeVariants}
                initial="locked"
                animate={badge.unlocked ? "unlocked" : "locked"}
                whileHover="hover"
                className={`p-3 rounded-xl border-2 ${badge.borderColor} ${badge.bgColor} cursor-pointer`}
                title={badge.description}
              >
                <div className={`${badge.color} flex items-center justify-center`}>
                  {badge.icon}
                </div>
                <div className={`text-xs font-medium ${badge.color} text-center mt-1`}>
                  {badge.name}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Achievements Section */}
      {showAchievements && (
        <div className="mb-6">
          <h3 className={`text-lg font-semibold mb-3 ${theme === 'colorful' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
            Recent Achievements
          </h3>
          <div className="space-y-2">
            {achievements.slice(0, 3).map((achievement) => (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className={`p-3 rounded-lg ${
                  achievement.unlocked
                    ? theme === 'colorful' 
                      ? 'bg-white/20'
                      : 'bg-green-50 dark:bg-green-900/20'
                    : theme === 'colorful'
                    ? 'bg-white/10'
                    : 'bg-gray-50 dark:bg-gray-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${
                      achievement.unlocked
                        ? 'bg-green-100 dark:bg-green-900'
                        : 'bg-gray-100 dark:bg-gray-700'
                    }`}>
                      {achievement.icon}
                    </div>
                    <div>
                      <div className={`font-medium ${
                        theme === 'colorful' ? 'text-white' : 
                        achievement.unlocked ? 'text-green-700 dark:text-green-400' : 
                        'text-gray-700 dark:text-gray-300'
                      }`}>
                        {achievement.title}
                      </div>
                      <div className={`text-sm ${
                        theme === 'colorful' ? 'text-white/80' : 'text-gray-500'
                      }`}>
                        {achievement.description}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`font-bold ${
                      theme === 'colorful' ? 'text-yellow-300' : 'text-yellow-600'
                    }`}>
                      +{achievement.points}
                    </div>
                    <div className="text-xs text-gray-500">
                      {achievement.progress}/{achievement.maxProgress}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Leaderboard Section */}
      {showLeaderboard && (
        <motion.div
          variants={leaderboardVariants}
          initial="hidden"
          animate="visible"
        >
          <h3 className={`text-lg font-semibold mb-3 ${theme === 'colorful' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
            Leaderboard
          </h3>
          <div className="space-y-2">
            {leaderboardData.map((entry, index) => (
              <motion.div
                key={entry.id}
                variants={leaderboardItemVariants}
                className={`flex items-center justify-between p-3 rounded-lg ${
                  entry.isCurrentUser
                    ? theme === 'colorful'
                      ? 'bg-white/30 border-2 border-white/50'
                      : 'bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-300'
                    : theme === 'colorful'
                    ? 'bg-white/10'
                    : 'bg-gray-50 dark:bg-gray-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-lg ${
                    index === 0 ? 'bg-yellow-100' :
                    index === 1 ? 'bg-gray-100' :
                    index === 2 ? 'bg-orange-100' :
                    'bg-gray-50'
                  }`}>
                    {index < 3 ? ['🥇', '🥈', '🥉'][index] : entry.avatar}
                  </div>
                  <div>
                    <div className={`font-medium ${
                      entry.isCurrentUser && theme !== 'colorful'
                        ? 'text-blue-700 dark:text-blue-400'
                        : theme === 'colorful'
                        ? 'text-white'
                        : 'text-gray-900 dark:text-white'
                    }`}>
                      {entry.name}
                    </div>
                    <div className={`text-sm ${theme === 'colorful' ? 'text-white/80' : 'text-gray-500'}`}>
                      Lv. {entry.level} • {entry.streak} day streak
                    </div>
                  </div>
                </div>
                <div className={`font-bold ${theme === 'colorful' ? 'text-yellow-300' : 'text-yellow-600'}`}>
                  {entry.score.toLocaleString()}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Demo Controls */}
      <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-800 rounded-xl">
        <h4 className="text-sm font-semibold mb-3">Demo Controls</h4>
        <div className="flex gap-2 flex-wrap">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => earnPoints(50)}
            className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
          >
            Earn 50 Points
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setStreakAnimation(true);
              setStreak(prev => prev + 1);
              setTimeout(() => setStreakAnimation(false), 1000);
            }}
            className="px-3 py-2 bg-orange-600 text-white rounded-lg text-sm hover:bg-orange-700"
          >
            Add Streak Day
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => unlockBadge(badges[1])}
            className="px-3 py-2 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700"
          >
            Unlock Badge
          </motion.button>
        </div>
      </div>
    </div>
  );

  const renderCompactVariant = () => (
    <div className={`${themeClasses[theme]} ${sizeClasses[size]} rounded-2xl shadow-lg`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="text-center">
            <div className={`text-xl font-bold ${theme === 'colorful' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
              {Math.floor(points).toLocaleString()}
            </div>
            <div className={`text-xs ${theme === 'colorful' ? 'text-white/80' : 'text-gray-500'}`}>
              Points
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Flame className={`w-5 h-5 ${theme === 'colorful' ? 'text-yellow-300' : 'text-orange-500'}`} />
            <div>
              <div className={`font-bold ${theme === 'colorful' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                {streak}
              </div>
              <div className={`text-xs ${theme === 'colorful' ? 'text-white/80' : 'text-gray-500'}`}>
                Streak
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex -space-x-2">
          {userBadges.filter(b => b.unlocked).slice(0, 3).map((badge, index) => (
            <motion.div
              key={badge.id}
              className={`w-8 h-8 rounded-full ${badge.bgColor} border-2 ${badge.borderColor} flex items-center justify-center`}
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className={`${badge.color} text-xs`}>
                {badge.icon}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderFloatingVariant = () => (
    <motion.div
      className={`fixed bottom-6 right-6 ${themeClasses[theme]} ${sizeClasses[size]} rounded-2xl shadow-2xl`}
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
    >
      <div className="text-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="text-2xl mb-2"
        >
          🏆
        </motion.div>
        <div className={`font-bold ${theme === 'colorful' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
          {Math.floor(points).toLocaleString()}
        </div>
        <div className={`text-xs ${theme === 'colorful' ? 'text-white/80' : 'text-gray-500'}`}>
          Points
        </div>
      </div>
    </motion.div>
  );

  return (
    <>
      {variant === 'dashboard' && renderDashboardVariant()}
      {variant === 'compact' && renderCompactVariant()}
      {variant === 'floating' && renderFloatingVariant()}
      
      {/* New Badge Animation */}
      <AnimatePresence>
        {showBadgeAnimation && newBadge && (
          <motion.div
            variants={newBadgeVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
          >
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ duration: 0.5, repeat: Infinity }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-8 text-center max-w-sm mx-4"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="text-6xl mb-4"
              >
                🎉
              </motion.div>
              <div className={`text-4xl mb-4 ${newBadge.color}`}>
                {newBadge.icon}
              </div>
              <h2 className="text-2xl font-bold mb-2">Badge Unlocked!</h2>
              <h3 className={`text-xl font-semibold mb-2 ${newBadge.color}`}>
                {newBadge.name}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {newBadge.description}
              </p>
              <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
                newBadge.rarity === 'legendary' ? 'bg-yellow-100 text-yellow-800' :
                newBadge.rarity === 'epic' ? 'bg-purple-100 text-purple-800' :
                newBadge.rarity === 'rare' ? 'bg-blue-100 text-blue-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {newBadge.rarity.charAt(0).toUpperCase() + newBadge.rarity.slice(1)}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Level Up Animation */}
      <AnimatePresence>
        {showLevelUp && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="bg-gradient-to-br from-yellow-400 to-orange-500 text-white rounded-2xl p-8 text-center"
            >
              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: [0, 360, 720]
                }}
                transition={{ duration: 1 }}
                className="text-6xl mb-4"
              >
                🏆
              </motion.div>
              <h2 className="text-3xl font-bold mb-2">Level Up!</h2>
              <p className="text-xl">You've reached Level {level}!</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default GamificationUI;