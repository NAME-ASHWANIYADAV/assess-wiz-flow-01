import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Crown, 
  Medal, 
  Trophy, 
  Star, 
  TrendingUp, 
  TrendingDown, 
  Zap, 
  Flame,
  Gem,
  Award,
  Target,
  Users,
  Filter,
  Search,
  Settings,
  Share2,
  Download,
  RotateCcw,
  Play,
  Pause,
  ChevronUp,
  ChevronDown,
  MoreVertical,
  User,
  Activity,
  BarChart3,
  Clock,
  Calendar,
  Globe,
  Heart,
  MessageCircle,
  Eye,
  EyeOff
} from 'lucide-react';

interface LeaderboardEntry {
  id: string;
  rank: number;
  previousRank: number;
  name: string;
  score: number;
  avatar: string;
  level: number;
  streak: number;
  country?: string;
  isOnline: boolean;
  badges: string[];
  recentActivity: string;
  accuracy: number;
  totalQuizzes: number;
  isCurrentUser?: boolean;
  isNew?: boolean;
  isFriend?: boolean;
}

interface LeaderboardProps {
  entries?: LeaderboardEntry[];
  showAnimations?: boolean;
  showTrends?: boolean;
  showBadges?: boolean;
  showFilters?: boolean;
  autoRefresh?: boolean;
  refreshInterval?: number;
  theme?: 'default' | 'dark' | 'colorful' | 'glass' | 'neon';
  variant?: 'standard' | 'compact' | 'detailed' | 'minimal' | 'cards';
  size?: 'small' | 'medium' | 'large';
  timeRange?: 'daily' | 'weekly' | 'monthly' | 'all-time';
  onUserClick?: (user: LeaderboardEntry) => void;
  onRefresh?: () => void;
  showCountryFlags?: boolean;
  enableSearch?: boolean;
  enableSorting?: boolean;
}

const sampleData: LeaderboardEntry[] = [
  {
    id: '1',
    rank: 1,
    previousRank: 2,
    name: 'Alex Chen',
    score: 28450,
    avatar: '🦊',
    level: 15,
    streak: 45,
    country: '🇺🇸',
    isOnline: true,
    badges: ['🥇', '🔥', '⭐'],
    recentActivity: 'Completed Advanced Quiz',
    accuracy: 92,
    totalQuizzes: 234,
    isCurrentUser: false
  },
  {
    id: '2',
    rank: 2,
    previousRank: 1,
    name: 'Sarah Johnson',
    score: 27890,
    avatar: '🦄',
    level: 14,
    streak: 38,
    country: '🇬🇧',
    isOnline: true,
    badges: ['🥈', '💎', '🎯'],
    recentActivity: 'Perfect Score!',
    accuracy: 89,
    totalQuizzes: 198,
    isCurrentUser: false
  },
  {
    id: '3',
    rank: 3,
    previousRank: 4,
    name: 'You',
    score: 26500,
    avatar: '🐉',
    level: 13,
    streak: 32,
    country: '🇨🇦',
    isOnline: true,
    badges: ['🥉', '⚡', '🏆'],
    recentActivity: 'Level Up!',
    accuracy: 87,
    totalQuizzes: 176,
    isCurrentUser: true
  },
  {
    id: '4',
    rank: 4,
    previousRank: 3,
    name: 'Mike Wilson',
    score: 24980,
    avatar: '🦁',
    level: 12,
    streak: 28,
    country: '🇦🇺',
    isOnline: false,
    badges: ['💫', '🌟', '🔥'],
    recentActivity: 'Completed 10 quizzes today',
    accuracy: 85,
    totalQuizzes: 165,
    isCurrentUser: false
  },
  {
    id: '5',
    rank: 5,
    previousRank: 6,
    name: 'Emma Davis',
    score: 23800,
    avatar: '🦅',
    level: 11,
    streak: 21,
    country: '🇩🇪',
    isOnline: true,
    badges: ['✨', '🎯', '⭐'],
    recentActivity: 'New personal best!',
    accuracy: 83,
    totalQuizzes: 142,
    isCurrentUser: false
  },
  {
    id: '6',
    rank: 6,
    previousRank: 5,
    name: 'David Kim',
    score: 22150,
    avatar: '🐺',
    level: 10,
    streak: 18,
    country: '🇰🇷',
    isOnline: false,
    badges: ['🔥', '💎', '⚡'],
    recentActivity: 'Streak milestone reached',
    accuracy: 81,
    totalQuizzes: 128,
    isCurrentUser: false
  },
  {
    id: '7',
    rank: 7,
    previousRank: 8,
    name: 'Lisa Rodriguez',
    score: 20980,
    avatar: '🦋',
    level: 9,
    streak: 15,
    country: '🇪🇸',
    isOnline: true,
    badges: ['🌟', '✨', '🎯'],
    recentActivity: 'Completed daily challenge',
    accuracy: 79,
    totalQuizzes: 115,
    isCurrentUser: false,
    isNew: true
  },
  {
    id: '8',
    rank: 8,
    previousRank: 7,
    name: 'Tom Brown',
    score: 19800,
    avatar: '🐻',
    level: 8,
    streak: 12,
    country: '🇫🇷',
    isOnline: false,
    badges: ['⭐', '🔥', '💫'],
    recentActivity: 'Improving steadily',
    accuracy: 76,
    totalQuizzes: 98,
    isCurrentUser: false
  }
];

