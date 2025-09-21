import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mail, 
  Lock, 
  User, 
  Phone, 
  Calendar, 
  MapPin, 
  Briefcase, 
  GraduationCap,
  Eye,
  EyeOff,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2,
  Send,
  ArrowRight,
  Star
} from 'lucide-react';

interface FormField {
  name: string;
  type: string;
  label: string;
  placeholder: string;
  required: boolean;
  icon: React.ReactNode;
  validation?: {
    pattern?: RegExp;
    minLength?: number;
    maxLength?: number;
    custom?: (value: string) => boolean;
  };
  errorMessages?: {
    pattern?: string;
    minLength?: string;
    maxLength?: string;
    custom?: string;
  };
}

interface AnimatedFormProps {
  formType: 'signup' | 'contact' | 'profile' | 'feedback';
  onSubmit: (data: any) => void;
  isLoading?: boolean;
}

const formConfigs: Record<string, FormField[]> = {
  signup: [
    {
      name: 'fullName',
      type: 'text',
      label: 'Full Name',
      placeholder: 'Enter your full name',
      required: true,
      icon: <User className="w-5 h-5" />,
      validation: {
        minLength: 2,
        pattern: /^[a-zA-Z\s]+$/
      },
      errorMessages: {
        minLength: 'Name must be at least 2 characters',
        pattern: 'Name can only contain letters and spaces'
      }
    },
    {
      name: 'email',
      type: 'email',
      label: 'Email Address',
      placeholder: 'Enter your email',
      required: true,
      icon: <Mail className="w-5 h-5" />,
      validation: {
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      },
      errorMessages: {
        pattern: 'Please enter a valid email address'
      }
    },
    {
      name: 'phone',
      type: 'tel',
      label: 'Phone Number',
      placeholder: 'Enter your phone number',
      required: false,
      icon: <Phone className="w-5 h-5" />,
      validation: {
        pattern: /^\+?[\d\s\-\(\)]{10,}$/
      },
      errorMessages: {
        pattern: 'Please enter a valid phone number'
      }
    },
    {
      name: 'password',
      type: 'password',
      label: 'Password',
      placeholder: 'Create a strong password',
      required: true,
      icon: <Lock className="w-5 h-5" />,
      validation: {
        minLength: 8,
        pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/
      },
      errorMessages: {
        minLength: 'Password must be at least 8 characters',
        pattern: 'Password must include uppercase, lowercase, number, and special character'
      }
    }
  ],
  contact: [
    {
      name: 'name',
      type: 'text',
      label: 'Your Name',
      placeholder: 'Enter your name',
      required: true,
      icon: <User className="w-5 h-5" />
    },
    {
      name: 'email',
      type: 'email',
      label: 'Email Address',
      placeholder: 'Enter your email',
      required: true,
      icon: <Mail className="w-5 h-5" />
    },
    {
      name: 'subject',
      type: 'text',
      label: 'Subject',
      placeholder: 'Enter subject',
      required: true,
      icon: <Briefcase className="w-5 h-5" />
    },
    {
      name: 'message',
      type: 'textarea',
      label: 'Message',
      placeholder: 'Type your message here...',
      required: true,
      icon: <MapPin className="w-5 h-5" />
    }
  ],
  profile: [
    {
      name: 'fullName',
      type: 'text',
      label: 'Full Name',
      placeholder: 'Enter your full name',
      required: true,
      icon: <User className="w-5 h-5" />
    },
    {
      name: 'email',
      type: 'email',
      label: 'Email Address',
      placeholder: 'Enter your email',
      required: true,
      icon: <Mail className="w-5 h-5" />
    },
    {
      name: 'dateOfBirth',
      type: 'date',
      label: 'Date of Birth',
      placeholder: 'Select your date of birth',
      required: false,
      icon: <Calendar className="w-5 h-5" />
    },
    {
      name: 'education',
      type: 'text',
      label: 'Education Level',
      placeholder: 'Enter your education level',
      required: false,
      icon: <GraduationCap className="w-5 h-5" />
    }
  ],
  feedback: [
    {
      name: 'rating',
      type: 'rating',
      label: 'Overall Rating',
      placeholder: 'Rate your experience',
      required: true,
      icon: <Star className="w-5 h-5" />
    },
    {
      name: 'feedback',
      type: 'textarea',
      label: 'Your Feedback',
      placeholder: 'Share your thoughts...',
      required: true,
      icon: <Mail className="w-5 h-5" />
    }
  ]
};

