import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MessageSquare, Trash2 } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MessageBubble } from './MessageBubble';
import { MessageInput } from './MessageInput';
import { IMessage } from '@/types/chat';

interface ThreadViewProps {
  open: boolean;
  onClose: () => void;
  parentMessage: IMessage | null;
  replies: IMessage[];
  currentUserId: string;
  onSendReply: (content: string, attachments?: File[]) => void;
  onReact: (messageId: string, emoji: string) => void;
  onEdit: (messageId: string, newContent: string) => void;
  onDelete: (messageId: string) => void;
  onDeleteThread?: () => void;
}

const getInitials = (name: string) => {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

const formatTime = (date: string | Date) => {
  const messageDate = new Date(date);
  return messageDate.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

const formatDate = (date: string | Date) => {
  const messageDate = new Date(date);
  const now = new Date();
  const diffInDays = Math.floor((now.getTime() - messageDate.getTime()) / (1000 * 60 * 60 * 24));

  if (diffInDays === 0) return 'Hoje';
  if (diffInDays === 1) return 'Ontem';
  
  return messageDate.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: messageDate.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
  });
};

export const ThreadView = ({
  open,
  onClose,
  parentMessage,
  replies,
  currentUserId,
  onSendReply,
  onReact,
  onEdit,
  onDelete,
  onDeleteThread,
}: ThreadViewProps) => {
  const [replyTo, setReplyTo] = useState<IMessage | null>(null);

  if (!parentMessage) return null;

  const senderName = parentMessage.sender
    ? `${parentMessage.sender.firstName} ${parentMessage.sender.lastName}`
    : 'Usuário';

  const handleSendReply = (content: string, attachments?: File[]) => {
    onSendReply(content, attachments);
    setReplyTo(null);
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full sm:w-[540px] p-0 flex flex-col">
        <SheetHeader className="px-6 py-4 border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <MessageSquare className="h-5 w-5 text-white" />
              </div>
              <div>
                <SheetTitle>Thread</SheetTitle>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {replies.length} {replies.length === 1 ? 'resposta' : 'respostas'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {onDeleteThread && (
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={onDeleteThread}
                  className="h-9 w-9 text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
              <Button
                size="icon"
                variant="ghost"
                onClick={onClose}
                className="h-9 w-9"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </SheetHeader>

        {/* Parent Message */}
        <div className="px-6 py-4 bg-accent/30 border-b border-border">
          <div className="flex gap-3">
            <Avatar className="h-10 w-10 flex-shrink-0">
              {parentMessage.sender?.avatar ? (
                <AvatarImage src={parentMessage.sender.avatar} alt={senderName} />
              ) : (
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                  {getInitials(senderName)}
                </AvatarFallback>
              )}
            </Avatar>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-semibold">{senderName}</span>
                <span className="text-xs text-muted-foreground">
                  {formatDate(parentMessage.createdAt)} às {formatTime(parentMessage.createdAt)}
                </span>
              </div>
              <div className="text-sm text-foreground whitespace-pre-wrap break-words">
                {parentMessage.content}
              </div>
            </div>
          </div>
        </div>

        {/* Replies */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {replies.length === 0 ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center space-y-3 max-w-sm">
                <div className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mx-auto">
                  <motion.div
                    animate={{
                      scale: [1, 1.1, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  >
                    💬
                  </motion.div>
                </div>
                <h3 className="text-sm font-semibold">Nenhuma resposta ainda</h3>
                <p className="text-xs text-muted-foreground">
                  Seja o primeiro a responder esta mensagem
                </p>
              </div>
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              {replies.map((reply, index) => {
                const prevReply = index > 0 ? replies[index - 1] : undefined;
                const isGrouped = prevReply && reply.senderId === prevReply.senderId;
                const isOwnMessage = reply.senderId === currentUserId;

                return (
                  <MessageBubble
                    key={reply.id}
                    message={reply}
                    isOwnMessage={isOwnMessage}
                    isGrouped={isGrouped}
                    onReact={onReact}
                    onReply={setReplyTo}
                    onEdit={onEdit}
                    onDelete={onDelete}
                  />
                );
              })}
            </AnimatePresence>
          )}
        </div>

        {/* Reply Input */}
        <div className="border-t border-border">
          <MessageInput
            onSendMessage={handleSendReply}
            replyTo={replyTo}
            onCancelReply={() => setReplyTo(null)}
            placeholder={`Responder em thread...`}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
};

