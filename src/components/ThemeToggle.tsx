import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon, Palette, Settings, Sparkles, Zap, Star, Cloud, Sunrise, Sunset, Eye, EyeOff } from 'lucide-react';

interface ThemeToggleProps {
  theme?: 'light' | 'dark' | 'system';
  onThemeChange?: (theme: 'light' | 'dark' | 'system') => void;
  variant?: 'switch' | 'button' | 'dropdown' | 'segmented' | 'floating' | 'minimal';
  size?: 'small' | 'medium' | 'large';
  showSystemOption?: boolean;
  showAnimation?: boolean;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';
  autoDetect?: boolean;
  persistent?: boolean;
  customThemes?: Array<{
    name: string;
    light: Record<string, string>;
    dark: Record<string, string>;
  }>;
}

interface ThemeSettings {
  primaryColor: string;
  borderRadius: 'none' | 'small' | 'medium' | 'large';
  animationSpeed: 'slow' | 'normal' | 'fast';
  enableParticles: boolean;
  enableSound: boolean;
  enableTransitions: boolean;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({
  theme: controlledTheme,
  onThemeChange,
  variant = 'switch',
  size = 'medium',
  showSystemOption = true,
  showAnimation = true,
  position = 'top-right',
  autoDetect = true,
  persistent = true,
  customThemes = []
}) => {
  const [currentTheme, setCurrentTheme] = useState<'light' | 'dark' | 'system'>(controlledTheme || 'system');
  const [isDark, setIsDark] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [themeSettings, setThemeSettings] = useState<ThemeSettings>({
    primaryColor: 'blue',
    borderRadius: 'medium',
    animationSpeed: 'normal',
    enableParticles: true,
    enableSound: false,
    enableTransitions: true
  });

  // Detect system theme preference
  useEffect(() => {
    if (!autoDetect) return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      if (currentTheme === 'system') {
        setIsDark(e.matches);
        updateDocumentTheme(e.matches);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [currentTheme, autoDetect]);

  // Initialize theme
  useEffect(() => {
    let initialTheme: 'light' | 'dark';
    
    if (currentTheme === 'system') {
      initialTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    } else {
      initialTheme = currentTheme;
    }
    
    setIsDark(initialTheme === 'dark');
    updateDocumentTheme(initialTheme === 'dark');
  }, [currentTheme]);

  // Load saved theme from localStorage
  useEffect(() => {
    if (persistent && !controlledTheme) {
      const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | 'system';
      const savedSettings = localStorage.getItem('themeSettings');
      
      if (savedTheme) {
        setCurrentTheme(savedTheme);
      }
      
      if (savedSettings) {
        try {
          setThemeSettings(JSON.parse(savedSettings));
        } catch (e) {
          // Silently handle theme settings parse error
        }
      }
    }
  }, [persistent, controlledTheme]);

  const updateDocumentTheme = (dark: boolean) => {
    if (dark) {
      document.documentElement.classList.add('dark');
      document.documentElement.style.setProperty('--bg-primary', '15 23 42'); // slate-900
      document.documentElement.style.setProperty('--bg-secondary', '30 41 59'); // slate-800
      document.documentElement.style.setProperty('--text-primary', '248 250 252'); // slate-50
      document.documentElement.style.setProperty('--text-secondary', '203 213 225'); // slate-300
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.style.setProperty('--bg-primary', '255 255 255'); // white
      document.documentElement.style.setProperty('--bg-secondary', '241 245 249'); // slate-50
      document.documentElement.style.setProperty('--text-primary', '15 23 42'); // slate-900
      document.documentElement.style.setProperty('--text-secondary', '71 85 105'); // slate-600
    }
  };

  const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setCurrentTheme(newTheme);
    
    if (persistent) {
      localStorage.setItem('theme', newTheme);
    }
    
    if (onThemeChange) {
      onThemeChange(newTheme);
    }

    setTimeout(() => setIsAnimating(false), 600);
  };

  const handleSettingsChange = (key: keyof ThemeSettings, value: any) => {
    const newSettings = { ...themeSettings, [key]: value };
    setThemeSettings(newSettings);
    
    if (persistent) {
      localStorage.setItem('themeSettings', JSON.stringify(newSettings));
    }
  };

  const positionClasses = {
    'top-left': 'top-4 left-4',
    'top-right': 'top-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'center': 'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'
  };

  const sizeClasses = {
    small: 'w-10 h-10',
    medium: 'w-12 h-12',
    large: 'w-14 h-14'
  };

  const iconSizes = {
    small: 'w-5 h-5',
    medium: 'w-6 h-6',
    large: 'w-7 h-7'
  };

  const animationSpeeds = {
    slow: 0.8,
    normal: 0.5,
    fast: 0.3
  };

  const switchVariants = {
    light: { x: 0 },
    dark: { x: 24 },
    system: { x: 12 }
  };

  const sunVariants = {
    hidden: { scale: 0, rotate: -180, opacity: 0 },
    visible: { scale: 1, rotate: 0, opacity: 1 },
    exit: { scale: 0, rotate: 180, opacity: 0 }
  };

  const moonVariants = {
    hidden: { scale: 0, rotate: 180, opacity: 0 },
    visible: { scale: 1, rotate: 0, opacity: 1 },
    exit: { scale: 0, rotate: -180, opacity: 0 }
  };

  const particleVariants = {
    hidden: { opacity: 0, scale: 0 },
    visible: (i: number) => ({
      opacity: [0, 1, 0],
      scale: [0, 1, 0],
      x: [0, (i % 2 === 0 ? 1 : -1) * Math.random() * 50],
      y: [0, -Math.random() * 50],
      transition: {
        duration: animationSpeeds[themeSettings.animationSpeed],
        delay: i * 0.1,
        ease: "easeOut"
      }
    })
  };

  const renderSwitch = () => (
    <motion.div
      className={`relative ${sizeClasses[size]} bg-gray-200 dark:bg-gray-700 rounded-full cursor-pointer overflow-hidden`}
      onClick={() => handleThemeChange(isDark ? 'light' : 'dark')}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600"
        initial={false}
        animate={{ opacity: isDark ? 1 : 0 }}
        transition={{ duration: animationSpeeds[themeSettings.animationSpeed] }}
      />
      
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        animate={isDark ? { x: 12 } : { x: -12 }}
        transition={{ duration: animationSpeeds[themeSettings.animationSpeed] }}
      >
        <AnimatePresence mode="wait">
          {isDark ? (
            <motion.div
              key="moon"
              variants={moonVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: animationSpeeds[themeSettings.animationSpeed] }}
            >
              <Moon className={`${iconSizes[size]} text-white`} />
            </motion.div>
          ) : (
            <motion.div
              key="sun"
              variants={sunVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: animationSpeeds[themeSettings.animationSpeed] }}
            >
              <Sun className={`${iconSizes[size]} text-yellow-500`} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Particles */}
      {showAnimation && themeSettings.enableParticles && isAnimating && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              custom={i}
              variants={particleVariants}
              initial="hidden"
              animate="visible"
              className="absolute top-1/2 left-1/2 w-1 h-1 bg-yellow-400 rounded-full"
              style={{
                transform: 'translate(-50%, -50%)'
              }}
            />
          ))}
        </div>
      )}
    </motion.div>
  );

  const renderButton = () => (
    <motion.button
      onClick={() => handleThemeChange(isDark ? 'light' : 'dark')}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
        isDark
          ? 'bg-gray-800 text-white hover:bg-gray-700'
          : 'bg-white text-gray-900 hover:bg-gray-50'
      } shadow-lg border border-gray-200 dark:border-gray-700`}
      whileHover={{ scale: 1.05, boxShadow: "0 10px 25px rgba(0,0,0,0.2)" }}
      whileTap={{ scale: 0.95 }}
    >
      <AnimatePresence mode="wait">
        {isDark ? (
          <motion.div
            key="moon-button"
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 90, opacity: 0 }}
            transition={{ duration: animationSpeeds[themeSettings.animationSpeed] }}
          >
            <Moon className="w-5 h-5" />
          </motion.div>
        ) : (
          <motion.div
            key="sun-button"
            initial={{ rotate: 90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: -90, opacity: 0 }}
            transition={{ duration: animationSpeeds[themeSettings.animationSpeed] }}
          >
            <Sun className="w-5 h-5" />
          </motion.div>
        )}
      </AnimatePresence>
      <span className="hidden sm:inline">
        {isDark ? 'Dark Mode' : 'Light Mode'}
      </span>
    </motion.button>
  );

  const renderSegmented = () => (
    <div className="flex bg-gray-200 dark:bg-gray-700 rounded-lg p-1">
      {(['light', 'dark', 'system'] as const).map((themeOption) => (
        <motion.button
          key={themeOption}
          onClick={() => handleThemeChange(themeOption)}
          className={`relative flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
            currentTheme === themeOption
              ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {currentTheme === themeOption && (
            <motion.div
              className="absolute inset-0 bg-white dark:bg-gray-800 rounded-md"
              layoutId="segmented-background"
              transition={{ duration: animationSpeeds[themeSettings.animationSpeed] }}
            />
          )}
          <span className="relative z-10 flex items-center gap-1">
            {themeOption === 'light' && <Sun className="w-4 h-4" />}
            {themeOption === 'dark' && <Moon className="w-4 h-4" />}
            {themeOption === 'system' && <Settings className="w-4 h-4" />}
            <span className="capitalize">{themeOption}</span>
          </span>
        </motion.button>
      ))}
    </div>
  );

  const renderFloating = () => (
    <motion.div
      className={`fixed ${positionClasses[position]} z-50`}
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
    >
      <motion.button
        onClick={() => handleThemeChange(isDark ? 'light' : 'dark')}
        className={`${sizeClasses[size]} bg-white dark:bg-gray-800 rounded-full shadow-lg border-2 border-gray-200 dark:border-gray-700 flex items-center justify-center`}
        whileHover={{ 
          scale: 1.1,
          boxShadow: "0 15px 35px rgba(0,0,0,0.3)",
          rotate: isDark ? 15 : -15
        }}
        whileTap={{ scale: 0.9 }}
      >
        <AnimatePresence mode="wait">
          {isDark ? (
            <motion.div
              key="floating-moon"
              initial={{ scale: 0, rotate: -90 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 90 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <Moon className={`${iconSizes[size]} text-purple-600`} />
            </motion.div>
          ) : (
            <motion.div
              key="floating-sun"
              initial={{ scale: 0, rotate: 90 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: -90 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <Sun className={`${iconSizes[size]} text-yellow-500`} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
      
      {/* Settings button */}
      <motion.button
        onClick={() => setShowSettings(!showSettings)}
        className="absolute -bottom-2 -right-2 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center shadow-lg"
        whileHover={{ scale: 1.2 }}
        whileTap={{ scale: 0.8 }}
      >
        <Settings className="w-3 h-3" />
      </motion.button>
    </motion.div>
  );

  const renderMinimal = () => (
    <motion.button
      onClick={() => handleThemeChange(isDark ? 'light' : 'dark')}
      className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      <AnimatePresence mode="wait">
        {isDark ? (
          <motion.div
            key="minimal-moon"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <Moon className="w-4 h-4" />
          </motion.div>
        ) : (
          <motion.div
            key="minimal-sun"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
          >
            <Sun className="w-4 h-4" />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );

  const renderDropdown = () => (
    <div className="relative">
      <motion.button
        onClick={() => setShowSettings(!showSettings)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <AnimatePresence mode="wait">
          {isDark ? (
            <Moon key="dropdown-moon" className="w-4 h-4" />
          ) : (
            <Sun key="dropdown-sun" className="w-4 h-4" />
          )}
        </AnimatePresence>
        <span className="capitalize text-sm">{currentTheme}</span>
        <motion.div
          animate={{ rotate: showSettings ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-4 h-4" />
        </motion.div>
      </motion.button>
      
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden z-50"
          >
            {(['light', 'dark', 'system'] as const).map((themeOption) => (
              <motion.button
                key={themeOption}
                onClick={() => {
                  handleThemeChange(themeOption);
                  setShowSettings(false);
                }}
                className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                  currentTheme === themeOption ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600' : ''
                }`}
                whileHover={{ x: 4 }}
              >
                <span className="flex items-center gap-2">
                  {themeOption === 'light' && <Sun className="w-4 h-4" />}
                  {themeOption === 'dark' && <Moon className="w-4 h-4" />}
                  {themeOption === 'system' && <Settings className="w-4 h-4" />}
                  <span className="capitalize">{themeOption}</span>
                </span>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  // Settings panel
  const SettingsPanel = () => (
    <AnimatePresence>
      {showSettings && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="fixed top-20 right-4 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 p-6 z-50"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-lg">Theme Settings</h3>
            <button
              onClick={() => setShowSettings(false)}
              className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <EyeOff className="w-4 h-4" />
            </button>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Primary Color</label>
              <div className="flex gap-2">
                {['blue', 'purple', 'green', 'red', 'orange'].map((color) => (
                  <button
                    key={color}
                    onClick={() => handleSettingsChange('primaryColor', color)}
                    className={`w-8 h-8 rounded-full bg-${color}-500 ${
                      themeSettings.primaryColor === color ? 'ring-2 ring-offset-2 ring-gray-400' : ''
                    }`}
                  />
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Animation Speed</label>
              <select
                value={themeSettings.animationSpeed}
                onChange={(e) => handleSettingsChange('animationSpeed', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
              >
                <option value="slow">Slow</option>
                <option value="normal">Normal</option>
                <option value="fast">Fast</option>
              </select>
            </div>
            
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Enable Particles</label>
              <button
                onClick={() => handleSettingsChange('enableParticles', !themeSettings.enableParticles)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  themeSettings.enableParticles ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    themeSettings.enableParticles ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Enable Transitions</label>
              <button
                onClick={() => handleSettingsChange('enableTransitions', !themeSettings.enableTransitions)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  themeSettings.enableTransitions ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    themeSettings.enableTransitions ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <>
      {variant === 'switch' && renderSwitch()}
      {variant === 'button' && renderButton()}
      {variant === 'segmented' && renderSegmented()}
      {variant === 'floating' && renderFloating()}
      {variant === 'minimal' && renderMinimal()}
      {variant === 'dropdown' && renderDropdown()}
      
      <SettingsPanel />
    </>
  );
};

export default ThemeToggle;