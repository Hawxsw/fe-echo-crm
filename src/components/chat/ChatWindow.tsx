import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { IMessage } from '@/types/chat';
import { MessageBubble } from './MessageBubble';

interface ChatWindowProps {
  messages: IMessage[];
  currentUserId: string;
  onReact: (messageId: string, emoji: string) => void;
  onReply: (message: IMessage) => void;
  onEdit: (messageId: string, newContent: string) => void;
  onDelete: (messageId: string) => void;
  isLoading?: boolean;
  typingUsers?: string[];
}

export const ChatWindow = ({
  messages,
  currentUserId,
  onReact,
  onReply,
  onEdit,
  onDelete,
  isLoading = false,
  typingUsers = [],
}: ChatWindowProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (shouldAutoScroll && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, shouldAutoScroll]);

  const handleScroll = () => {
    if (!scrollRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
    
    setShouldAutoScroll(isNearBottom);
  };

  const groupMessagesByDate = (messages: IMessage[]) => {
    const groups: { date: string; messages: IMessage[] }[] = [];
    
    messages.forEach((message) => {
      const messageDate = new Date(message.createdAt);
      const dateString = messageDate.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      });

      const existingGroup = groups.find(g => g.date === dateString);
      
      if (existingGroup) {
        existingGroup.messages.push(message);
      } else {
        groups.push({ date: dateString, messages: [message] });
      }
    });

    return groups;
  };

  const messageGroups = groupMessagesByDate(messages);

  const shouldGroup = (currentMsg: IMessage, prevMsg?: IMessage) => {
    if (!prevMsg) return false;
    
    const isSameSender = currentMsg.senderId === prevMsg.senderId;
    const timeDiff = new Date(currentMsg.createdAt).getTime() - new Date(prevMsg.createdAt).getTime();
    const withinTimeWindow = timeDiff < 5 * 60 * 1000;
    
    return isSameSender && withinTimeWindow;
  };

  return (
    <div 
      ref={scrollRef}
      onScroll={handleScroll}
      className="flex-1 overflow-y-auto px-6 py-4 space-y-4 scroll-smooth"
    >
      {isLoading ? (
        <div className="h-full flex items-center justify-center">
          <div className="text-center space-y-3">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mx-auto" />
            <p className="text-sm text-muted-foreground">Carregando mensagens...</p>
          </div>
        </div>
      ) : messages.length === 0 ? (
        <div className="h-full flex items-center justify-center">
          <div className="text-center space-y-3 max-w-sm">
            <div className="h-20 w-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mx-auto">
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                💬
              </motion.div>
            </div>
            <h3 className="text-lg font-semibold">Nenhuma mensagem ainda</h3>
            <p className="text-sm text-muted-foreground">
              Seja o primeiro a enviar uma mensagem nesta conversa
            </p>
          </div>
        </div>
      ) : (
        <>
          {messageGroups.map((group, groupIndex) => (
            <div key={groupIndex} className="space-y-4">
              {/* Date Divider */}
              <div className="flex items-center justify-center py-2">
                <div className="px-4 py-1.5 rounded-full bg-accent text-xs font-medium text-muted-foreground">
                  {group.date}
                </div>
              </div>

              {/* Messages */}
              <div className="space-y-1">
                <AnimatePresence mode="popLayout">
                  {group.messages.map((message, index) => {
                    const prevMessage = index > 0 ? group.messages[index - 1] : undefined;
                    const isGrouped = shouldGroup(message, prevMessage);
                    const isOwnMessage = message.senderId === currentUserId;

                    return (
                      <MessageBubble
                        key={message.id}
                        message={message}
                        isOwnMessage={isOwnMessage}
                        isGrouped={isGrouped}
                        onReact={onReact}
                        onReply={onReply}
                        onEdit={onEdit}
                        onDelete={onDelete}
                      />
                    );
                  })}
                </AnimatePresence>
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {typingUsers.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="flex items-center gap-2 px-4"
            >
              <div className="flex gap-1">
                <motion.div
                  className="w-2 h-2 bg-muted-foreground rounded-full"
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                />
                <motion.div
                  className="w-2 h-2 bg-muted-foreground rounded-full"
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                />
                <motion.div
                  className="w-2 h-2 bg-muted-foreground rounded-full"
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                />
              </div>
              <span className="text-xs text-muted-foreground">
                {typingUsers.length === 1
                  ? `${typingUsers[0]} está digitando...`
                  : `${typingUsers.length} pessoas estão digitando...`}
              </span>
            </motion.div>
          )}

          {/* Scroll anchor */}
          <div ref={messagesEndRef} />
        </>
      )}
    </div>
  );
};