const AnimatedForm: React.FC<AnimatedFormProps> = ({ formType, onSubmit, isLoading = false }) => {
  const [formData, setFormData] = useState<{ [key: string]: any }>({});
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const fields = formConfigs[formType];

  useEffect(() => {
    const newFormData: { [key: string]: any } = {};
    fields.forEach(field => {
      newFormData[field.name] = '';
    });
    setFormData(newFormData);
  }, [formType]);

  const validateField = (field: FormField, value: any): string => {
    if (field.required && !value) {
      return `${field.label} is required`;
    }

    if (field.validation && value) {
      if (field.validation.pattern && !field.validation.pattern.test(value)) {
        return field.errorMessages?.pattern || 'Invalid format';
      }
      if (field.validation.minLength && value.length < field.validation.minLength) {
        return field.errorMessages?.minLength || `Must be at least ${field.validation.minLength} characters`;
      }
      if (field.validation.maxLength && value.length > field.validation.maxLength) {
        return field.errorMessages?.maxLength || `Must be no more than ${field.validation.maxLength} characters`;
      }
      if (field.validation.custom && !field.validation.custom(value)) {
        return field.errorMessages?.custom || 'Invalid input';
      }
    }

    return '';
  };

  const handleInputChange = (field: FormField, value: any) => {
    setFormData(prev => ({ ...prev, [field.name]: value }));
    
    if (touched[field.name]) {
      const error = validateField(field, value);
      setErrors(prev => ({ ...prev, [field.name]: error }));
    }
  };

  const handleBlur = (field: FormField) => {
    setTouched(prev => ({ ...prev, [field.name]: true }));
    const error = validateField(field, formData[field.name]);
    setErrors(prev => ({ ...prev, [field.name]: error }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: { [key: string]: string } = {};
    let isValid = true;

    fields.forEach(field => {
      const error = validateField(field, formData[field.name]);
      if (error) {
        newErrors[field.name] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    setTouched(Object.fromEntries(fields.map(field => [field.name, true])));

    if (isValid) {
      setIsSubmitting(true);
      try {
        await onSubmit(formData);
        setSubmitSuccess(true);
        setTimeout(() => {
          setSubmitSuccess(false);
          setFormData(Object.fromEntries(fields.map(field => [field.name, ''])));
          setTouched({});
          setErrors({});
        }, 3000);
      } catch (error) {
        // Handle form submission error silently
      } finally {
        setIsSubmitting(false);
      }
    }
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
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const renderField = (field: FormField) => {
    const hasError = touched[field.name] && errors[field.name];
    const isValid = touched[field.name] && !errors[field.name] && formData[field.name];

    return (
      <motion.div
        key={field.name}
        variants={itemVariants}
        className="relative"
      >
        {field.type === 'textarea' ? (
          <div className="relative">
            <textarea
              id={field.name}
              value={formData[field.name] || ''}
              onChange={(e) => handleInputChange(field, e.target.value)}
              onBlur={() => handleBlur(field)}
              placeholder=" "
              rows={4}
              className={`w-full px-4 py-3 bg-white dark:bg-gray-800 border-2 rounded-xl resize-none transition-all duration-300 ${
                hasError 
                  ? 'border-red-500 focus:border-red-500' 
                  : isValid 
                  ? 'border-green-500 focus:border-green-500' 
                  : 'border-gray-200 dark:border-gray-600 focus:border-purple-500'
              } focus:outline-none peer`}
            />
            <label
              htmlFor={field.name}
              className={`absolute left-4 -top-2.5 bg-white dark:bg-gray-800 px-2 text-sm transition-all duration-300 peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-focus:-top-2.5 peer-focus:text-sm ${
                hasError 
                  ? 'text-red-600' 
                  : isValid 
                  ? 'text-green-600' 
                  : 'text-gray-500 peer-focus:text-purple-500'
              }`}
            >
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
          </div>
        ) : field.type === 'rating' ? (
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <motion.button
                  key={star}
                  type="button"
                  onClick={() => {
                    setRating(star);
                    handleInputChange(field, star);
                  }}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="focus:outline-none"
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <motion.div
                    animate={{ 
                      scale: rating === star ? 1.2 : 1,
                      rotate: rating === star ? [0, 10, -10, 0] : 0
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    <Star
                      className={`w-8 h-8 ${
                        star <= (hoveredRating || rating)
                          ? 'text-yellow-400 fill-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  </motion.div>
                </motion.button>
              ))}
            </div>
          </div>
        ) : (
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              {field.icon}
            </div>
            <input
              id={field.name}
              type={field.type === 'password' && passwordVisible ? 'text' : field.type}
              value={formData[field.name] || ''}
              onChange={(e) => handleInputChange(field, e.target.value)}
              onBlur={() => handleBlur(field)}
              placeholder=" "
              className={`w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border-2 rounded-xl transition-all duration-300 ${
                hasError 
                  ? 'border-red-500 focus:border-red-500' 
                  : isValid 
                  ? 'border-green-500 focus:border-green-500' 
                  : 'border-gray-200 dark:border-gray-600 focus:border-purple-500'
              } focus:outline-none peer`}
            />
            <label
              htmlFor={field.name}
              className={`absolute left-10 -top-2.5 bg-white dark:bg-gray-800 px-2 text-sm transition-all duration-300 peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-focus:-top-2.5 peer-focus:text-sm ${
                hasError 
                  ? 'text-red-600' 
                  : isValid 
                  ? 'text-green-600' 
                  : 'text-gray-500 peer-focus:text-purple-500'
              }`}
            >
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            
            {field.type === 'password' && (
              <button
                type="button"
                onClick={() => setPasswordVisible(!passwordVisible)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              >
                {passwordVisible ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            )}
          </div>
        )}

        <AnimatePresence>
          {hasError && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="flex items-center gap-2 mt-2 text-red-600 text-sm"
            >
              <XCircle className="w-4 h-4" />
              {errors[field.name]}
            </motion.div>
          )}
          {isValid && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex items-center gap-2 mt-2 text-green-600 text-sm"
            >
              <CheckCircle className="w-4 h-4" />
              Looks good!
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="max-w-md mx-auto p-6"
      onClick={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
      onMouseUp={(e) => e.stopPropagation()}
      onTouchStart={(e) => e.stopPropagation()}
      onTouchEnd={(e) => e.stopPropagation()}
      style={{ pointerEvents: 'auto' }}
    >
      <AnimatePresence>
        {submitSuccess && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: -50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -50 }}
            className="mb-6 p-4 bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700 rounded-xl text-green-700 dark:text-green-300 flex items-center gap-3"
          >
            <CheckCircle className="w-6 h-6" />
            <div>
              <h3 className="font-semibold">Success!</h3>
              <p className="text-sm">Your form has been submitted successfully.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.form
        onSubmit={handleSubmit}
        className="space-y-6"
      >
        {fields.map(renderField)}

        <motion.button
          type="submit"
          disabled={isSubmitting || isLoading}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-500 text-white py-3 px-6 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {isSubmitting || isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              Submit
              <Send className="w-5 h-5" />
            </>
          )}
        </motion.button>
      </motion.form>

      {/* Form validation indicator */}
      <motion.div
        className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Form Progress</span>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {Object.values(touched).filter(Boolean).length}/{fields.length}
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <motion.div
            className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ 
              width: `${(Object.values(touched).filter(Boolean).length / fields.length) * 100}%` 
            }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AnimatedForm;