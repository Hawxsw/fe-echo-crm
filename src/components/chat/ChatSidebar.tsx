import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Plus,
  Hash,
  MessageCircle,
  Users,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { IChat } from '@/types/chat';
import { getChatDisplayName, getChatDisplayAvatar } from '@/utils/chatUtils';
import { StatusIndicator } from './StatusIndicator';
import { ThemeToggle } from './ThemeToggle';
import { useChatStore } from '@/stores/chatStore';

interface ChatSidebarProps {
  chats: IChat[];
  currentChatId: string | null;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onChatSelect: (chatId: string) => void;
  onNewChat: () => void;
  currentUserId: string;
}


const getInitials = (name: string): string => {
  if (!name?.trim()) return 'U';
  
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (!words.length) return 'U';
  
  return words
    .slice(0, 2)
    .map(word => word[0].toUpperCase())
    .join('');
};

const TIME_UNITS = {
  MINUTE: 60 * 1000,
  HOUR: 60 * 60 * 1000,
  DAY: 24 * 60 * 60 * 1000,
} as const;

const formatLastMessageTime = (date: string | Date): string => {
  const diffInMs = Date.now() - new Date(date).getTime();
  const diffInMinutes = Math.floor(diffInMs / TIME_UNITS.MINUTE);
  const diffInHours = Math.floor(diffInMs / TIME_UNITS.HOUR);
  const diffInDays = Math.floor(diffInMs / TIME_UNITS.DAY);

  if (diffInMinutes < 1) return 'Agora';
  if (diffInMinutes < 60) return `${diffInMinutes}min`;
  if (diffInHours < 24) return `${diffInHours}h`;
  if (diffInDays === 1) return 'Ontem';
  if (diffInDays < 7) return `${diffInDays}d`;
  
  return new Date(date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
};

const MAX_MESSAGE_LENGTH = 40;

const getLastMessageTime = (chat: IChat): string => {
  const messages = chat.messages;
  return messages?.[messages.length - 1]?.createdAt || chat.createdAt;
};

const sortChatsByTime = (chats: IChat[]): IChat[] =>
  [...chats].sort((a, b) => 
    new Date(getLastMessageTime(b)).getTime() - new Date(getLastMessageTime(a)).getTime()
  );

const truncateMessage = (message: string, maxLength = MAX_MESSAGE_LENGTH): string =>
  message.length > maxLength ? `${message.slice(0, maxLength)}...` : message;

const getLastMessage = (chat: IChat): string => {
  const messages = chat.messages;
  const lastMsg = messages?.[messages.length - 1];
  return lastMsg ? truncateMessage(lastMsg.content) : '';
};

export const ChatSidebar = ({
  chats,
  currentChatId,
  searchQuery,
  onSearchChange,
  onChatSelect,
  onNewChat,
  currentUserId,
}: ChatSidebarProps) => {
  const [showDirectMessages, setShowDirectMessages] = useState(true);
  const [showChannels, setShowChannels] = useState(true);
  const { userPresences } = useChatStore();

  const { directMessages, channels } = useMemo(() => {
    const direct = chats.filter(chat => !chat.isGroup);
    const group = chats.filter(chat => chat.isGroup);
    
    return {
      directMessages: sortChatsByTime(direct),
      channels: sortChatsByTime(group),
    };
  }, [chats]);

  const renderChatItem = (chat: IChat) => {
    const chatId = (chat as { data?: IChat }).data?.id || chat.id;
    const isActive = chatId === currentChatId;
    const unreadCount = 0;
    const chatName = getChatDisplayName(chat, currentUserId);
    const chatAvatar = getChatDisplayAvatar(chat, currentUserId);
    const lastMessage = getLastMessage(chat);
    const messages = chat.messages;
    const lastMessageTime = messages?.[messages.length - 1]?.createdAt;

    const otherUser = !chat.isGroup 
      ? chat.participants?.find(p => p.userId !== currentUserId)
      : null;
    const userPresence = otherUser ? userPresences[otherUser.userId] : null;
    const userStatus = userPresence?.status || 'online';

    return (
      <motion.button
        onClick={() => onChatSelect(chatId)}
        whileHover={{ scale: 1.01, x: 4 }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.1 }}
        className={cn(
          'w-full flex items-start gap-3 p-3 rounded-xl transition-all group relative',
          'hover:bg-accent/70',
          isActive && 'bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20'
        )}
      >
        <div className="relative flex-shrink-0">
          <Avatar className={cn(
            'h-11 w-11 ring-2 transition-all',
            isActive ? 'ring-blue-500/50' : 'ring-transparent'
          )}>
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
        </div>

        <div className="flex-1 min-w-0 text-left">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <span className={cn(
                'text-sm font-medium truncate',
                unreadCount > 0 && 'text-foreground font-semibold'
              )}>
                {chat.isGroup && '#'}
                {chatName}
              </span>
            </div>
            {lastMessageTime && (
              <span className="text-xs text-muted-foreground flex-shrink-0">
                {formatLastMessageTime(lastMessageTime)}
              </span>
            )}
          </div>
          <div className="flex items-center justify-between">
            <p className={cn(
              'text-xs truncate',
              unreadCount > 0 ? 'text-foreground font-medium' : 'text-muted-foreground'
            )}>
              {lastMessage || 'Sem mensagens'}
            </p>
            {unreadCount > 0 && (
              <Badge 
                variant="default" 
                className="ml-2 h-5 min-w-5 px-1.5 text-xs rounded-full bg-primary"
              >
                {unreadCount > 99 ? '99+' : unreadCount}
              </Badge>
            )}
          </div>
        </div>
      </motion.button>
    );
  };

  return (
    <div className="h-full flex flex-col bg-background border-r border-border">
      <div className="p-4 border-b border-border space-y-3 bg-gradient-to-br from-background via-background to-accent/20">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Mensagens
          </h2>
          <div className="flex items-center gap-1">
            <ThemeToggle />
            <Button
              size="icon"
              variant="ghost"
              onClick={onNewChat}
              className="h-9 w-9 rounded-lg hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-600 hover:text-white transition-all"
            >
              <Plus className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar colaborador, canal ou grupo..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 h-10 bg-accent/50 border-0 focus-visible:ring-1"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-2 py-2 space-y-1">
        <div>
          <button
            onClick={() => setShowDirectMessages(!showDirectMessages)}
            className="w-full flex items-center gap-2 px-2 py-2 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
          >
            {showDirectMessages ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
            <MessageCircle className="h-4 w-4" />
            <span>MENSAGENS DIRETAS</span>
            <Badge variant="secondary" className="ml-auto text-xs">
              {directMessages.length}
            </Badge>
          </button>

          <AnimatePresence mode="sync">
            {showDirectMessages && (
              <motion.div
                key="direct-messages-list"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="space-y-1"
              >
                <AnimatePresence mode="popLayout">
                  {directMessages.map((chat, index) => (
                    <motion.div 
                      key={chat.id}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ delay: index * 0.05 }}
                      layout
                    >
                      {renderChatItem(chat)}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="pt-4">
          <button
            onClick={() => setShowChannels(!showChannels)}
            className="w-full flex items-center gap-2 px-2 py-2 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
          >
            {showChannels ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
            <Users className="h-4 w-4" />
            <span>CANAIS E GRUPOS</span>
            <Badge variant="secondary" className="ml-auto text-xs">
              {channels.length}
            </Badge>
          </button>

          <AnimatePresence mode="sync">
            {showChannels && (
              <motion.div
                key="channels-list"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="space-y-1"
              >
                <AnimatePresence mode="popLayout">
                  {channels.map((chat, index) => (
                    <motion.div 
                      key={chat.id}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ delay: index * 0.05 }}
                      layout
                    >
                      {renderChatItem(chat)}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {chats.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <div className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mb-4">
              <MessageCircle className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-sm font-semibold mb-2">Nenhuma conversa ainda</h3>
            <p className="text-xs text-muted-foreground mb-4">
              Comece uma nova conversa com seus colaboradores
            </p>
            <Button onClick={onNewChat} size="sm" className="rounded-lg">
              <Plus className="h-4 w-4 mr-2" />
              Nova Conversa
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

