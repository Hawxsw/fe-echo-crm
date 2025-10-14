import { motion, AnimatePresence } from 'framer-motion';
import { ReactNode, useState } from 'react';

interface TooltipProps {
  children: ReactNode;
  content: string;
  side?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
}

export const Tooltip = ({ 
  children, 
  content, 
  side = 'top',
  delay = 500 
}: TooltipProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    const id = setTimeout(() => {
      setIsVisible(true);
    }, delay);
    setTimeoutId(id);
  };

  const handleMouseLeave = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      setTimeoutId(null);
    }
    setIsVisible(false);
  };

  const getTooltipClasses = () => {
    const baseClasses = "absolute z-50 px-2 py-1 text-xs font-medium text-white bg-slate-900 rounded-md shadow-lg";
    
    switch (side) {
      case 'top':
        return `${baseClasses} bottom-full left-1/2 transform -translate-x-1/2 mb-2`;
      case 'bottom':
        return `${baseClasses} top-full left-1/2 transform -translate-x-1/2 mt-2`;
      case 'left':
        return `${baseClasses} right-full top-1/2 transform -translate-y-1/2 mr-2`;
      case 'right':
        return `${baseClasses} left-full top-1/2 transform -translate-y-1/2 ml-2`;
      default:
        return baseClasses;
    }
  };

  const getArrowClasses = () => {
    const baseClasses = "absolute w-2 h-2 bg-slate-900 transform rotate-45";
    
    switch (side) {
      case 'top':
        return `${baseClasses} top-full left-1/2 transform -translate-x-1/2 -translate-y-1/2`;
      case 'bottom':
        return `${baseClasses} bottom-full left-1/2 transform -translate-x-1/2 translate-y-1/2`;
      case 'left':
        return `${baseClasses} left-full top-1/2 transform -translate-y-1/2 -translate-x-1/2`;
      case 'right':
        return `${baseClasses} right-full top-1/2 transform -translate-y-1/2 translate-x-1/2`;
      default:
        return baseClasses;
    }
  };

  return (
    <div 
      className="relative inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            className={getTooltipClasses()}
          >
            {content}
            <div className={getArrowClasses()} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
