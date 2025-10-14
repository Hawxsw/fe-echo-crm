import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Search,
  MessageCircle,
  Plus,
  Phone,
  Video,
  MoreVertical,
  CheckCheck,
  Pin,
  Archive,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';


const mockConversations = [
  {
    id: '1',
    clientName: 'Ana Silva',
    avatarUrl: '',
    lastMessage: 'Olá! Gostaria de saber mais sobre o produto.',
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
    unreadCount: 3,
    isOnline: true,
    isPinned: true,
  },
  {
    id: '2',
    clientName: 'Carlos Santos',
    avatarUrl: '',
    lastMessage: 'Obrigado pela ajuda! Funcionou perfeitamente.',
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    unreadCount: 0,
    isOnline: false,
    isPinned: false,
  },
  {
    id: '3',
    clientName: 'Marina Costa',
    avatarUrl: '',
    lastMessage: 'Quando vai estar disponível?',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    unreadCount: 1,
    isOnline: true,
    isPinned: false,
  },
  {
    id: '4',
    clientName: 'Pedro Oliveira',
    avatarUrl: '',
    lastMessage: 'Recebi o orçamento, vou analisar.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5),
    unreadCount: 0,
    isOnline: false,
    isPinned: false,
  },
  {
    id: '5',
    clientName: 'Julia Ferreira',
    avatarUrl: '',
    lastMessage: '👍',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
    unreadCount: 0,
    isOnline: false,
    isPinned: false,
  },
];