const AnimatedLeaderboard: React.FC<LeaderboardProps> = ({
  entries = sampleData,
  showAnimations = true,
  showTrends = true,
  showBadges = true,
  showFilters = true,
  autoRefresh = false,
  refreshInterval = 30000,
  theme = 'default',
  variant = 'standard',
  size = 'medium',
  timeRange = 'weekly',
  onUserClick,
  onRefresh,
  showCountryFlags = true,
  enableSearch = true,
  enableSorting = true
}) => {
  const [leaderboardData, setLeaderboardData] = useState(entries);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'score' | 'level' | 'accuracy' | 'streak'>('score');
  const [filterOnline, setFilterOnline] = useState(false);
  const [showFiltersPanel, setShowFiltersPanel] = useState(false);
  const [isAutoRefresh, setIsAutoRefresh] = useState(autoRefresh);

  const themeClasses = {
    default: 'bg-white text-gray-900',
    dark: 'bg-gray-900 text-white',
    colorful: 'bg-gradient-to-br from-purple-600 to-pink-600 text-white',
    glass: 'bg-white/10 backdrop-blur-md text-white border border-white/20',
    neon: 'bg-gray-900 text-cyan-400 border border-cyan-400/50'
  };

  const sizeClasses = {
    small: 'p-4 space-y-2',
    medium: 'p-6 space-y-3',
    large: 'p-8 space-y-4'
  };

  const containerVariants = {
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

  const itemVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 20
      }
    },
    hover: {
      scale: 1.02,
      transition: { duration: 0.2 }
    }
  };

  const glowVariants = {
    glow: {
      boxShadow: [
        "0 0 20px rgba(59, 130, 246, 0.5)",
        "0 0 30px rgba(59, 130, 246, 0.8)",
        "0 0 20px rgba(59, 130, 246, 0.5)"
      ],
      transition: {
        duration: 2,
        repeat: Infinity
      }
    }
  };

  const pulseVariants = {
    pulse: {
      scale: [1, 1.05, 1],
      opacity: [0.7, 1, 0.7],
      transition: {
        duration: 1.5,
        repeat: Infinity
      }
    }
  };

  // Auto refresh functionality
  useEffect(() => {
    if (isAutoRefresh) {
      const interval = setInterval(() => {
        handleRefresh();
      }, refreshInterval);
      
      return () => clearInterval(interval);
    }
  }, [isAutoRefresh, refreshInterval]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Shuffle rankings slightly for demo
    const shuffledData = [...leaderboardData].sort(() => Math.random() - 0.5);
    setLeaderboardData(shuffledData.map((entry, index) => ({
      ...entry,
      previousRank: entry.rank,
      rank: index + 1
    })));
    
    setIsRefreshing(false);
    
    if (onRefresh) {
      onRefresh();
    }
  };

  const getTrendIcon = (entry: LeaderboardEntry) => {
    if (entry.rank < entry.previousRank) {
      return <TrendingUp className="w-4 h-4 text-green-500" />;
    } else if (entry.rank > entry.previousRank) {
      return <TrendingDown className="w-4 h-4 text-red-500" />;
    }
    return <div className="w-4 h-4 text-gray-400">-</div>;
  };

  const getRankColor = (rank: number) => {
    if (rank === 1) return 'text-yellow-500';
    if (rank === 2) return 'text-gray-400';
    if (rank === 3) return 'text-orange-600';
    return 'text-gray-600';
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="w-5 h-5" />;
    if (rank === 2) return <Medal className="w-5 h-5" />;
    if (rank === 3) return <Trophy className="w-5 h-5" />;
    return <span className="text-sm font-bold">{rank}</span>;
  };

  const filteredData = leaderboardData.filter(entry => {
    const matchesSearch = entry.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = !filterOnline || entry.isOnline;
    return matchesSearch && matchesFilter;
  });

  const sortedData = [...filteredData].sort((a, b) => {
    switch (sortBy) {
      case 'score':
        return b.score - a.score;
      case 'level':
        return b.level - a.level;
      case 'accuracy':
        return b.accuracy - a.accuracy;
      case 'streak':
        return b.streak - a.streak;
      default:
        return b.score - a.score;
    }
  });

  const renderStandardVariant = () => (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={`${themeClasses[theme]} ${sizeClasses[size]} rounded-2xl shadow-xl max-w-2xl mx-auto`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Trophy className="w-6 h-6 text-yellow-500" />
          <h2 className="text-2xl font-bold">Leaderboard</h2>
        </div>
        
        <div className="flex items-center gap-2">
          {showFilters && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowFiltersPanel(!showFiltersPanel)}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              <Filter className="w-4 h-4" />
            </motion.button>
          )}
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="p-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
          >
            <RotateCcw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </motion.button>
        </div>
      </div>

      {/* Filters Panel */}
      <AnimatePresence>
        {showFiltersPanel && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {enableSearch && (
                <div>
                  <label className="block text-sm font-medium mb-2">Search</label>
                  <input
                    type="text"
                    placeholder="Search players..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                  />
                </div>
              )}
              
              {enableSorting && (
                <div>
                  <label className="block text-sm font-medium mb-2">Sort by</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                  >
                    <option value="score">Score</option>
                    <option value="level">Level</option>
                    <option value="accuracy">Accuracy</option>
                    <option value="streak">Streak</option>
                  </select>
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium mb-2">Filters</label>
                <div className="flex items-center gap-2">
                  <label className="flex items-center gap-1">
                    <input
                      type="checkbox"
                      checked={filterOnline}
                      onChange={(e) => setFilterOnline(e.target.checked)}
                      className="rounded"
                    />
                    <span className="text-sm">Online only</span>
                  </label>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Leaderboard List */}
      <div className="space-y-3">
        {sortedData.map((entry, index) => (
          <motion.div
            key={entry.id}
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            whileHover="hover"
            onClick={() => onUserClick?.(entry)}
            className={`relative p-4 rounded-xl border-2 transition-all cursor-pointer ${
              entry.isCurrentUser
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
            }`}
          >
            {/* Glow effect for top 3 */}
            {entry.rank <= 3 && (
              <motion.div
                variants={glowVariants}
                animate="glow"
                className="absolute inset-0 rounded-xl pointer-events-none"
              />
            )}
            
            {/* Rank and Avatar */}
            <div className="flex items-center gap-4">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full ${getRankColor(entry.rank)}`}>
                {getRankIcon(entry.rank)}
              </div>
              
              <div className="relative">
                <motion.div
                  variants={pulseVariants}
                  animate={entry.isOnline ? "pulse" : ""}
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${
                    entry.isOnline ? 'bg-green-100 dark:bg-green-900/30' : 'bg-gray-100 dark:bg-gray-800'
                  }`}
                >
                  {entry.avatar}
                </motion.div>
                
                {/* Online indicator */}
                {entry.isOnline && (
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
                )}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className={`font-semibold ${entry.isCurrentUser ? 'text-blue-600' : ''}`}>
                    {entry.name}
                  </h3>
                  {showCountryFlags && entry.country && (
                    <span className="text-lg">{entry.country}</span>
                  )}
                  {entry.isNew && (
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">NEW</span>
                  )}
                </div>
                
                <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                  <span className="flex items-center gap-1">
                    <Star className="w-3 h-3" />
                    Lv. {entry.level}
                  </span>
                  <span className="flex items-center gap-1">
                    <Flame className="w-3 h-3" />
                    {entry.streak} days
                  </span>
                  <span className="flex items-center gap-1">
                    <Target className="w-3 h-3" />
                    {entry.accuracy}%
                  </span>
                </div>
                
                <div className="text-xs text-gray-400 mt-1">
                  {entry.recentActivity}
                </div>
              </div>
              
              <div className="text-right">
                <div className="flex items-center gap-2 mb-1">
                  {showTrends && getTrendIcon(entry)}
                  <div className="text-lg font-bold text-gray-900 dark:text-white">
                    {entry.score.toLocaleString()}
                  </div>
                </div>
                
                {showBadges && entry.badges.length > 0 && (
                  <div className="flex gap-1">
                    {entry.badges.slice(0, 3).map((badge, badgeIndex) => (
                      <span key={badgeIndex} className="text-sm">
                        {badge}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-6 flex items-center justify-between text-sm text-gray-500">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4" />
          <span>{sortedData.length} players online</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4" />
          <span>Updates every 30s</span>
        </div>
      </div>
    </motion.div>
  );

  const renderCompactVariant = () => (
    <div className={`${themeClasses[theme]} ${sizeClasses[size]} rounded-2xl shadow-lg`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">Top Players</h3>
        <Trophy className="w-5 h-5 text-yellow-500" />
      </div>
      
      <div className="space-y-2">
        {sortedData.slice(0, 5).map((entry) => (
          <motion.div
            key={entry.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${getRankColor(entry.rank)}`}>
              {entry.rank}
            </div>
            <div className="text-lg">{entry.avatar}</div>
            <div className="flex-1">
              <div className="font-medium text-sm">{entry.name}</div>
              <div className="text-xs text-gray-500">{entry.score.toLocaleString()} pts</div>
            </div>
            {showTrends && getTrendIcon(entry)}
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderDetailedVariant = () => (
    <div className={`${themeClasses[theme]} ${sizeClasses[size]} rounded-2xl shadow-xl`}>
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Global Rankings</h2>
        <div className="flex items-center gap-4 text-sm">
          <span className="flex items-center gap-1">
            <Globe className="w-4 h-4" />
            All Regions
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            This Week
          </span>
          <span className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            {sortedData.length} Players
          </span>
        </div>
      </div>

      <div className="space-y-4">
        {sortedData.map((entry) => (
          <motion.div
            key={entry.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getRankColor(entry.rank)}`}>
                  {getRankIcon(entry.rank)}
                </div>
                <div className="text-2xl">{entry.avatar}</div>
                <div>
                  <h3 className="font-semibold">{entry.name}</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    {showCountryFlags && entry.country && <span>{entry.country}</span>}
                    <span>Lv. {entry.level}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Activity className="w-3 h-3" />
                      {entry.accuracy}%
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-2xl font-bold">{entry.score.toLocaleString()}</div>
                <div className="text-sm text-gray-500">points</div>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div className="text-center">
                <div className="font-semibold">{entry.totalQuizzes}</div>
                <div className="text-gray-500">Quizzes</div>
              </div>
              <div className="text-center">
                <div className="font-semibold">{entry.streak}</div>
                <div className="text-gray-500">Day Streak</div>
              </div>
              <div className="text-center">
                <div className="font-semibold">{entry.accuracy}%</div>
                <div className="text-gray-500">Accuracy</div>
              </div>
            </div>
            
            <div className="mt-3 text-xs text-gray-500">
              {entry.recentActivity}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderCardsVariant = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {sortedData.map((entry) => (
        <motion.div
          key={entry.id}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.05, y: -5 }}
          className={`${themeClasses[theme]} p-6 rounded-2xl shadow-lg border-2 ${
            entry.isCurrentUser ? 'border-blue-500' : 'border-gray-200 dark:border-gray-700'
          }`}
        >
          <div className="text-center mb-4">
            <div className="relative inline-block">
              <motion.div
                animate={entry.isOnline ? { rotate: 360 } : {}}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                className="w-16 h-16 rounded-full flex items-center justify-center text-3xl bg-gradient-to-br from-blue-400 to-purple-600 text-white"
              >
                {entry.avatar}
              </motion.div>
              
              {entry.isOnline && (
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"
                />
              )}
            </div>
            
            <div className={`mt-2 text-2xl font-bold ${getRankColor(entry.rank)}`}>
              #{entry.rank}
            </div>
            
            <h3 className={`font-semibold mt-1 ${entry.isCurrentUser ? 'text-blue-600' : ''}`}>
              {entry.name}
            </h3>
            
            <div className="text-sm text-gray-500">
              Lv. {entry.level} • {entry.country}
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Score</span>
              <span className="font-bold">{entry.score.toLocaleString()}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Streak</span>
              <span className="font-bold flex items-center gap-1">
                <Flame className="w-4 h-4 text-orange-500" />
                {entry.streak} days
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Accuracy</span>
              <span className="font-bold">{entry.accuracy}%</span>
            </div>
          </div>
          
          {showBadges && entry.badges.length > 0 && (
            <div className="mt-4 flex justify-center gap-2">
              {entry.badges.map((badge, index) => (
                <span key={index} className="text-lg">
                  {badge}
                </span>
              ))}
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );

  const renderMinimalVariant = () => (
    <div className={`${themeClasses[theme]} ${sizeClasses[size]} rounded-2xl shadow-lg`}>
      <div className="space-y-2">
        {sortedData.slice(0, 5).map((entry) => (
          <div key={entry.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${getRankColor(entry.rank)}`}>
              {entry.rank}
            </div>
            <div className="text-lg">{entry.avatar}</div>
            <div className="flex-1 min-w-0">
              <div className="font-medium truncate">{entry.name}</div>
            </div>
            <div className="font-semibold">
              {entry.score.toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <>
      {variant === 'standard' && renderStandardVariant()}
      {variant === 'compact' && renderCompactVariant()}
      {variant === 'detailed' && renderDetailedVariant()}
      {variant === 'cards' && renderCardsVariant()}
      {variant === 'minimal' && renderMinimalVariant()}
    </>
  );
};

export default AnimatedLeaderboard;