import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Loader2 } from 'lucide-react';
import { useChat } from '@/hooks/useChat';
import { useUsers } from '@/hooks/useUsers';
import { useAuth } from '@/hooks/useAuth';
import { useWebSocket } from '@/hooks/useWebSocket';
import { IChat, IMessage, ICreateChat } from '@/types/chat';
import { ChatSidebar } from '@/components/chat/ChatSidebar';
import { ChatHeader } from '@/components/chat/ChatHeader';
import { ChatWindow } from '@/components/chat/ChatWindow';
import { MessageInput } from '@/components/chat/MessageInput';
import { NewChannelModal } from '@/components/chat/NewChannelModal';
import { ThreadView } from '@/components/chat/ThreadView';
import { MediaModal } from '@/components/chat/MediaModal';
import { ConnectionIndicator } from '@/components/chat/ConnectionIndicator';
import { toast } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';
import { useChatStore } from '@/stores/chatStore';
import { getChatDisplayName } from '@/utils/chatUtils';
import { usePresence } from '@/hooks/usePresence';

const createChatKey = (chat: IChat): string => {
  if (!chat.isGroup && chat.participants?.length === 2) {
    return chat.participants
      .map(p => p.userId)
      .sort()
      .join('-');
  }
  return chat.id;
};

const filterDuplicateChats = (chats: IChat[]): IChat[] => {
  const seen = new Set<string>();
  return chats.filter(chat => {
    const key = createChatKey(chat);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

export default function InternalChat() {
  const [chats, setChats] = useState<IChat[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Record<string, IMessage[]>>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [showThreadView, setShowThreadView] = useState(false);
  const [threadMessage] = useState<IMessage | null>(null);
  const [showMediaModal, setShowMediaModal] = useState(false);
  const [selectedMedia] = useState<never[]>([]);
  const [isLoadingChats, setIsLoadingChats] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [replyTo, setReplyTo] = useState<IMessage | null>(null);

  const { getAllChats, getChatById, createChat, sendMessage, markAsRead } = useChat();
  const { users, getAllUsers } = useUsers();
  const { currentUser } = useAuth();

  const currentUserId = currentUser?.id || 'current-user';

  const extractChatsArray = (data: unknown): IChat[] => {
    if (Array.isArray(data)) return data;
    if (data && typeof data === 'object' && 'data' in data) {
      const nested = (data as { data: unknown }).data;
      return Array.isArray(nested) ? nested : [];
    }
    return [];
  };

  const loadChats = useCallback(async () => {
    try {
      setIsLoadingChats(true);
      const data = await getAllChats();
      const processedChats = extractChatsArray(data);
      const uniqueChats = filterDuplicateChats(processedChats);
      setChats(uniqueChats);
    } catch (error) {
      toast.error('Não foi possível carregar as conversas');
      setChats([]);
    } finally {
      setIsLoadingChats(false);
    }
  }, [getAllChats]);


  const createTemporaryChat = (message: IMessage): IChat => ({
    id: message.chatId,
    name: undefined,
    isGroup: false,
    companyId: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    participants: [],
    messages: [message],
  });

  const updateChatWithMessage = (chat: IChat, message: IMessage): IChat => ({
    ...chat,
    messages: [message],
    updatedAt: new Date().toISOString(),
  });

  const handleNewMessage = useCallback((message: IMessage) => {
    if (message.senderId === currentUserId) return;
    
    setMessages(prev => ({
      ...prev,
      [message.chatId]: [...(prev[message.chatId] || []), message],
    }));
    
    if (!currentChatId) {
      setCurrentChatId(message.chatId);
    }
    
    setChats(prev => {
      const chatExists = prev.some(chat => chat.id === message.chatId);
      
      if (!chatExists) {
        loadChats();
        return [...prev, createTemporaryChat(message)];
      }
      
      return prev.map(chat => 
        chat.id === message.chatId ? updateChatWithMessage(chat, message) : chat
      );
    });
  }, [currentUserId, currentChatId, loadChats]);

  const handleUserTyping = useCallback((_userId: string, _isTyping: boolean) => {
    // TODO: Implementar indicador de digitação
  }, []);

  const handleMessageRead = useCallback((_chatId: string, _userId: string) => {
    // TODO: Implementar indicador de leitura
  }, []);

  const { isConnected, joinChat, leaveChat } = useWebSocket({
    onNewMessage: handleNewMessage,
    onUserTyping: handleUserTyping,
    onMessageRead: handleMessageRead,
  });

  const { setConnectionStatus } = useChatStore();
  const { updateUserStatus } = usePresence(isConnected);

  useEffect(() => {
    setConnectionStatus(isConnected ? 'connected' : 'disconnected');
  }, [isConnected, setConnectionStatus]);

  useEffect(() => {
    if (isConnected) {
      users.forEach(user => {
        if (user.id !== currentUserId) {
          updateUserStatus(user.id, 'online');
        }
      });
    }
  }, [isConnected, currentUserId, users, updateUserStatus]);

  const loadUsers = useCallback(async () => {
    try {
      await getAllUsers();
    } catch (_error) {
      toast.error('Erro ao carregar usuários');
    }
  }, [getAllUsers]);

  useEffect(() => {
    Promise.all([loadChats(), loadUsers()]);
  }, [loadChats, loadUsers]);

  useEffect(() => {
    if (chats.length === 0) return;
    
    const savedChatId = localStorage.getItem('currentChatId');
    if (!savedChatId || currentChatId) return;
    
    const chatExists = chats.some(chat => {
      const actualChat = (chat as { data?: IChat }).data || chat;
      return actualChat.id === savedChatId;
    });
    
    if (chatExists) {
      setCurrentChatId(savedChatId);
    } else {
      localStorage.removeItem('currentChatId');
    }
  }, [chats, currentChatId]);

  useEffect(() => {
    if (!currentChatId) return;
    
    loadMessages(currentChatId);
    localStorage.setItem('currentChatId', currentChatId);
  }, [currentChatId]);


  const loadMessages = useCallback(async (chatId: string) => {
    try {
      setIsLoadingMessages(true);
      
      const chatData = await getChatById(chatId);
      const chat = (chatData as { data?: IChat }).data || chatData;
      
      setMessages(prev => ({
        ...prev,
        [chatId]: chat.messages || [],
      }));

      await markAsRead(chatId);
    } catch (_error) {
      toast.error('Não foi possível carregar as mensagens');
      setMessages(prev => ({
        ...prev,
        [chatId]: [],
      }));
    } finally {
      setIsLoadingMessages(false);
    }
  }, [getChatById, markAsRead]);

  const handleSelectChat = useCallback((chatId: string) => {
    if (currentChatId) {
      leaveChat(currentChatId);
    }
    
    setCurrentChatId(chatId);
    setReplyTo(null);
    joinChat(chatId);
  }, [currentChatId, leaveChat, joinChat]);

  const handleSendMessage = useCallback(async (content: string, _attachments?: File[]) => {
    if (!currentChatId) return;

    try {
      const newMessage = await sendMessage(currentChatId, content);
      const messageData = (newMessage as { data?: IMessage }).data || newMessage;
      
      if (messageData?.id) {
        setMessages(prev => ({
          ...prev,
          [currentChatId]: [...(prev[currentChatId] || []), messageData],
        }));
        
        toast.success('Mensagem enviada com sucesso!');
        setReplyTo(null);
      } else {
        toast.error('Erro na estrutura da mensagem');
        await loadMessages(currentChatId);
      }
    } catch (_error) {
      toast.error('Não foi possível enviar a mensagem');
      try {
        await loadMessages(currentChatId);
      } catch (_reloadError) {
        // Silent fail
      }
    }
  }, [currentChatId, sendMessage, loadMessages]);

  const handleEditMessage = useCallback(async (messageId: string, newContent: string) => {
    if (!currentChatId) return;

    try {
      setMessages(prev => ({
        ...prev,
        [currentChatId]: prev[currentChatId]?.map(msg =>
          msg.id === messageId
            ? { ...msg, content: newContent, isEdited: true, updatedAt: new Date().toISOString() }
            : msg
        ) || [],
      }));

      toast.success('Mensagem editada com sucesso');
    } catch (_error) {
      toast.error('Não foi possível editar a mensagem');
    }
  }, [currentChatId]);

  const handleDeleteMessage = useCallback(async (messageId: string) => {
    if (!currentChatId) return;

    try {
      setMessages(prev => ({
        ...prev,
        [currentChatId]: prev[currentChatId]?.filter(msg => msg.id !== messageId) || [],
      }));

      toast.success('Mensagem excluída');
    } catch (_error) {
      toast.error('Não foi possível excluir a mensagem');
    }
  }, [currentChatId]);

  const handleReactToMessage = useCallback((_messageId: string, _emoji: string) => {
    // TODO: Implementar reações
  }, []);

  const handleReplyToMessage = useCallback((message: IMessage) => {
    setReplyTo(message);
  }, []);

  const handleCreateChat = useCallback(async (data: ICreateChat) => {
    try {
      const newChat = await createChat(data);

      setChats(prev => [newChat, ...prev]);
      setCurrentChatId(newChat.id);
      setShowNewChatModal(false);

      const successMessage = data.isGroup
        ? `Canal #${data.name} criado com sucesso`
        : 'Nova conversa iniciada';
      
      toast.success(successMessage);
    } catch (_error) {
      toast.error('Não foi possível criar a conversa');
    }
  }, [createChat]);

  const handleViewInfo = useCallback(() => {
    // TODO: Implementar visualização de informações
  }, []);

  const handlePin = useCallback(() => {
    // TODO: Implementar fixar conversa
  }, []);

  const handleMute = useCallback(() => {
    // TODO: Implementar silenciar conversa
  }, []);

  const handleArchive = useCallback(() => {
    // TODO: Implementar arquivar conversa
  }, []);

  const handleDelete = useCallback(() => {
    // TODO: Implementar excluir histórico
  }, []);

  const currentChat = useMemo(() => 
    chats.find(c => {
      const chatId = (c as { data?: IChat }).data?.id || c.id;
      return chatId === currentChatId;
    }), 
  [chats, currentChatId]);

  const currentMessages = useMemo(() => 
    currentChatId ? messages[currentChatId] || [] : [], 
  [currentChatId, messages]);

  const filteredChats = useMemo(() => {
    if (!searchQuery) return chats;

    return chats.filter(chat => {
      const chatName = chat.name?.toLowerCase() || '';
      const participantNames = chat.participants
        ?.map(p => `${p.user?.firstName} ${p.user?.lastName}`)
        .join(' ')
        .toLowerCase() || '';

      const query = searchQuery.toLowerCase();
      return chatName.includes(query) || participantNames.includes(query);
    });
  }, [chats, searchQuery]);

  const modalUsers = useMemo(() => 
    users
      .filter(u => u.id !== currentUserId)
      .map(u => ({
        id: u.id,
        firstName: u.firstName,
        lastName: u.lastName,
        email: u.email,
        avatar: u.avatar || undefined,
        role: typeof u.role === 'object' && u.role !== null ? u.role.name : undefined,
      })),
  [users, currentUserId]);

  return (
    <div className="h-screen flex overflow-hidden bg-background">
      {/* Sidebar */}
      <div className={cn(
        'w-80 flex-shrink-0 border-r border-border',
        'md:block',
        currentChatId && 'hidden md:block'
      )}>
        {isLoadingChats ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center space-y-3">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mx-auto" />
              <p className="text-sm text-muted-foreground">Carregando conversas...</p>
            </div>
          </div>
        ) : (
          <ChatSidebar
            chats={filteredChats}
            currentChatId={currentChatId}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onChatSelect={handleSelectChat}
            onNewChat={() => setShowNewChatModal(true)}
            currentUserId={currentUserId}
          />
        )}
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <AnimatePresence mode="wait">
          {currentChat ? (
            <motion.div
              key={currentChat.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full flex flex-col"
            >
              {/* Header */}
              <ChatHeader
                chat={currentChat}
                onClose={() => setCurrentChatId(null)}
                onViewInfo={handleViewInfo}
                onPin={handlePin}
                onMute={handleMute}
                onArchive={handleArchive}
                onDelete={handleDelete}
                currentUserId={currentUserId}
              />

              <div className="px-6 py-2 border-b border-border flex items-center justify-end">
                <ConnectionIndicator 
                  status={isConnected ? 'connected' : 'disconnected'}
                />
              </div>

              <ChatWindow
                messages={currentMessages}
                currentUserId={currentUserId}
                onReact={handleReactToMessage}
                onReply={handleReplyToMessage}
                onEdit={handleEditMessage}
                onDelete={handleDeleteMessage}
                isLoading={isLoadingMessages}
              />

              <MessageInput
                onSendMessage={handleSendMessage}
                replyTo={replyTo}
                onCancelReply={() => setReplyTo(null)}
                chatName={currentChat ? getChatDisplayName(currentChat, currentUserId) : undefined}
                onTyping={(isTyping) => {
                  console.log('User is typing:', isTyping);
                }}
              />
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="h-full flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900"
            >
              <div className="text-center space-y-6 max-w-md px-6">
                <div className="relative">
                  <motion.div
                    animate={{
                      scale: [1, 1.05, 1],
                      rotate: [0, 5, -5, 0],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                    className="h-32 w-32 mx-auto rounded-3xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-2xl"
                  >
                    <MessageCircle className="h-16 w-16 text-white" />
                  </motion.div>
                  <motion.div
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.5, 1, 0.5],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                    className="absolute inset-0 h-32 w-32 mx-auto rounded-3xl bg-gradient-to-br from-blue-500 to-purple-600 blur-xl -z-10"
                  />
                </div>

                <div className="space-y-3">
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Chat Interno
                  </h2>
                  <p className="text-muted-foreground">
                    Selecione uma conversa para começar ou crie uma nova
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowNewChatModal(true)}
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium shadow-lg hover:shadow-xl transition-all"
                  >
                    Nova Conversa
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <NewChannelModal
        open={showNewChatModal}
        onClose={() => setShowNewChatModal(false)}
        onCreate={handleCreateChat}
        users={modalUsers}
        currentUserId={currentUserId}
      />

      <ThreadView
        open={showThreadView}
        onClose={() => setShowThreadView(false)}
        parentMessage={threadMessage}
        replies={[]}
        currentUserId={currentUserId}
        onSendReply={(_content) => {
          // TODO: Implementar envio de resposta
        }}
        onReact={handleReactToMessage}
        onEdit={handleEditMessage}
        onDelete={handleDeleteMessage}
      />

      <MediaModal
        open={showMediaModal}
        onClose={() => setShowMediaModal(false)}
        media={selectedMedia}
      />
    </div>
  );
}

