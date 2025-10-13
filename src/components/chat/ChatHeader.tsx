import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MoreVertical,
  Phone,
  Video,
  Pin,
  Bell,
  BellOff,
  Archive,
  Trash2,
  Users,
  Info,
  Hash,
  X,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { IChat } from '@/types/chat';
import { getChatDisplayName, getChatDisplayAvatar } from '@/utils/chatUtils';
import { StatusIndicator, StatusTooltip } from './StatusIndicator';
import { useChatStore } from '@/stores/chatStore';

interface ChatHeaderProps {
  chat: IChat;
  onClose?: () => void;
  onViewInfo: () => void;
  onPin: () => void;
  onMute: () => void;
  onArchive: () => void;
  onDelete: () => void;
  currentUserId: string;
  isMuted?: boolean;
  isPinned?: boolean;
}

const getStatusText = (isOnline?: boolean, lastSeen?: Date) => {
  if (isOnline) return 'Online';
  if (lastSeen) {
    const diffInMs = Date.now() - lastSeen.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Visto agora';
    if (diffInMinutes < 60) return `Visto há ${diffInMinutes}min`;
    
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    if (diffInHours < 24) return `Visto há ${diffInHours}h`;
    
    return `Visto há ${Math.floor(diffInHours / 24)}d`;
  }
  return 'Offline';
};

const getInitials = (name: string) => {
  if (!name || typeof name !== 'string') return 'U';
  
  const words = name.trim().split(' ').filter(word => word.length > 0);
  
  if (words.length === 0) return 'U';
  if (words.length === 1) return words[0][0].toUpperCase();
  
  return words
    .slice(0, 2)
    .map(word => word[0])
    .join('')
    .toUpperCase();
};

export const ChatHeader = ({
  chat,
  onClose,
  onViewInfo,
  onPin,
  onMute,
  onArchive,
  onDelete,
  currentUserId,
  isMuted = false,
  isPinned = false,
}: ChatHeaderProps) => {
  const [showStatusTooltip, setShowStatusTooltip] = useState(false);
  const { userPresences } = useChatStore();

  const getChatName = () => {
    return getChatDisplayName(chat, currentUserId);
  };

  const getChatAvatar = () => {
    return getChatDisplayAvatar(chat, currentUserId);
  };

  const getMemberCount = () => {
    return chat.participants?.length || 0;
  };

  const chatName = getChatName();
  const chatAvatar = getChatAvatar();
  const memberCount = getMemberCount();

  const otherUser = !chat.isGroup 
    ? chat.participants?.find(p => p.userId !== currentUserId)
    : null;
  const userPresence = otherUser ? userPresences[otherUser.userId] : null;
  const userStatus = userPresence?.status || 'online';

  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="flex items-center justify-between px-6 py-4 border-b border-border bg-background/95 backdrop-blur-sm sticky top-0 z-10"
    >
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <div 
          className="relative flex-shrink-0"
          onMouseEnter={() => !chat.isGroup && setShowStatusTooltip(true)}
          onMouseLeave={() => setShowStatusTooltip(false)}
        >
          <Avatar className="h-10 w-10 ring-2 ring-background">
            {chatAvatar ? (
              <AvatarImage src={chatAvatar} alt={chatName} />
            ) : (
              <AvatarFallback className={cn(
                'text-sm font-medium',
                chat.isGroup && 'bg-gradient-to-br from-blue-500 to-purple-600 text-white'
              )}>
                {chat.isGroup ? <Hash className="h-5 w-5" /> : getInitials(chatName)}
              </AvatarFallback>
            )}
          </Avatar>
          {!chat.isGroup && (
            <StatusIndicator
              status={userStatus}
              size="md"
              showPulse={userStatus === 'online'}
              className="absolute bottom-0 right-0"
            />
          )}

          {showStatusTooltip && !chat.isGroup && (
            <AnimatePresence>
              <div className="absolute top-full left-0 mt-2 z-50">
                <StatusTooltip
                  status={userStatus}
                  customStatus={userPresence?.customStatus}
                  lastSeen={userPresence?.lastSeen}
                  userName={chatName}
                />
              </div>
            </AnimatePresence>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            {isPinned && <Pin className="h-3.5 w-3.5 text-muted-foreground" />}
            <h2 className="text-base font-semibold truncate">
              {chat.isGroup && '#'}
              {chatName}
            </h2>
            {isMuted && (
              <Badge variant="secondary" className="text-xs">
                <BellOff className="h-3 w-3" />
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            {chat.isGroup ? (
              <>
                <Users className="h-3 w-3" />
                <span>{memberCount} membros</span>
              </>
            ) : (
              <>
                {userStatus === 'online' ? (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-green-500 font-medium"
                  >
                    ● Online agora
                  </motion.span>
                ) : (
                  <span>{getStatusText(false, userPresence?.lastSeen)}</span>
                )}
                {userPresence?.customStatus && (
                  <span className="ml-2 truncate max-w-[150px]">
                    {userPresence.customStatus}
                  </span>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {!chat.isGroup && (
          <>
            <Button
              size="icon"
              variant="ghost"
              className="h-9 w-9 rounded-lg"
              title="Fazer chamada de voz"
            >
              <Phone className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="h-9 w-9 rounded-lg"
              title="Fazer videochamada"
            >
              <Video className="h-4 w-4" />
            </Button>
          </>
        )}

        <Button
          size="icon"
          variant="ghost"
          onClick={onViewInfo}
          className="h-9 w-9 rounded-lg"
          title="Ver informações"
        >
          <Info className="h-4 w-4" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              size="icon"
              variant="ghost"
              className="h-9 w-9 rounded-lg"
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 z-[60]">
            <DropdownMenuItem onClick={onPin}>
              <Pin className="mr-2 h-4 w-4" />
              <span>{isPinned ? 'Desafixar' : 'Fixar'} conversa</span>
            </DropdownMenuItem>
            
            <DropdownMenuItem onClick={onMute}>
              {isMuted ? (
                <>
                  <Bell className="mr-2 h-4 w-4" />
                  <span>Ativar notificações</span>
                </>
              ) : (
                <>
                  <BellOff className="mr-2 h-4 w-4" />
                  <span>Silenciar notificações</span>
                </>
              )}
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            {chat.isGroup && (
              <DropdownMenuItem onClick={onViewInfo}>
                <Users className="mr-2 h-4 w-4" />
                <span>Ver membros</span>
              </DropdownMenuItem>
            )}

            <DropdownMenuItem onClick={onArchive}>
              <Archive className="mr-2 h-4 w-4" />
              <span>Arquivar conversa</span>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem 
              onClick={onDelete}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              <span>Excluir histórico</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {onClose && (
          <Button
            size="icon"
            variant="ghost"
            onClick={onClose}
            className="h-9 w-9 rounded-lg md:hidden"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </motion.div>
  );
};

