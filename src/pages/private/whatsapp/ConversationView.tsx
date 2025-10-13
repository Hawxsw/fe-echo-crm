import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Phone,
  Video,
  MoreVertical,
  Send,
  Smile,
  Paperclip,
  Mic,
  Search,
  CheckCheck,
  Check,
  File,
  Download,
  X,
  MessageCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

// Mock Data - Conversas
const mockConversations = [
  {
    id: '1',
    clientName: 'Ana Silva',
    avatarUrl: '',
    phone: '+55 11 98765-4321',
    isOnline: true,
    lastSeen: new Date(),
  },
  {
    id: '2',
    clientName: 'Carlos Santos',
    avatarUrl: '',
    phone: '+55 21 97654-3210',
    isOnline: false,
    lastSeen: new Date(Date.now() - 1000 * 60 * 30),
  },
];

// Mock Data - Mensagens
const mockMessages: Record<string, any[]> = {
  '1': [
    {
      id: '1',
      text: 'Olá! Gostaria de saber mais sobre o produto.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60),
      sender: 'client',
      status: 'read',
      type: 'text',
    },
    {
      id: '2',
      text: 'Olá Ana! Claro, ficarei feliz em ajudar. Qual produto você tem interesse?',
      timestamp: new Date(Date.now() - 1000 * 60 * 55),
      sender: 'me',
      status: 'read',
      type: 'text',
    },
    {
      id: '3',
      text: 'Estou interessada no plano Business. Quais são as funcionalidades?',
      timestamp: new Date(Date.now() - 1000 * 60 * 50),
      sender: 'client',
      status: 'read',
      type: 'text',
    },
    {
      id: '4',
      text: 'O plano Business oferece recursos avançados de CRM, automação de vendas, relatórios personalizados e suporte prioritário.',
      timestamp: new Date(Date.now() - 1000 * 60 * 45),
      sender: 'me',
      status: 'read',
      type: 'text',
    },
    {
      id: '5',
      text: 'Perfeito! E qual o valor mensal?',
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
      sender: 'client',
      status: 'read',
      type: 'text',
    },
  ],
  '2': [
    {
      id: '1',
      text: 'Estava com um problema no login, mas consegui resolver!',
      timestamp: new Date(Date.now() - 1000 * 60 * 60),
      sender: 'client',
      status: 'read',
      type: 'text',
    },
    {
      id: '2',
      text: 'Que ótimo! Fico feliz que conseguiu resolver. Se precisar de algo, estou à disposição! 😊',
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      sender: 'me',
      status: 'read',
      type: 'text',
    },
  ],
};

