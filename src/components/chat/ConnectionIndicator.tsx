import { motion, AnimatePresence } from 'framer-motion';
import { Wifi, WifiOff, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ConnectionIndicatorProps {
  status: 'connected' | 'connecting' | 'disconnected' | 'reconnecting';
  className?: string;
}

const statusConfig = {
  connected: {
    icon: Wifi,
    label: 'Conectado',
    color: 'text-green-500',
    bgColor: 'bg-green-500/10',
    dotColor: 'bg-green-500',
  },
  connecting: {
    icon: Loader2,
    label: 'Conectando...',
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
    dotColor: 'bg-blue-500',
  },
  disconnected: {
    icon: WifiOff,
    label: 'Desconectado',
    color: 'text-red-500',
    bgColor: 'bg-red-500/10',
    dotColor: 'bg-red-500',
  },
  reconnecting: {
    icon: Loader2,
    label: 'Reconectando...',
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-500/10',
    dotColor: 'bg-yellow-500',
  },
} as const;

export const ConnectionIndicator = ({ status, className }: ConnectionIndicatorProps) => {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={status}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className={cn(
          'flex items-center gap-2 px-3 py-1.5 rounded-full',
          config.bgColor,
          className
        )}
      >
        <div className="relative">
          <div className={cn('w-2 h-2 rounded-full', config.dotColor)} />
          {status === 'connected' && (
            <motion.div
              className={cn('absolute inset-0 rounded-full', config.dotColor, 'opacity-75')}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.75, 0, 0.75],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          )}
        </div>
        
        <Icon
          className={cn(
            'h-3.5 w-3.5',
            config.color,
            (status === 'connecting' || status === 'reconnecting') && 'animate-spin'
          )}
        />
        
        <span className={cn('text-xs font-medium', config.color)}>
          {config.label}
        </span>
      </motion.div>
    </AnimatePresence>
  );
};

export const ConnectionIndicatorCompact = ({ status }: ConnectionIndicatorProps) => {
  const config = statusConfig[status];

  return (
    <div className="relative group">
      <div className={cn('w-2 h-2 rounded-full', config.dotColor)} />
      
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        <div className={cn(
          'px-2 py-1 rounded text-xs font-medium whitespace-nowrap',
          config.bgColor,
          config.color
        )}>
          {config.label}
        </div>
      </div>
    </div>
  );
};

