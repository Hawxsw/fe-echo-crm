import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MoreVertical,
  Reply,
  Edit2,
  Trash2,
  Copy,
  Check,
  Smile,
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
import { cn } from '@/lib/utils';
import { IMessage } from '@/types/chat';
import { Input } from '@/components/ui/input';

interface MessageBubbleProps {
  message: IMessage;
  isOwnMessage: boolean;
  isGrouped?: boolean;
  onReact: (messageId: string, emoji: string) => void;
  onReply: (message: IMessage) => void;
  onEdit: (messageId: string, newContent: string) => void;
  onDelete: (messageId: string) => void;
}

const quickReactions = ['❤️', '👍', '😄', '🎉', '🔥', '👏'];

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

const detectCodeBlocks = (content: string) => {
  const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
  const parts: Array<{ type: 'text' | 'code'; content: string; language?: string }> = [];
  let lastIndex = 0;
  let match;

  while ((match = codeBlockRegex.exec(content)) !== null) {
    if (match.index > lastIndex) {
      parts.push({
        type: 'text',
        content: content.slice(lastIndex, match.index),
      });
    }

    parts.push({
      type: 'code',
      content: match[2],
      language: match[1] || 'text',
    });

    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < content.length) {
    parts.push({
      type: 'text',
      content: content.slice(lastIndex),
    });
  }

  return parts.length > 0 ? parts : [{ type: 'text' as const, content }];
};

