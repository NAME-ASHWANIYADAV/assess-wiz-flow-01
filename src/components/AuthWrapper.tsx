import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AuthFlow from './AuthFlow';
import AnimatedDashboard from './AnimatedDashboard';

interface AuthWrapperProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
}

const AuthWrapper: React.FC<AuthWrapperProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const [showDashboard, setShowDashboard] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register' | 'forgot'>('login');

  const handleAuthSuccess = () => {
    onLoginSuccess();
    setShowDashboard(true);
  };

  const handleDashboardClose = () => {
    setShowDashboard(false);
    onClose();
  };

  return (
    <AnimatePresence mode="wait">
      {!showDashboard ? (
        <motion.div
          key="auth"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={onClose}
          style={{ pointerEvents: 'auto' }}
          onMouseDown={(e) => e.stopPropagation()}
          onMouseUp={(e) => e.stopPropagation()}
          onTouchStart={(e) => e.stopPropagation()}
          onTouchEnd={(e) => e.stopPropagation()}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="w-full max-w-4xl"
            onClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
            onMouseUp={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
            onTouchEnd={(e) => e.stopPropagation()}
            style={{ pointerEvents: 'auto' }}
          >
            <div className="relative">
              <AuthFlow isOpen={isOpen} onClose={onClose} />
            </div>
          </motion.div>
        </motion.div>
      ) : (
        <motion.div
          key="dashboard"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={handleDashboardClose}
          style={{ pointerEvents: 'auto' }}
          onMouseDown={(e) => e.stopPropagation()}
          onMouseUp={(e) => e.stopPropagation()}
          onTouchStart={(e) => e.stopPropagation()}
          onTouchEnd={(e) => e.stopPropagation()}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="w-full max-w-6xl h-[90vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative">
              <AnimatedDashboard isOpen={true} onClose={handleDashboardClose} />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AuthWrapper;