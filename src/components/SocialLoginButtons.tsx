import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Chrome, 
  Github, 
  Twitter, 
  Facebook, 
  Linkedin, 
  Mail, 
  Phone,
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react';

interface SocialLoginButtonsProps {
  onLogin: (provider: string) => Promise<void>;
  className?: string;
  variant?: 'default' | 'minimal' | 'floating';
  showLabels?: boolean;
}

interface LoginProvider {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  hoverColor: string;
  gradient: string;
}

const loginProviders: LoginProvider[] = [
  {
    id: 'google',
    name: 'Google',
    icon: <Chrome className="w-5 h-5" />,
    color: 'bg-white',
    hoverColor: 'hover:bg-gray-50',
    gradient: 'from-red-500 to-yellow-500'
  },
  {
    id: 'github',
    name: 'GitHub',
    icon: <Github className="w-5 h-5" />,
    color: 'bg-gray-900',
    hoverColor: 'hover:bg-gray-800',
    gradient: 'from-gray-700 to-gray-900'
  },
  {
    id: 'twitter',
    name: 'Twitter',
    icon: <Twitter className="w-5 h-5" />,
    color: 'bg-blue-500',
    hoverColor: 'hover:bg-blue-600',
    gradient: 'from-blue-400 to-blue-600'
  },
  {
    id: 'facebook',
    name: 'Facebook',
    icon: <Facebook className="w-5 h-5" />,
    color: 'bg-blue-600',
    hoverColor: 'hover:bg-blue-700',
    gradient: 'from-blue-500 to-blue-700'
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    icon: <Linkedin className="w-5 h-5" />,
    color: 'bg-blue-700',
    hoverColor: 'hover:bg-blue-800',
    gradient: 'from-blue-600 to-blue-800'
  },
  {
    id: 'email',
    name: 'Email',
    icon: <Mail className="w-5 h-5" />,
    color: 'bg-purple-600',
    hoverColor: 'hover:bg-purple-700',
    gradient: 'from-purple-500 to-purple-700'
  },
  {
    id: 'phone',
    name: 'Phone',
    icon: <Phone className="w-5 h-5" />,
    color: 'bg-green-600',
    hoverColor: 'hover:bg-green-700',
    gradient: 'from-green-500 to-green-700'
  }
];