export default function ConversationView() {
  const navigate = useNavigate();
  const { id } = useParams();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const [conversation, setConversation] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showImagePreview, setShowImagePreview] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');

  useEffect(() => {
    // Simular carregamento da conversa
    const conv = mockConversations.find(c => c.id === id);
    if (conv) {
      setConversation(conv);
      setMessages(mockMessages[id || '1'] || []);
    }

    // Simular indicador de digitação
    const typingTimer = setTimeout(() => {
      setIsTyping(true);
      setTimeout(() => setIsTyping(false), 3000);
    }, 2000);

    return () => clearTimeout(typingTimer);
  }, [id]);

  useEffect(() => {
    // Scroll para o fim quando novas mensagens chegarem
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const message = {
      id: String(messages.length + 1),
      text: newMessage,
      timestamp: new Date(),
      sender: 'me',
      status: 'sent',
      type: 'text',
    };

    setMessages([...messages, message]);
    setNewMessage('');

    // Simular status de entregue e lido
    setTimeout(() => {
      setMessages(prev => prev.map(msg => 
        msg.id === message.id ? { ...msg, status: 'delivered' } : msg
      ));
    }, 1000);

    setTimeout(() => {
      setMessages(prev => prev.map(msg => 
        msg.id === message.id ? { ...msg, status: 'read' } : msg
      ));
    }, 2000);
  };

  const formatMessageTime = (date: Date) => {
    return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sent':
        return <Check className="w-3 h-3 text-muted-foreground" />;
      case 'delivered':
        return <CheckCheck className="w-3 h-3 text-muted-foreground" />;
      case 'read':
        return <CheckCheck className="w-3 h-3 text-blue-500" />;
      default:
        return <Check className="w-3 h-3 text-muted-foreground" />;
    }
  };

  if (!conversation) {
    return (
      <div className="space-y-8 pb-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-16"
        >
          <div className="inline-block p-6 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-3xl mb-4">
            <MessageCircle className="w-16 h-16 text-green-600 mx-auto" />
          </div>
          <h3 className="text-xl font-bold mb-2">Conversa não encontrada</h3>
          <p className="text-muted-foreground mb-6">
            A conversa solicitada não foi encontrada.
          </p>
          <Button
            onClick={() => navigate('/dashboard/whatsapp')}
            className="shadow-sm hover:shadow-md transition-all duration-200"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar para Lista
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <Card className="border-0 shadow-lg rounded-b-none">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/dashboard/whatsapp')}
                  className="shadow-sm hover:shadow-md transition-all duration-200"
                >
                  <ArrowLeft className="w-4 h-4" />
                </Button>

                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar className="w-12 h-12 border-2 border-background shadow-md">
                      <AvatarImage src={conversation.avatarUrl} />
                      <AvatarFallback className="bg-gradient-to-br from-green-500 to-emerald-600 text-white font-bold">
                        {conversation.clientName.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    {conversation.isOnline && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-background rounded-full"></div>
                    )}
                  </div>

                  <div>
                    <h2 className="font-bold text-lg">{conversation.clientName}</h2>
                    <p className="text-xs text-muted-foreground">
                      {conversation.isOnline
                        ? 'Online'
                        : `Visto por último ${formatMessageTime(conversation.lastSeen)}`}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" className="h-10 w-10 p-0 shadow-sm hover:shadow-md transition-all duration-200">
                  <Search className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="sm" className="h-10 w-10 p-0 shadow-sm hover:shadow-md transition-all duration-200">
                  <Phone className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="sm" className="h-10 w-10 p-0 shadow-sm hover:shadow-md transition-all duration-200">
                  <Video className="w-5 h-5" />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-10 w-10 p-0 shadow-sm hover:shadow-md transition-all duration-200">
                      <MoreVertical className="w-5 h-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Ver informações</DropdownMenuItem>
                    <DropdownMenuItem>Silenciar notificações</DropdownMenuItem>
                    <DropdownMenuItem>Limpar conversa</DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600">Bloquear contato</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto bg-gradient-to-b from-muted/20 to-muted/40 p-6 space-y-4">
        <AnimatePresence>
          {messages.map((message, idx) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
              className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[70%] rounded-2xl p-3 shadow-md ${
                  message.sender === 'me'
                    ? 'bg-primary text-primary-foreground rounded-tr-sm'
                    : 'bg-card rounded-tl-sm'
                }`}
              >
                {message.type === 'text' && (
                  <p className="text-sm leading-relaxed break-words whitespace-pre-wrap">
                    {message.text}
                  </p>
                )}
                
                {message.type === 'image' && (
                  <div className="space-y-2">
                    <div 
                      className="rounded-lg overflow-hidden cursor-pointer"
                      onClick={() => {
                        setSelectedImage(message.imageUrl);
                        setShowImagePreview(true);
                      }}
                    >
                      <img 
                        src={message.imageUrl} 
                        alt="Imagem enviada" 
                        className="max-w-full h-auto hover:scale-105 transition-transform duration-200"
                      />
                    </div>
                    {message.text && (
                      <p className="text-sm">{message.text}</p>
                    )}
                  </div>
                )}

                {message.type === 'file' && (
                  <div className="flex items-center gap-3 p-2 bg-background/10 rounded-lg">
                    <div className="p-2 bg-background/20 rounded-lg">
                      <File className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{message.fileName}</p>
                      <p className="text-xs opacity-70">{message.fileSize}</p>
                    </div>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                )}

                <div className="flex items-center justify-end gap-1 mt-1">
                  <span className={`text-[10px] ${message.sender === 'me' ? 'opacity-90' : 'text-muted-foreground'}`}>
                    {formatMessageTime(message.timestamp)}
                  </span>
                  {message.sender === 'me' && getStatusIcon(message.status)}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing Indicator */}
        <AnimatePresence>
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex justify-start"
            >
              <div className="max-w-[70%] bg-card rounded-2xl rounded-tl-sm p-4 shadow-md">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <Card className="border-0 shadow-lg rounded-t-none border-t">
        <CardContent className="p-4">
          <form onSubmit={handleSendMessage} className="flex items-end gap-3">
            {/* Emoji Button */}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-10 w-10 p-0 flex-shrink-0"
            >
              <Smile className="w-5 h-5 text-muted-foreground" />
            </Button>

            {/* Attach Button */}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-10 w-10 p-0 flex-shrink-0"
            >
              <Paperclip className="w-5 h-5 text-muted-foreground" />
            </Button>

            {/* Message Input */}
            <div className="flex-1">
              <Input
                placeholder={`Mensagem para ${conversation?.clientName}...`}
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="border-2 focus:border-primary rounded-2xl shadow-sm focus:shadow-md transition-all duration-200"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage(e);
                  }
                }}
              />
            </div>

            {/* Send/Mic Button */}
            {newMessage.trim() ? (
              <Button
                type="submit"
                size="sm"
                className="h-10 w-10 p-0 rounded-full bg-green-600 hover:bg-green-700 shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <Send className="w-5 h-5" />
              </Button>
            ) : (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-10 w-10 p-0 flex-shrink-0"
              >
                <Mic className="w-5 h-5 text-muted-foreground" />
              </Button>
            )}
          </form>

          {/* Quick Replies */}
          <div className="flex items-center gap-2 mt-3 overflow-x-auto pb-2">
            <span className="text-xs text-muted-foreground flex-shrink-0">Respostas rápidas:</span>
            {['Olá! 👋', 'Obrigado', 'Vou verificar', 'Em breve retorno'].map((reply, idx) => (
              <Button
                key={idx}
                variant="outline"
                size="sm"
                onClick={() => setNewMessage(reply)}
                className="text-xs whitespace-nowrap shadow-sm hover:shadow-md transition-all duration-200"
              >
                {reply}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Image Preview Dialog */}
      <Dialog open={showImagePreview} onOpenChange={setShowImagePreview}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Visualizar Imagem</DialogTitle>
          </DialogHeader>
          <div className="relative">
            <img src={selectedImage} alt="Preview" className="w-full h-auto rounded-lg" />
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-2 right-2 h-8 w-8 p-0 bg-background/80 hover:bg-background"
              onClick={() => setShowImagePreview(false)}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
