import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send,
  Smile,
  Paperclip,
  Image as ImageIcon,
  Mic,
  X,
  File,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { EmojiPicker } from './EmojiPicker';
import { IMessage } from '@/types/chat';

interface MessageInputProps {
  onSendMessage: (content: string, attachments?: File[]) => void;
  replyTo?: IMessage | null;
  onCancelReply?: () => void;
  placeholder?: string;
  disabled?: boolean;
  chatName?: string;
  onTyping?: (isTyping: boolean) => void;
}

export const MessageInput = ({
  onSendMessage,
  replyTo,
  onCancelReply,
  placeholder = 'Digite uma mensagem...',
  disabled = false,
  chatName,
  onTyping,
}: MessageInputProps) => {
  const [message, setMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [message]);

  useEffect(() => {
    return () => {
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (message.trim() && !isTyping) {
      setIsTyping(true);
      onTyping?.(true);
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    if (message.trim()) {
      typingTimeoutRef.current = setTimeout(() => {
        setIsTyping(false);
        onTyping?.(false);
      }, 2000) as unknown as NodeJS.Timeout;
    } else {
      setIsTyping(false);
      onTyping?.(false);
    }
  }, [message, isTyping, onTyping]);

  const hasContent = message.trim() || attachments.length > 0;

  const resetInput = () => {
    setMessage('');
    setAttachments([]);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleSend = () => {
    if (!hasContent) return;
    
    onSendMessage(message.trim(), attachments);
    resetInput();
    
    setIsTyping(false);
    onTyping?.(false);
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleEmojiSelect = (emoji: string) => {
    setMessage(prev => prev + emoji);
    setShowEmojiPicker(false);
    textareaRef.current?.focus();
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length) {
      setAttachments(prev => [...prev, ...files]);
      e.target.value = '';
    }
  };

  const removeAttachment = (index: number) => 
    setAttachments(prev => prev.filter((_, i) => i !== index));

  const startRecording = () => {
    setIsRecording(true);
    setRecordingTime(0);
    const interval = setInterval(() => {
      setRecordingTime(prev => prev + 1);
    }, 1000);
    recordingIntervalRef.current = interval as unknown as NodeJS.Timeout;
  };

  const stopRecording = () => {
    setIsRecording(false);
    if (recordingIntervalRef.current) {
      clearInterval(recordingIntervalRef.current);
      recordingIntervalRef.current = null;
    }
    setRecordingTime(0);
  };

  const formatRecordingTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getFileIcon = (file: File) => 
    file.type.startsWith('image/') 
      ? <ImageIcon className="h-4 w-4" /> 
      : <File className="h-4 w-4" />;

  const formatFileSize = (bytes: number): string => {
    const KB = 1024;
    const MB = KB * 1024;
    
    if (bytes < KB) return `${bytes} B`;
    if (bytes < MB) return `${(bytes / KB).toFixed(1)} KB`;
    return `${(bytes / MB).toFixed(1)} MB`;
  };

  return (
    <div className="border-t border-border bg-background">
      <AnimatePresence>
        {replyTo && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="px-6 pt-3 overflow-hidden"
          >
            <div className="flex items-start gap-3 p-3 bg-accent rounded-lg">
              <div className="h-1 w-1 rounded-full bg-primary flex-shrink-0 mt-2" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-muted-foreground mb-1">
                  Respondendo a {replyTo.sender?.firstName || 'Usuário'}
                </p>
                <p className="text-sm text-foreground truncate">
                  {replyTo.content}
                </p>
              </div>
              <Button
                size="icon"
                variant="ghost"
                className="h-6 w-6 flex-shrink-0"
                onClick={onCancelReply}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {attachments.length > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="px-6 pt-3 overflow-hidden"
          >
            <div className="flex flex-wrap gap-2">
              {attachments.map((file, index) => (
                <motion.div
                  key={index}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  className="flex items-center gap-2 px-3 py-2 bg-accent rounded-lg group"
                >
                  {file.type.startsWith('image/') ? (
                    <div className="relative h-12 w-12 rounded overflow-hidden flex-shrink-0">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={file.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="h-12 w-12 rounded bg-muted flex items-center justify-center flex-shrink-0">
                      {getFileIcon(file)}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate">{file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                    onClick={() => removeAttachment(index)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isRecording && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="px-6 pt-3 overflow-hidden"
          >
            <div className="flex items-center gap-3 p-3 bg-red-500/10 rounded-lg">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="h-3 w-3 bg-red-500 rounded-full"
              />
              <span className="text-sm font-medium text-red-500">
                Gravando... {formatRecordingTime(recordingTime)}
              </span>
              <Button
                size="sm"
                variant="destructive"
                onClick={stopRecording}
                className="ml-auto"
              >
                Parar gravação
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="px-6 py-4">
        <div className="flex items-end gap-2">
          <div className="flex items-center gap-1 flex-shrink-0">
            <div className="relative">
              <Button
                size="icon"
                variant="ghost"
                className="h-10 w-10 rounded-lg"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                disabled={disabled || isRecording}
              >
                <Smile className="h-5 w-5" />
              </Button>

              <AnimatePresence>
                {showEmojiPicker && (
                  <div className="absolute bottom-full mb-2 left-0">
                    <EmojiPicker
                      onEmojiSelect={handleEmojiSelect}
                      onClose={() => setShowEmojiPicker(false)}
                    />
                  </div>
                )}
              </AnimatePresence>
            </div>

            <Button
              size="icon"
              variant="ghost"
              className="h-10 w-10 rounded-lg"
              onClick={() => fileInputRef.current?.click()}
              disabled={disabled || isRecording}
            >
              <Paperclip className="h-5 w-5" />
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              className="hidden"
              onChange={handleFileSelect}
            />

            <Button
              size="icon"
              variant="ghost"
              className="h-10 w-10 rounded-lg"
              onClick={() => imageInputRef.current?.click()}
              disabled={disabled || isRecording}
            >
              <ImageIcon className="h-5 w-5" />
            </Button>
            <input
              ref={imageInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleFileSelect}
            />
          </div>

          <div className="flex-1 relative">
            <Textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
                isRecording 
                  ? 'Gravando áudio...' 
                  : chatName 
                    ? `Escrevendo para ${chatName}...`
                    : placeholder
              }
              disabled={disabled || isRecording}
              className={cn(
                'min-h-[44px] max-h-[200px] resize-none py-3 px-4 rounded-2xl',
                'bg-accent border-0 focus-visible:ring-1',
                'placeholder:text-muted-foreground transition-all'
              )}
              rows={1}
            />
            {isTyping && message.trim() && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="absolute right-3 bottom-3 flex items-center gap-1"
              >
                <motion.div
                  className="w-1.5 h-1.5 bg-blue-500 rounded-full"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
                <motion.div
                  className="w-1.5 h-1.5 bg-blue-500 rounded-full"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                />
                <motion.div
                  className="w-1.5 h-1.5 bg-blue-500 rounded-full"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                />
              </motion.div>
            )}
          </div>

          <div className="flex items-center gap-1 flex-shrink-0">
            {!message.trim() && attachments.length === 0 && (
              <Button
                size="icon"
                variant={isRecording ? 'destructive' : 'ghost'}
                className="h-10 w-10 rounded-lg"
                onClick={isRecording ? stopRecording : startRecording}
                disabled={disabled}
              >
                <Mic className="h-5 w-5" />
              </Button>
            )}

            {(message.trim() || attachments.length > 0) && !isRecording && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
              >
                <Button
                  size="icon"
                  className={cn(
                    'h-10 w-10 rounded-lg',
                    'bg-gradient-to-r from-blue-600 to-purple-600',
                    'hover:from-blue-700 hover:to-purple-700',
                    'transition-all duration-200'
                  )}
                  onClick={handleSend}
                  disabled={disabled}
                >
                  <motion.div
                    whileTap={{ rotate: 45, scale: 1.1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Send className="h-5 w-5" />
                  </motion.div>
                </Button>
              </motion.div>
            )}
          </div>
        </div>

        <p className="text-xs text-muted-foreground mt-2 px-4">
          <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">Enter</kbd> para enviar,{' '}
          <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">Shift + Enter</kbd> para nova linha
        </p>
      </div>
    </div>
  );
};