const SocialLoginButtons: React.FC<SocialLoginButtonsProps> = ({ 
  onLogin, 
  className = '', 
  variant = 'default',
  showLabels = true 
}) => {
  const [loadingStates, setLoadingStates] = useState<{ [key: string]: boolean }>({});
  const [successStates, setSuccessStates] = useState<{ [key: string]: boolean }>({});
  const [errorStates, setErrorStates] = useState<{ [key: string]: string }>({});

  const handleLogin = async (provider: LoginProvider) => {
    setLoadingStates(prev => ({ ...prev, [provider.id]: true }));
    setErrorStates(prev => ({ ...prev, [provider.id]: '' }));

    try {
      await onLogin(provider.id);
      
      setSuccessStates(prev => ({ ...prev, [provider.id]: true }));
      setTimeout(() => {
        setSuccessStates(prev => ({ ...prev, [provider.id]: false }));
      }, 2000);
    } catch (error) {
      setErrorStates(prev => ({ 
        ...prev, 
        [provider.id]: error instanceof Error ? error.message : 'Login failed' 
      }));
      setTimeout(() => {
        setErrorStates(prev => ({ ...prev, [provider.id]: '' }));
      }, 3000);
    } finally {
      setLoadingStates(prev => ({ ...prev, [provider.id]: false }));
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const buttonVariants = {
    hidden: { 
      opacity: 0, 
      y: 50,
      scale: 0.8
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20
      }
    },
    hover: {
      scale: 1.05,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    },
    tap: {
      scale: 0.95
    }
  };

  const rippleVariants = {
    initial: { scale: 0, opacity: 1 },
    animate: { 
      scale: 4, 
      opacity: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const renderDefaultVariant = () => (
    <motion.div
      className={`grid grid-cols-1 sm:grid-cols-2 gap-4 ${className}`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {loginProviders.map((provider) => (
        <motion.button
          key={provider.id}
          onClick={() => handleLogin(provider)}
          disabled={loadingStates[provider.id] || successStates[provider.id]}
          className={`relative overflow-hidden ${provider.color} ${provider.hoverColor} text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed`}
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
        >
          <AnimatePresence>
            {loadingStates[provider.id] && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center"
              >
                <Loader2 className="w-5 h-5 animate-spin" />
              </motion.div>
            )}
            {successStates[provider.id] && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                className="absolute inset-0 bg-green-500 flex items-center justify-center"
              >
                <CheckCircle className="w-6 h-6" />
              </motion.div>
            )}
          </AnimatePresence>
          
          {!loadingStates[provider.id] && !successStates[provider.id] && (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                {provider.icon}
              </motion.div>
              {showLabels && <span>{provider.name}</span>}
            </>
          )}

          <motion.div
            className="absolute inset-0 bg-white opacity-0"
            whileTap={{ opacity: 0.2 }}
            transition={{ duration: 0.1 }}
          />
        </motion.button>
      ))}

      <AnimatePresence>
        {Object.values(errorStates).some(error => error) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="col-span-1 sm:col-span-2 p-4 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-xl flex items-center gap-3"
          >
            <AlertCircle className="w-5 h-5 text-red-600" />
            <div className="text-red-700 dark:text-red-300 text-sm">
              {Object.values(errorStates).find(error => error)}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );

  const renderMinimalVariant = () => (
    <motion.div
      className={`flex flex-wrap gap-3 justify-center ${className}`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {loginProviders.slice(0, 5).map((provider) => (
        <motion.button
          key={provider.id}
          onClick={() => handleLogin(provider)}
          disabled={loadingStates[provider.id] || successStates[provider.id]}
          className={`relative w-12 h-12 ${provider.color} ${provider.hoverColor} rounded-full flex items-center justify-center shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300`}
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
        >
          <AnimatePresence>
            {loadingStates[provider.id] && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black bg-opacity-20 rounded-full flex items-center justify-center"
              >
                <Loader2 className="w-4 h-4 animate-spin" />
              </motion.div>
            )}
            {successStates[provider.id] && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                className="absolute inset-0 bg-green-500 rounded-full flex items-center justify-center"
              >
                <CheckCircle className="w-5 h-5 text-white" />
              </motion.div>
            )}
          </AnimatePresence>

          {!loadingStates[provider.id] && !successStates[provider.id] && (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              className="text-white"
            >
              {provider.icon}
            </motion.div>
          )}

          <motion.div
            className="absolute inset-0 rounded-full"
            whileHover={{ 
              boxShadow: "0 0 20px rgba(255,255,255,0.3)"
            }}
          />
        </motion.button>
      ))}

      <AnimatePresence>
        {Object.values(errorStates).some(error => error) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full p-3 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-xl flex items-center gap-2"
          >
            <AlertCircle className="w-4 h-4 text-red-600" />
            <div className="text-red-700 dark:text-red-300 text-sm">
              {Object.values(errorStates).find(error => error)}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );

  const renderFloatingVariant = () => (
    <motion.div
      className={`space-y-4 ${className}`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="text-center mb-6">
        <motion.h3
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xl font-semibold text-gray-800 dark:text-white mb-2"
        >
          Quick Login
        </motion.h3>
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-gray-600 dark:text-gray-400"
        >
          Choose your preferred login method
        </motion.p>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {loginProviders.slice(0, 4).map((provider, index) => (
          <motion.button
            key={provider.id}
            onClick={() => handleLogin(provider)}
            disabled={loadingStates[provider.id] || successStates[provider.id]}
            className={`relative overflow-hidden ${provider.color} ${provider.hoverColor} text-white px-6 py-4 rounded-xl font-medium transition-all duration-300 flex items-center justify-between shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed`}
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            custom={index}
          >
            <AnimatePresence>
              {loadingStates[provider.id] && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center"
                >
                  <Loader2 className="w-5 h-5 animate-spin" />
                </motion.div>
              )}
              {successStates[provider.id] && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  className="absolute inset-0 bg-green-500 flex items-center justify-center"
                >
                  <CheckCircle className="w-6 h-6" />
                </motion.div>
              )}
            </AnimatePresence>

            {!loadingStates[provider.id] && !successStates[provider.id] && (
              <>
                <div className="flex items-center gap-3">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  >
                    {provider.icon}
                  </motion.div>
                  <span>Continue with {provider.name}</span>
                </div>
                <ArrowRight className="w-5 h-5" />
              </>
            )}

            <motion.div
              className="absolute inset-0 bg-gradient-to-r opacity-0"
              style={{ background: `linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)` }}
              animate={{ x: [-100, 100] }}
              transition={{ 
                duration: 2, 
                repeat: Infinity, 
                repeatDelay: 3,
                ease: "linear"
              }}
            />
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {Object.values(errorStates).some(error => error) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="p-4 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-xl flex items-center gap-3"
          >
            <AlertCircle className="w-5 h-5 text-red-600" />
            <div className="text-red-700 dark:text-red-300 text-sm">
              {Object.values(errorStates).find(error => error)}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );

  return (
    <AnimatePresence mode="wait">
      {variant === 'default' && renderDefaultVariant()}
      {variant === 'minimal' && renderMinimalVariant()}
      {variant === 'floating' && renderFloatingVariant()}
    </AnimatePresence>
  );
};

export default SocialLoginButtons;