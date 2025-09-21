import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Settings,
  Volume2,
  VolumeX,
  Bell,
  AlertTriangle,
  Zap,
  Clock,
  Timer,
  StopCircle,
  SkipForward,
  SkipBack,
  ChevronUp,
  ChevronDown
} from 'lucide-react';

interface TimerPreset {
  name: string;
  minutes: number;
  seconds: number;
  color: string;
  icon: React.ReactNode;
}

const timerPresets: TimerPreset[] = [
  { name: 'Quick Quiz', minutes: 5, seconds: 0, color: 'text-blue-600', icon: <Clock className="w-4 h-4" /> },
  { name: 'Standard Test', minutes: 15, seconds: 0, color: 'text-green-600', icon: <Timer className="w-4 h-4" /> },
  { name: 'Long Exam', minutes: 30, seconds: 0, color: 'text-purple-600', icon: <Timer className="w-4 h-4" /> },
  { name: 'Practice', minutes: 10, seconds: 0, color: 'text-orange-600', icon: <Zap className="w-4 h-4" /> }
];

interface CircularCountdownProps {
  initialMinutes?: number;
  initialSeconds?: number;
  autoStart?: boolean;
  showControls?: boolean;
  showPresets?: boolean;
  showProgress?: boolean;
  soundEnabled?: boolean;
  size?: 'small' | 'medium' | 'large' | 'xl';
  theme?: 'default' | 'gradient' | 'minimal' | 'neon';
  onComplete?: () => void;
  onTimeUpdate?: (timeLeft: number) => void;
  variant?: 'circle' | 'square' | 'diamond' | 'progress-bar';
  alertThreshold?: number; // seconds before alert
  showTimeUpAnimation?: boolean;
}

