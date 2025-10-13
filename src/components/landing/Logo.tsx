import { Zap } from 'lucide-react';
import { motion } from 'framer-motion';

interface LogoProps {
  variant?: 'default' | 'large' | 'footer';
  onClick?: () => void;
  animated?: boolean;
}

export default function Logo({ variant = 'default', onClick, animated = true }: LogoProps) {
  const sizes = {
    default: {
      container: 'gap-2.5',
      icon: 'p-2',
      iconSize: 'h-5 w-5',
      text: 'text-xl',
    },
    large: {
      container: 'gap-3',
      icon: 'p-2.5',
      iconSize: 'h-7 w-7',
      text: 'text-3xl',
    },
    footer: {
      container: 'gap-2',
      icon: 'p-2',
      iconSize: 'h-6 w-6',
      text: 'text-2xl',
    },
  };

  const size = sizes[variant];
  const isClickable = !!onClick;

  const LogoContent = (
    <>
      <motion.div
        className="relative group/icon"
        whileHover={animated ? { rotate: [0, -10, 10, 0] } : {}}
        transition={{ duration: 0.5 }}
      >
        <div className={`bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl ${size.icon} shadow-lg group-hover:shadow-xl transition-all duration-300 relative overflow-hidden`}>
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent opacity-0 group-hover/icon:opacity-100 transition-opacity duration-500 -translate-x-full group-hover/icon:translate-x-full" 
               style={{ transition: 'transform 0.6s ease-in-out, opacity 0.3s' }} />
          
          <motion.div
            animate={animated ? {
              scale: [1, 1.1, 1],
            } : {}}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatDelay: 3,
            }}
          >
            <Zap className={`${size.iconSize} text-white relative z-10`} />
          </motion.div>
        </div>

        <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-indigo-400 rounded-xl blur-md opacity-0 group-hover/icon:opacity-50 transition-opacity duration-300 -z-10" />
      </motion.div>

      <div className="flex flex-col">
        <span className={`text-gray-900 font-bold ${size.text} bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent leading-none`}>
          echo
        </span>
        {variant === 'large' && (
          <motion.span
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xs font-medium text-gray-500 tracking-wider uppercase"
          >
            CRM Platform
          </motion.span>
        )}
      </div>
    </>
  );

  if (isClickable) {
    return (
      <motion.button
        onClick={onClick}
        className={`flex items-center ${size.container} group cursor-pointer`}
        whileHover={animated ? { scale: 1.02 } : {}}
        whileTap={animated ? { scale: 0.98 } : {}}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        {LogoContent}
      </motion.button>
    );
  }

  return (
    <motion.div
      className={`flex items-center ${size.container}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      {LogoContent}
    </motion.div>
  );
}

