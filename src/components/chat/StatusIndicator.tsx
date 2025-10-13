import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { UserStatus } from '@/stores/chatStore';

interface StatusIndicatorProps {
  status: UserStatus;
  size?: 'sm' | 'md' | 'lg';
  showPulse?: boolean;
  className?: string;
}

const statusConfig = {
  online: {
    color: 'bg-green-500',
    label: 'Online',
  },
  away: {
    color: 'bg-yellow-500',
    label: 'Ausente',
  },
  busy: {
    color: 'bg-red-500',
    label: 'Ocupado',
  },
  offline: {
    color: 'bg-gray-400',
    label: 'Offline',
  },
} as const;

const sizeConfig = {
  sm: 'w-2 h-2',
  md: 'w-3 h-3',
  lg: 'w-4 h-4',
} as const;

export const StatusIndicator = ({
  status,
  size = 'md',
  showPulse = false,
  className,
}: StatusIndicatorProps) => {
  const config = statusConfig[status];
  const sizeClass = sizeConfig[size];

  return (
    <div className={cn('relative', className)}>
      <div
        className={cn(
          'rounded-full border-2 border-background',
          sizeClass,
          config.color
        )}
      />
      {showPulse && status === 'online' && (
        <motion.div
          className={cn(
            'absolute inset-0 rounded-full',
            config.color,
            'opacity-75'
          )}
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
  );
};

interface StatusBadgeProps {
  status: UserStatus;
  customStatus?: string;
  lastSeen?: Date;
  showCustomStatus?: boolean;
}

export const StatusBadge = ({
  status,
  customStatus,
  lastSeen,
  showCustomStatus = true,
}: StatusBadgeProps) => {
  const config = statusConfig[status];

  const getLastSeenText = () => {
    if (status === 'online') return 'Online agora';
    if (!lastSeen) return config.label;

    const now = new Date();
    const diff = now.getTime() - lastSeen.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Visto agora';
    if (minutes < 60) return `Visto há ${minutes}min`;
    if (hours < 24) return `Visto há ${hours}h`;
    if (days === 1) return 'Visto ontem';
    return `Visto há ${days} dias`;
  };

  return (
    <div className="flex items-center gap-2">
      <StatusIndicator status={status} size="sm" showPulse={status === 'online'} />
      <div className="flex flex-col">
        <span className="text-xs font-medium text-foreground">
          {getLastSeenText()}
        </span>
        {showCustomStatus && customStatus && (
          <span className="text-xs text-muted-foreground truncate max-w-[200px]">
            {customStatus}
          </span>
        )}
      </div>
    </div>
  );
};

interface StatusTooltipProps {
  status: UserStatus;
  customStatus?: string;
  lastSeen?: Date;
  userName?: string;
}

export const StatusTooltip = ({
  status,
  customStatus,
  lastSeen,
  userName,
}: StatusTooltipProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -5 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -5 }}
      className="absolute z-50 px-3 py-2 bg-popover text-popover-foreground rounded-lg shadow-lg border border-border"
    >
      <div className="space-y-1">
        {userName && (
          <p className="text-sm font-semibold">{userName}</p>
        )}
        <StatusBadge
          status={status}
          customStatus={customStatus}
          lastSeen={lastSeen}
          showCustomStatus={!!customStatus}
        />
      </div>
    </motion.div>
  );
};