const CircularCountdown: React.FC<CircularCountdownProps> = ({
  initialMinutes = 5,
  initialSeconds = 0,
  autoStart = false,
  showControls = true,
  showPresets = true,
  showProgress = true,
  soundEnabled = true,
  size = 'large',
  theme = 'default',
  onComplete,
  onTimeUpdate,
  variant = 'circle',
  alertThreshold = 30,
  showTimeUpAnimation = true
}) => {
  const [totalSeconds, setTotalSeconds] = useState(initialMinutes * 60 + initialSeconds);
  const [initialTotal, setInitialTotal] = useState(initialMinutes * 60 + initialSeconds);
  const [isRunning, setIsRunning] = useState(autoStart);
  const [isPaused, setIsPaused] = useState(false);
  const [soundOn, setSoundOn] = useState(soundEnabled);
  const [showSettings, setShowSettings] = useState(false);
  const [customMinutes, setCustomMinutes] = useState(initialMinutes);
  const [customSeconds, setCustomSeconds] = useState(initialSeconds);
  const [showTimeUp, setShowTimeUp] = useState(false);
  const [pulseActive, setPulseActive] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const sizeClasses = {
    small: { container: 'w-32 h-32', text: 'text-2xl', subtext: 'text-sm' },
    medium: { container: 'w-40 h-40', text: 'text-3xl', subtext: 'text-base' },
    large: { container: 'w-48 h-48', text: 'text-4xl', subtext: 'text-lg' },
    xl: { container: 'w-64 h-64', text: 'text-5xl', subtext: 'text-xl' }
  };

  const themeClasses = {
    default: 'bg-white dark:bg-gray-800 shadow-lg',
    gradient: 'bg-gradient-to-br from-purple-600 to-pink-600 text-white',
    minimal: 'bg-transparent border-2 border-gray-300 dark:border-gray-600',
    neon: 'bg-gray-900 border-2 border-cyan-400 shadow-cyan-400/50 shadow-lg'
  };

  useEffect(() => {
    // Create audio context for beep sound
    if (soundOn && typeof window !== 'undefined') {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      // Store reference for later use
      audioRef.current = {
        play: () => {
          const osc = audioContext.createOscillator();
          const gain = audioContext.createGain();
          osc.connect(gain);
          gain.connect(audioContext.destination);
          
          osc.frequency.setValueAtTime(800, audioContext.currentTime);
          gain.gain.setValueAtTime(0.3, audioContext.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
          
          osc.start();
          osc.stop(audioContext.currentTime + 0.5);
        }
      } as any;
    }
  }, [soundOn]);

  useEffect(() => {
    if (isRunning && !isPaused) {
      intervalRef.current = setInterval(() => {
        setTotalSeconds(prev => {
          if (prev <= 1) {
            setIsRunning(false);
            setShowTimeUp(true);
            if (onComplete) onComplete();
            if (soundOn && audioRef.current) {
              // Play completion sound multiple times
              for (let i = 0; i < 3; i++) {
                setTimeout(() => audioRef.current?.play(), i * 200);
              }
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, isPaused, onComplete, soundOn]);

  useEffect(() => {
    if (onTimeUpdate) {
      onTimeUpdate(totalSeconds);
    }
    
    // Activate pulse animation when below alert threshold
    if (totalSeconds <= alertThreshold && totalSeconds > 0) {
      setPulseActive(true);
    } else {
      setPulseActive(false);
    }
  }, [totalSeconds, onTimeUpdate, alertThreshold]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgress = () => {
    return ((initialTotal - totalSeconds) / initialTotal) * 100;
  };

  const getStrokeDasharray = () => {
    const circumference = 2 * Math.PI * 90;
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference - (getProgress() / 100) * circumference;
    return { strokeDasharray, strokeDashoffset };
  };

  const handleStart = () => {
    setIsRunning(true);
    setIsPaused(false);
  };

  const handlePause = () => {
    setIsPaused(!isPaused);
  };

  const handleReset = () => {
    setIsRunning(false);
    setIsPaused(false);
    setTotalSeconds(initialTotal);
    setShowTimeUp(false);
  };

  const handlePresetSelect = (preset: TimerPreset) => {
    const newTotal = preset.minutes * 60 + preset.seconds;
    setTotalSeconds(newTotal);
    setInitialTotal(newTotal);
    setIsRunning(false);
    setIsPaused(false);
  };

  const handleCustomTimeSet = () => {
    const newTotal = customMinutes * 60 + customSeconds;
    setTotalSeconds(newTotal);
    setInitialTotal(newTotal);
    setIsRunning(false);
    setIsPaused(false);
    setShowSettings(false);
  };

  const circleVariants = {
    pulse: {
      scale: [1, 1.05, 1],
      transition: {
        duration: 1,
        repeat: Infinity,
        ease: "easeInOut"
      }
    },
    shake: {
      x: [-2, 2, -2, 2, 0],
      transition: {
        duration: 0.5,
        repeat: pulseActive ? Infinity : 0
      }
    }
  };

  const renderCircleVariant = () => (
    <motion.div
      className={`relative ${sizeClasses[size].container} ${themeClasses[theme]} rounded-full flex items-center justify-center`}
      variants={circleVariants}
      animate={pulseActive ? "pulse" : ""}
    >
      {showProgress && (
        <svg className="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 200 200">
          <circle
            cx="100"
            cy="100"
            r="90"
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            className="text-gray-200 dark:text-gray-700"
          />
          <motion.circle
            cx="100"
            cy="100"
            r="90"
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
            className={theme === 'gradient' ? 'text-white' : 'text-blue-600'}
            strokeDasharray={getStrokeDasharray().strokeDasharray}
            strokeDashoffset={getStrokeDasharray().strokeDashoffset}
            initial={{ strokeDashoffset: 2 * Math.PI * 90 }}
            animate={{ strokeDashoffset: getStrokeDasharray().strokeDashoffset }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </svg>
      )}
      
      <div className="text-center z-10">
        <motion.div
          className={`font-mono font-bold ${sizeClasses[size].text} ${
            theme === 'gradient' ? 'text-white' : 
            theme === 'neon' ? 'text-cyan-400' : 
            'text-gray-900 dark:text-white'
          }`}
          key={totalSeconds}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          {formatTime(totalSeconds)}
        </motion.div>
        
        {totalSeconds <= alertThreshold && totalSeconds > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`text-xs ${sizeClasses[size].subtext} text-red-500 font-medium`}
          >
            Time running out!
          </motion.div>
        )}
      </div>
    </motion.div>
  );

  const renderSquareVariant = () => (
    <motion.div
      className={`relative ${sizeClasses[size].container} ${themeClasses[theme]} rounded-2xl flex items-center justify-center`}
      variants={circleVariants}
      animate={pulseActive ? "pulse" : ""}
    >
      <div className="text-center">
        <motion.div
          className={`font-mono font-bold ${sizeClasses[size].text} ${
            theme === 'gradient' ? 'text-white' : 
            theme === 'neon' ? 'text-cyan-400' : 
            'text-gray-900 dark:text-white'
          }`}
          key={totalSeconds}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          {formatTime(totalSeconds)}
        </motion.div>
        
        {showProgress && (
          <div className="w-24 h-2 bg-gray-200 dark:bg-gray-700 rounded-full mt-3 overflow-hidden">
            <motion.div
              className={`h-full rounded-full ${
                theme === 'gradient' ? 'bg-white' : 'bg-blue-600'
              }`}
              style={{ width: `${getProgress()}%` }}
              initial={{ width: 0 }}
              animate={{ width: `${getProgress()}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        )}
      </div>
    </motion.div>
  );

  const renderProgressBarVariant = () => (
    <div className={`w-full p-4 rounded-2xl ${themeClasses[theme]}`}>
      <div className="flex items-center justify-between mb-4">
        <div className={`font-mono font-bold text-2xl ${
          theme === 'gradient' ? 'text-white' : 
          theme === 'neon' ? 'text-cyan-400' : 
          'text-gray-900 dark:text-white'
        }`}>
          {formatTime(totalSeconds)}
        </div>
        
        {totalSeconds <= alertThreshold && totalSeconds > 0 && (
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
            className="text-red-500"
          >
            <AlertTriangle className="w-6 h-6" />
          </motion.div>
        )}
      </div>
      
      <div className="w-full h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${
            theme === 'gradient' ? 'bg-white' : 
            theme === 'neon' ? 'bg-cyan-400' : 
            'bg-blue-600'
          }`}
          style={{ width: `${getProgress()}%` }}
          initial={{ width: 0 }}
          animate={{ width: `${getProgress()}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
    </div>
  );

  const renderControls = () => (
    <div className="flex items-center justify-center gap-3 mt-6">
      {!isRunning ? (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleStart}
          className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
        >
          <Play className="w-6 h-6" />
        </motion.button>
      ) : (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handlePause}
          className="p-3 bg-yellow-600 text-white rounded-full hover:bg-yellow-700 transition-colors"
        >
          {isPaused ? <Play className="w-6 h-6" /> : <Pause className="w-6 h-6" />}
        </motion.button>
      )}
      
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleReset}
        className="p-3 bg-gray-600 text-white rounded-full hover:bg-gray-700 transition-colors"
      >
        <RotateCcw className="w-6 h-6" />
      </motion.button>
      
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setSoundOn(!soundOn)}
        className="p-3 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors"
      >
        {soundOn ? <Volume2 className="w-6 h-6" /> : <VolumeX className="w-6 h-6" />}
      </motion.button>
      
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowSettings(!showSettings)}
        className="p-3 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors"
      >
        <Settings className="w-6 h-6" />
      </motion.button>
    </div>
  );

  const renderPresets = () => (
    <div className="flex gap-2 justify-center mt-4">
      {timerPresets.map((preset, index) => (
        <motion.button
          key={index}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handlePresetSelect(preset)}
          className={`px-3 py-2 rounded-lg text-sm font-medium ${preset.color} bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors`}
        >
          <div className="flex items-center gap-1">
            {preset.icon}
            <span>{preset.name}</span>
          </div>
        </motion.button>
      ))}
    </div>
  );

  const renderSettings = () => (
    <AnimatePresence>
      {showSettings && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl"
        >
          <h3 className="text-sm font-semibold mb-3">Custom Timer</h3>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="0"
                max="59"
                value={customMinutes}
                onChange={(e) => setCustomMinutes(Number(e.target.value))}
                className="w-16 px-2 py-1 border rounded text-center dark:bg-gray-700 dark:border-gray-600"
              />
              <span className="text-sm">min</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="0"
                max="59"
                value={customSeconds}
                onChange={(e) => setCustomSeconds(Number(e.target.value))}
                className="w-16 px-2 py-1 border rounded text-center dark:bg-gray-700 dark:border-gray-600"
              />
              <span className="text-sm">sec</span>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCustomTimeSet}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors"
            >
              Set
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  const renderTimeUpAnimation = () => (
    <AnimatePresence>
      {showTimeUp && showTimeUpAnimation && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
        >
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ duration: 0.5, repeat: Infinity }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-8 text-center"
          >
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 360]
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-6xl mb-4"
            >
              ⏰
            </motion.div>
            <h2 className="text-2xl font-bold mb-2">Time's Up!</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">Great job completing the quiz!</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowTimeUp(false)}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Continue
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <div className="flex flex-col items-center">
      {variant === 'circle' && renderCircleVariant()}
      {variant === 'square' && renderSquareVariant()}
      {variant === 'progress-bar' && renderProgressBarVariant()}
      
      {showControls && renderControls()}
      {showPresets && renderPresets()}
      {renderSettings()}
      {renderTimeUpAnimation()}
    </div>
  );
};

export default CircularCountdown;