export const MessageBubble = ({
  message,
  isOwnMessage,
  isGrouped = false,
  onReact,
  onReply,
  onEdit,
  onDelete,
}: MessageBubbleProps) => {
  const [showActions, setShowActions] = useState(false);
  const [showReactions, setShowReactions] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(message.content);
  const [copied, setCopied] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState<{ x: number; y: number } | null>(null);
  const editInputRef = useRef<HTMLInputElement>(null);
  const messageRef = useRef<HTMLDivElement>(null);

  const senderName = message.sender
    ? `${message.sender.firstName} ${message.sender.lastName}`
    : 'Usuário';

  useEffect(() => {
    if (isEditing && editInputRef.current) {
      editInputRef.current.focus();
    }
  }, [isEditing]);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleEditSubmit = () => {
    if (editContent.trim() && editContent !== message.content) {
      onEdit(message.id, editContent.trim());
    }
    setIsEditing(false);
  };

  const handleEditCancel = () => {
    setEditContent(message.content);
    setIsEditing(false);
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenuPosition({ x: e.clientX, y: e.clientY });
  };

  const handleCloseContextMenu = () => {
    setContextMenuPosition(null);
  };


  useEffect(() => {
    if (contextMenuPosition) {
      const handleClick = () => handleCloseContextMenu();
      document.addEventListener('click', handleClick);
      return () => document.removeEventListener('click', handleClick);
    }
  }, [contextMenuPosition]);

  const contentParts = detectCodeBlocks(message.content);

  const reactions = message.isEdited ? [] : [];

  return (
    <motion.div
      ref={messageRef}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => {
        setShowActions(false);
        setShowReactions(false);
      }}
      onContextMenu={handleContextMenu}
      className={cn(
        'flex gap-3 group relative',
        isOwnMessage ? 'flex-row-reverse' : 'flex-row',
        isGrouped && 'mt-1'
      )}
    >
      {!isGrouped && !isOwnMessage && (
        <div className="flex-shrink-0">
          <Avatar className="h-8 w-8">
            {message.sender?.avatar ? (
              <AvatarImage src={message.sender.avatar} alt={senderName} />
            ) : (
              <AvatarFallback className="text-xs bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                {getInitials(senderName)}
              </AvatarFallback>
            )}
          </Avatar>
        </div>
      )}

      {isGrouped && !isOwnMessage && <div className="w-8 flex-shrink-0" />}

      <div className={cn('flex flex-col', isOwnMessage ? 'items-end' : 'items-start', 'flex-1 min-w-0')}>
        {!isGrouped && (
          <div
            className={cn(
              'flex items-center gap-2 mb-1 px-1',
              isOwnMessage && 'flex-row-reverse'
            )}
          >
            <span className="text-xs font-medium text-foreground">
              {isOwnMessage ? 'Você' : senderName}
            </span>
            <span className="text-xs text-muted-foreground">
              {formatTime(message.createdAt)}
            </span>
          </div>
        )}

        <div className="relative max-w-[70%]">
          {isEditing ? (
            <div className="bg-accent rounded-lg p-3 space-y-2">
              <Input
                ref={editInputRef}
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleEditSubmit();
                  }
                  if (e.key === 'Escape') {
                    handleEditCancel();
                  }
                }}
                className="h-8 text-sm"
              />
              <div className="flex gap-2 justify-end">
                <Button size="sm" variant="ghost" onClick={handleEditCancel}>
                  Cancelar
                </Button>
                <Button size="sm" onClick={handleEditSubmit}>
                  Salvar
                </Button>
              </div>
            </div>
          ) : (
            <div
              className={cn(
                'rounded-2xl px-4 py-2.5 break-words',
                isOwnMessage
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-br-md'
                  : 'bg-accent text-foreground rounded-bl-md'
              )}
            >
              {contentParts.map((part, index) => {
                if (part.type === 'code') {
                  return (
                    <pre
                      key={index}
                      className={cn(
                        'mt-2 mb-2 p-3 rounded-lg overflow-x-auto text-xs',
                        isOwnMessage ? 'bg-black/20' : 'bg-muted'
                      )}
                    >
                      <code className={cn(isOwnMessage ? 'text-white' : 'text-foreground')}>
                        {part.content}
                      </code>
                    </pre>
                  );
                }
                return (
                  <p key={index} className="text-sm leading-relaxed whitespace-pre-wrap">
                    {part.content}
                  </p>
                );
              })}

              {message.isEdited && (
                <span
                  className={cn(
                    'text-xs mt-1 block',
                    isOwnMessage ? 'text-white/70' : 'text-muted-foreground'
                  )}
                >
                  (editado)
                </span>
              )}
            </div>
          )}

          {showActions && !isEditing && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className={cn(
                'absolute -top-3 flex items-center gap-1 bg-background border border-border rounded-lg shadow-lg p-1',
                isOwnMessage ? 'right-0' : 'left-0'
              )}
            >
              <div className="relative">
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-7 w-7"
                  onMouseEnter={() => setShowReactions(true)}
                >
                  <Smile className="h-3.5 w-3.5" />
                </Button>

                {showReactions && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute bottom-full mb-1 left-0 bg-background border border-border rounded-lg shadow-lg p-2 flex gap-1"
                  >
                    {quickReactions.map((emoji) => (
                      <button
                        key={emoji}
                        onClick={() => onReact(message.id, emoji)}
                        className="hover:bg-accent rounded p-1 transition-colors text-lg"
                      >
                        {emoji}
                      </button>
                    ))}
                  </motion.div>
                )}
              </div>

              <Button
                size="icon"
                variant="ghost"
                className="h-7 w-7"
                onClick={() => onReply(message)}
              >
                <Reply className="h-3.5 w-3.5" />
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="icon" variant="ghost" className="h-7 w-7">
                    <MoreVertical className="h-3.5 w-3.5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align={isOwnMessage ? 'end' : 'start'} className="z-[60]">
                  <DropdownMenuItem onClick={handleCopy}>
                    {copied ? (
                      <>
                        <Check className="mr-2 h-4 w-4" />
                        <span>Copiado!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="mr-2 h-4 w-4" />
                        <span>Copiar texto</span>
                      </>
                    )}
                  </DropdownMenuItem>

                  {isOwnMessage && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => setIsEditing(true)}>
                        <Edit2 className="mr-2 h-4 w-4" />
                        <span>Editar mensagem</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onDelete(message.id)}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        <span>Excluir mensagem</span>
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </motion.div>
          )}

          {reactions.length > 0 && (
            <div
              className={cn(
                'flex flex-wrap gap-1 mt-1',
                isOwnMessage && 'justify-end'
              )}
            >
              {reactions.map((reaction, index) => (
                <button
                  key={index}
                  className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-accent hover:bg-accent/80 transition-colors"
                >
                  <span className="text-xs">{reaction}</span>
                  <span className="text-xs font-medium text-muted-foreground">1</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {isGrouped && showActions && (
          <span className="text-xs text-muted-foreground mt-1 px-1">
            {formatTime(message.createdAt)}
          </span>
        )}
      </div>

      <AnimatePresence>
        {contextMenuPosition && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.1 }}
            style={{
              position: 'fixed',
              left: contextMenuPosition.x,
              top: contextMenuPosition.y,
              zIndex: 9999,
            }}
            className="bg-popover text-popover-foreground rounded-lg shadow-lg border border-border py-1 min-w-[180px]"
          >
            <button
              onClick={() => {
                onReply(message);
                handleCloseContextMenu();
              }}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-accent transition-colors"
            >
              <Reply className="h-4 w-4" />
              <span>Responder</span>
            </button>

            <button
              onClick={() => {
                handleCopy();
                handleCloseContextMenu();
              }}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-accent transition-colors"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4" />
                  <span>Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  <span>Copiar</span>
                </>
              )}
            </button>

            {isOwnMessage && (
              <>
                <div className="h-px bg-border my-1" />
                <button
                  onClick={() => {
                    setIsEditing(true);
                    handleCloseContextMenu();
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-accent transition-colors"
                >
                  <Edit2 className="h-4 w-4" />
                  <span>Editar</span>
                </button>
                <button
                  onClick={() => {
                    onDelete(message.id);
                    handleCloseContextMenu();
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                  <span>Excluir</span>
                </button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