export default function ConversationsList() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [conversations] = useState(mockConversations);

  const filteredConversations = conversations.filter(conv =>
    conv.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.lastMessage.toLowerCase().includes(searchTerm.toLowerCase())
  );


  const pinnedConversations = filteredConversations.filter(c => c.isPinned);
  const regularConversations = filteredConversations.filter(c => !c.isPinned);

  const totalUnread = conversations.reduce((sum, conv) => sum + conv.unreadCount, 0);

  return (
    <div className="space-y-8 pb-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="relative">
            <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary via-blue-600 to-purple-600 bg-clip-text text-transparent">
              WhatsApp Business
            </h1>
            <p className="text-muted-foreground mt-2 text-base font-light flex items-center gap-2">
              <MessageCircle className="w-4 h-4" />
              Gerencie conversas com clientes
            </p>
            <div className="absolute -top-1 -left-1 w-20 h-20 bg-primary/5 rounded-full blur-3xl -z-10" />
          </div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
          >
            <Button className="shadow-lg hover:shadow-xl transition-all duration-200 bg-green-600 hover:bg-green-700">
              <Plus className="w-4 h-4 mr-2" />
              Nova Conversa
            </Button>
          </motion.div>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          whileHover={{ y: -4, transition: { duration: 0.2 } }}
        >
          <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-emerald-500 opacity-0 group-hover:opacity-5 transition-opacity duration-300" />
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="p-3 rounded-2xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 transition-transform duration-300 group-hover:scale-110">
                  <MessageCircle className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <div className="text-3xl font-bold mb-1 bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text">
                {conversations.length}
              </div>
              <p className="text-xs text-muted-foreground">Total de Conversas</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          whileHover={{ y: -4, transition: { duration: 0.2 } }}
        >
          <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-cyan-500 opacity-0 group-hover:opacity-5 transition-opacity duration-300" />
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 transition-transform duration-300 group-hover:scale-110">
                  <CheckCheck className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <div className="text-3xl font-bold mb-1 bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text">
                {totalUnread}
              </div>
              <p className="text-xs text-muted-foreground">Não Lidas</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          whileHover={{ y: -4, transition: { duration: 0.2 } }}
        >
          <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-emerald-500 opacity-0 group-hover:opacity-5 transition-opacity duration-300" />
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="p-3 rounded-2xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 transition-transform duration-300 group-hover:scale-110">
                  <CheckCheck className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <div className="text-3xl font-bold mb-1 bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text">
                {conversations.filter(c => c.isOnline).length}
              </div>
              <p className="text-xs text-muted-foreground">Clientes Online</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          whileHover={{ y: -4, transition: { duration: 0.2 } }}
        >
          <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 opacity-0 group-hover:opacity-5 transition-opacity duration-300" />
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="p-3 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 transition-transform duration-300 group-hover:scale-110">
                  <Pin className="h-6 w-6 text-purple-600" />
                </div>
              </div>
              <div className="text-3xl font-bold mb-1 bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text">
                {pinnedConversations.length}
              </div>
              <p className="text-xs text-muted-foreground">Fixadas</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                placeholder="Buscar conversas ou mensagens..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 shadow-sm focus:shadow-md transition-shadow duration-200"
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Conversations List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <Card className="border-0 shadow-lg overflow-hidden">
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {/* Pinned Conversations */}
              {pinnedConversations.length > 0 && (
                <div className="bg-muted/30">
                  <div className="px-6 py-3 flex items-center gap-2">
                    <Pin className="w-4 h-4 text-muted-foreground" />
                    <span className="text-xs font-semibold text-muted-foreground uppercase">Fixadas</span>
                  </div>
                  {pinnedConversations.map((conversation) => (
                    <ConversationItem
                      key={conversation.id}
                      conversation={conversation}
                      onClick={() => navigate(`/dashboard/whatsapp/${conversation.id}`)}
                    />
                  ))}
                </div>
              )}

              {/* Regular Conversations */}
              {regularConversations.length > 0 && (
                <div>
                  {pinnedConversations.length > 0 && (
                    <div className="px-6 py-3">
                      <span className="text-xs font-semibold text-muted-foreground uppercase">
                        Todas as conversas
                      </span>
                    </div>
                  )}
                  {regularConversations.map((conversation) => (
                    <ConversationItem
                      key={conversation.id}
                      conversation={conversation}
                      onClick={() => navigate(`/dashboard/whatsapp/${conversation.id}`)}
                    />
                  ))}
                </div>
              )}

              {/* Empty State */}
              {filteredConversations.length === 0 && (
                <div className="text-center py-16 px-6">
                  <div className="inline-block p-6 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-3xl mb-4">
                    <MessageCircle className="w-16 h-16 text-green-600 mx-auto" />
                  </div>
                  <h3 className="text-xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent mb-2">
                    {searchTerm ? 'Nenhuma conversa encontrada' : 'Nenhuma conversa ainda'}
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    {searchTerm
                      ? 'Tente buscar com outros termos'
                      : 'As conversas do WhatsApp aparecerão aqui'}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}


interface ConversationItemProps {
  conversation: typeof mockConversations[0];
  onClick: () => void;
}

function ConversationItem({ conversation, onClick }: ConversationItemProps) {
  const getInitials = (name: string) => {
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInMinutes < 1) return 'Agora';
    if (diffInMinutes < 60) return `${diffInMinutes}m`;
    if (diffInHours < 24) return `${diffInHours}h`;
    if (diffInDays === 1) return 'Ontem';
    if (diffInDays < 7) return `${diffInDays}d`;
    
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
  };

  return (
    <div
      className="px-6 py-4 hover:bg-accent/50 transition-colors duration-200 cursor-pointer group relative"
      onClick={onClick}
    >
      <div className="flex items-center gap-4">
        {/* Avatar */}
        <div className="relative flex-shrink-0">
          <Avatar className="w-14 h-14 border-2 border-background shadow-md">
            <AvatarImage src={conversation.avatarUrl} />
            <AvatarFallback className="bg-gradient-to-br from-green-500 to-emerald-600 text-white font-bold">
              {getInitials(conversation.clientName)}
            </AvatarFallback>
          </Avatar>
          {conversation.isOnline && (
            <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-background rounded-full"></div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-semibold text-foreground truncate group-hover:text-primary transition-colors">
              {conversation.clientName}
            </h3>
            <div className="flex items-center gap-2">
              {conversation.isPinned && (
                <Pin className="w-3.5 h-3.5 text-muted-foreground fill-current" />
              )}
              <span className="text-xs text-muted-foreground">
                {formatTimestamp(conversation.timestamp)}
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between gap-2">
            <p className={`text-sm truncate ${conversation.unreadCount > 0 ? 'font-semibold text-foreground' : 'text-muted-foreground'}`}>
              {conversation.lastMessage}
            </p>
            {conversation.unreadCount > 0 && (
              <Badge className="bg-green-600 text-white rounded-full min-w-[24px] h-6 flex items-center justify-center px-2">
                {conversation.unreadCount}
              </Badge>
            )}
          </div>
        </div>

        {/* Actions Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
            <Button
              variant="ghost"
              size="sm"
              className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0"
            >
              <MoreVertical className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem>
              <Phone className="w-4 h-4 mr-2" />
              Ligar
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Video className="w-4 h-4 mr-2" />
              Videochamada
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Pin className="w-4 h-4 mr-2" />
              {conversation.isPinned ? 'Desafixar' : 'Fixar'}
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Archive className="w-4 h-4 mr-2" />
              Arquivar
            </DropdownMenuItem>
            <DropdownMenuItem>
              {conversation.unreadCount > 0 ? (
                <>
                  <VolumeX className="w-4 h-4 mr-2" />
                  Silenciar
                </>
              ) : (
                <>
                  <Volume2 className="w-4 h-4 mr-2" />
                  Ativar som
                </>
              )}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
