import { useReducer, useCallback } from 'react';
import {
  Channel,
  Collaborator,
  Message,
  ChatState,
  ChatAction,
  MessageAttachment,
} from '@/types/internal-chat';

// ============= Mock Data =============
const mockCollaborators: Collaborator[] = [
  {
    id: '1',
    name: 'João Silva',
    email: 'joao@empresa.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=joao',
    role: 'Gerente de Vendas',
    department: 'Vendas',
    status: 'online',
  },
  {
    id: '2',
    name: 'Maria Santos',
    email: 'maria@empresa.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=maria',
    role: 'Desenvolvedora',
    department: 'TI',
    status: 'online',
  },
  {
    id: '3',
    name: 'Carlos Oliveira',
    email: 'carlos@empresa.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=carlos',
    role: 'Designer',
    department: 'Marketing',
    status: 'away',
    customStatus: 'Em reunião',
  },
  {
    id: '4',
    name: 'Ana Costa',
    email: 'ana@empresa.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ana',
    role: 'Analista de Marketing',
    department: 'Marketing',
    status: 'offline',
    lastSeen: new Date(Date.now() - 1000 * 60 * 15), // 15 min ago
  },
  {
    id: '5',
    name: 'Pedro Almeida',
    email: 'pedro@empresa.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=pedro',
    role: 'CTO',
    department: 'TI',
    status: 'in_meeting',
  },
];

const mockChannels: Channel[] = [
  {
    id: 'dm-1',
    name: 'João Silva',
    type: 'direct',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=joao',
    memberIds: ['current-user', '1'],
    createdBy: 'current-user',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
    unreadCount: 2,
    isPinned: true,
  },
  {
    id: 'dm-2',
    name: 'Maria Santos',
    type: 'direct',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=maria',
    memberIds: ['current-user', '2'],
    createdBy: 'current-user',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
    unreadCount: 0,
  },
  {
    id: 'channel-marketing',
    name: 'marketing',
    type: 'public',
    description: 'Discussões sobre estratégias de marketing',
    color: '#F59E0B',
    icon: '📢',
    memberIds: ['current-user', '3', '4'],
    createdBy: '3',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30),
    unreadCount: 5,
  },
  {
    id: 'channel-vendas',
    name: 'vendas',
    type: 'public',
    description: 'Time de vendas',
    color: '#10B981',
    icon: '💰',
    memberIds: ['current-user', '1'],
    createdBy: '1',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 45),
    unreadCount: 0,
    isPinned: true,
  },
  {
    id: 'channel-dev',
    name: 'dev',
    type: 'private',
    description: 'Time de desenvolvimento',
    color: '#3B82F6',
    icon: '💻',
    memberIds: ['current-user', '2', '5'],
    createdBy: '5',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 60),
    unreadCount: 0,
  },
];

const mockMessages: Record<string, Message[]> = {
  'dm-1': [
    {
      id: 'msg-1',
      content: 'Oi! Tudo bem? Conseguiu ver a proposta que enviei?',
      senderId: '1',
      senderName: 'João Silva',
      senderAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=joao',
      channelId: 'dm-1',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
      status: 'read',
      reactions: [],
      attachments: [],
    },
    {
      id: 'msg-2',
      content: 'Sim! Ficou ótima. Só preciso fazer alguns ajustes no valor.',
      senderId: 'current-user',
      senderName: 'Você',
      channelId: 'dm-1',
      timestamp: new Date(Date.now() - 1000 * 60 * 60),
      status: 'read',
      reactions: [
        { emoji: '👍', users: ['1'], count: 1 },
      ],
      attachments: [],
    },
    {
      id: 'msg-3',
      content: 'Perfeito! Quando puder, me avisa. Preciso enviar até sexta.',
      senderId: '1',
      senderName: 'João Silva',
      senderAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=joao',
      channelId: 'dm-1',
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      status: 'delivered',
      reactions: [],
      attachments: [],
    },
  ],
  'dm-2': [
    {
      id: 'msg-4',
      content: 'Conseguiu resolver aquele bug do formulário?',
      senderId: 'current-user',
      senderName: 'Você',
      channelId: 'dm-2',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5),
      status: 'read',
      reactions: [],
      attachments: [],
    },
    {
      id: 'msg-5',
      content: 'Sim! Era só um problema de validação. Já está no ar.',
      senderId: '2',
      senderName: 'Maria Santos',
      senderAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=maria',
      channelId: 'dm-2',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4),
      status: 'read',
      reactions: [
        { emoji: '🎉', users: ['current-user'], count: 1 },
      ],
      attachments: [],
    },
  ],
  'channel-marketing': [
    {
      id: 'msg-6',
      content: 'Pessoal, vamos discutir a nova campanha de Black Friday?',
      senderId: '3',
      senderName: 'Carlos Oliveira',
      senderAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=carlos',
      channelId: 'channel-marketing',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6),
      status: 'read',
      reactions: [
        { emoji: '🔥', users: ['current-user', '4'], count: 2 },
      ],
      attachments: [],
    },
    {
      id: 'msg-7',
      content: 'Boa! Preparei alguns materiais. Segue o link:',
      senderId: '4',
      senderName: 'Ana Costa',
      senderAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ana',
      channelId: 'channel-marketing',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5),
      status: 'read',
      reactions: [],
      attachments: [
        {
          id: 'att-1',
          name: 'Campanha_BlackFriday_2024.pdf',
          url: '#',
          type: 'file',
          size: 2048000,
        },
      ],
      linkPreview: {
        url: 'https://www.figma.com/file/exemplo',
        title: 'Campanha Black Friday 2024 - Figma',
        description: 'Designs e materiais para a campanha',
        image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=400',
        siteName: 'Figma',
      },
    },
    {
      id: 'msg-8',
      content: 'Excelente trabalho, Ana! Adorei as cores. 🎨',
      senderId: '3',
      senderName: 'Carlos Oliveira',
      senderAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=carlos',
      channelId: 'channel-marketing',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4),
      status: 'read',
      reactions: [
        { emoji: '❤️', users: ['4'], count: 1 },
      ],
      attachments: [],
    },
  ],
  'channel-dev': [
    {
      id: 'msg-9',
      content: 'Alguém pode revisar o PR #342?',
      senderId: '2',
      senderName: 'Maria Santos',
      senderAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=maria',
      channelId: 'channel-dev',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3),
      status: 'read',
      reactions: [],
      attachments: [],
    },
    {
      id: 'msg-10',
      content: '```typescript\nconst handleSubmit = async (data: FormData) => {\n  try {\n    await api.post("/submit", data);\n  } catch (error) {\n    console.error(error);\n  }\n};\n```\nIsso resolve o problema?',
      senderId: 'current-user',
      senderName: 'Você',
      channelId: 'channel-dev',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
      status: 'read',
      reactions: [
        { emoji: '✅', users: ['2', '5'], count: 2 },
      ],
      attachments: [],
    },
  ],
};

// Usuário atual (mock)
const currentUser: Collaborator = {
  id: 'current-user',
  name: 'Você',
  email: 'voce@empresa.com',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=current',
  role: 'Product Manager',
  department: 'Produto',
  status: 'online',
};

// ============= Reducer =============
const chatReducer = (state: ChatState, action: ChatAction): ChatState => {
  switch (action.type) {
    case 'SET_CHANNELS':
      return { ...state, channels: action.payload };

    case 'SET_MESSAGES':
      return {
        ...state,
        messages: {
          ...state.messages,
          [action.payload.channelId]: action.payload.messages,
        },
      };

    case 'ADD_MESSAGE':
      const channelId = action.payload.channelId;
      const currentMessages = state.messages[channelId] || [];
      
      // Atualizar última mensagem do canal
      const updatedChannels = state.channels.map(channel => 
        channel.id === channelId 
          ? { ...channel, lastMessage: action.payload, unreadCount: 0 }
          : channel
      );

      return {
        ...state,
        channels: updatedChannels,
        messages: {
          ...state.messages,
          [channelId]: [...currentMessages, action.payload],
        },
      };

    case 'UPDATE_MESSAGE':
      const targetChannelId = action.payload.channelId;
      const messagesInChannel = state.messages[targetChannelId] || [];
      
      return {
        ...state,
        messages: {
          ...state.messages,
          [targetChannelId]: messagesInChannel.map(msg =>
            msg.id === action.payload.id ? action.payload : msg
          ),
        },
      };

    case 'DELETE_MESSAGE':
      const { channelId: delChannelId, messageId } = action.payload;
      const remainingMessages = (state.messages[delChannelId] || []).filter(
        msg => msg.id !== messageId
      );
      
      return {
        ...state,
        messages: {
          ...state.messages,
          [delChannelId]: remainingMessages,
        },
      };

    case 'SET_CURRENT_CHANNEL':
      // Marcar como lido ao abrir canal
      const channelsWithRead = state.channels.map(channel =>
        channel.id === action.payload
          ? { ...channel, unreadCount: 0 }
          : channel
      );
      
      return {
        ...state,
        currentChannelId: action.payload,
        channels: channelsWithRead,
      };

    case 'SET_COLLABORATORS':
      return { ...state, collaborators: action.payload };

    case 'UPDATE_COLLABORATOR_STATUS':
      return {
        ...state,
        collaborators: state.collaborators.map(collab =>
          collab.id === action.payload.id
            ? { ...collab, status: action.payload.status }
            : collab
        ),
      };

    case 'ADD_REACTION':
      const { messageId: reactionMsgId, channelId: reactionChannelId, emoji, userId } = action.payload;
      const channelMessages = state.messages[reactionChannelId] || [];
      
      return {
        ...state,
        messages: {
          ...state.messages,
          [reactionChannelId]: channelMessages.map(msg => {
            if (msg.id !== reactionMsgId) return msg;
            
            const existingReaction = msg.reactions.find(r => r.emoji === emoji);
            
            if (existingReaction) {
              // Adicionar usuário à reação existente
              return {
                ...msg,
                reactions: msg.reactions.map(r =>
                  r.emoji === emoji
                    ? { ...r, users: [...r.users, userId], count: r.count + 1 }
                    : r
                ),
              };
            } else {
              // Criar nova reação
              return {
                ...msg,
                reactions: [...msg.reactions, { emoji, users: [userId], count: 1 }],
              };
            }
          }),
        },
      };

    case 'REMOVE_REACTION':
      const { messageId: removeReactionMsgId, channelId: removeReactionChannelId, emoji: removeEmoji, userId: removeUserId } = action.payload;
      const channelMsgs = state.messages[removeReactionChannelId] || [];
      
      return {
        ...state,
        messages: {
          ...state.messages,
          [removeReactionChannelId]: channelMsgs.map(msg => {
            if (msg.id !== removeReactionMsgId) return msg;
            
            return {
              ...msg,
              reactions: msg.reactions
                .map(r =>
                  r.emoji === removeEmoji
                    ? { ...r, users: r.users.filter(id => id !== removeUserId), count: r.count - 1 }
                    : r
                )
                .filter(r => r.count > 0),
            };
          }),
        },
      };

    case 'SET_TYPING':
      const existingTyping = state.typingIndicators.find(
        t => t.channelId === action.payload.channelId && t.userId === action.payload.userId
      );
      
      if (existingTyping) return state;
      
      return {
        ...state,
        typingIndicators: [...state.typingIndicators, action.payload],
      };

    case 'REMOVE_TYPING':
      return {
        ...state,
        typingIndicators: state.typingIndicators.filter(
          t => !(t.channelId === action.payload.channelId && t.userId === action.payload.userId)
        ),
      };

    case 'SET_SEARCH_QUERY':
      return { ...state, searchQuery: action.payload };

    case 'TOGGLE_THREAD_VIEW':
      return {
        ...state,
        showThreadView: !!action.payload,
        threadMessage: action.payload,
      };

    case 'PIN_CHANNEL':
      return {
        ...state,
        channels: state.channels.map(channel =>
          channel.id === action.payload
            ? { ...channel, isPinned: !channel.isPinned }
            : channel
        ),
      };

    case 'MUTE_CHANNEL':
      return {
        ...state,
        channels: state.channels.map(channel =>
          channel.id === action.payload
            ? { ...channel, isMuted: !channel.isMuted }
            : channel
        ),
      };

    case 'ARCHIVE_CHANNEL':
      return {
        ...state,
        channels: state.channels.map(channel =>
          channel.id === action.payload
            ? { ...channel, isArchived: !channel.isArchived }
            : channel
        ),
      };

    case 'MARK_AS_READ':
      return {
        ...state,
        channels: state.channels.map(channel =>
          channel.id === action.payload
            ? { ...channel, unreadCount: 0 }
            : channel
        ),
      };

    default:
      return state;
  }
};

// ============= Hook =============
export const useInternalChat = () => {
  const [state, dispatch] = useReducer(chatReducer, {
    channels: mockChannels,
    messages: mockMessages,
    collaborators: mockCollaborators,
    currentChannelId: null,
    currentUser,
    typingIndicators: [],
    notifications: [],
    searchQuery: '',
    showThreadView: false,
    threadMessage: null,
  });

  // Funções auxiliares
  const sendMessage = useCallback((content: string, attachments: MessageAttachment[] = []) => {
    if (!state.currentChannelId) return;

    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      content,
      senderId: 'current-user',
      senderName: 'Você',
      senderAvatar: currentUser.avatar,
      channelId: state.currentChannelId,
      timestamp: new Date(),
      status: 'sent',
      reactions: [],
      attachments,
    };

    dispatch({ type: 'ADD_MESSAGE', payload: newMessage });

    // Simular entrega após 1s
    setTimeout(() => {
      dispatch({
        type: 'UPDATE_MESSAGE',
        payload: { ...newMessage, status: 'delivered' },
      });
    }, 1000);
  }, [state.currentChannelId]);

  const editMessage = useCallback((messageId: string, newContent: string) => {
    if (!state.currentChannelId) return;

    const messages = state.messages[state.currentChannelId] || [];
    const message = messages.find(m => m.id === messageId);

    if (message && message.senderId === 'current-user') {
      dispatch({
        type: 'UPDATE_MESSAGE',
        payload: {
          ...message,
          content: newContent,
          edited: true,
          editedAt: new Date(),
        },
      });
    }
  }, [state.currentChannelId, state.messages]);

  const deleteMessage = useCallback((messageId: string) => {
    if (!state.currentChannelId) return;

    dispatch({
      type: 'DELETE_MESSAGE',
      payload: { channelId: state.currentChannelId, messageId },
    });
  }, [state.currentChannelId]);

  const reactToMessage = useCallback((messageId: string, emoji: string) => {
    if (!state.currentChannelId) return;

    const messages = state.messages[state.currentChannelId] || [];
    const message = messages.find(m => m.id === messageId);
    
    if (!message) return;

    const existingReaction = message.reactions.find(r => r.emoji === emoji);
    const userAlreadyReacted = existingReaction?.users.includes('current-user');

    if (userAlreadyReacted) {
      dispatch({
        type: 'REMOVE_REACTION',
        payload: {
          messageId,
          channelId: state.currentChannelId,
          emoji,
          userId: 'current-user',
        },
      });
    } else {
      dispatch({
        type: 'ADD_REACTION',
        payload: {
          messageId,
          channelId: state.currentChannelId,
          emoji,
          userId: 'current-user',
        },
      });
    }
  }, [state.currentChannelId, state.messages]);

  const setCurrentChannel = useCallback((channelId: string | null) => {
    dispatch({ type: 'SET_CURRENT_CHANNEL', payload: channelId });
  }, []);

  const createChannel = useCallback((channel: Omit<Channel, 'id' | 'createdAt' | 'unreadCount'>) => {
    const newChannel: Channel = {
      ...channel,
      id: `channel-${Date.now()}`,
      createdAt: new Date(),
      unreadCount: 0,
    };

    dispatch({
      type: 'SET_CHANNELS',
      payload: [...state.channels, newChannel],
    });

    return newChannel;
  }, [state.channels]);

  const toggleThreadView = useCallback((message: Message | null) => {
    dispatch({ type: 'TOGGLE_THREAD_VIEW', payload: message });
  }, []);

  const pinChannel = useCallback((channelId: string) => {
    dispatch({ type: 'PIN_CHANNEL', payload: channelId });
  }, []);

  const muteChannel = useCallback((channelId: string) => {
    dispatch({ type: 'MUTE_CHANNEL', payload: channelId });
  }, []);

  const archiveChannel = useCallback((channelId: string) => {
    dispatch({ type: 'ARCHIVE_CHANNEL', payload: channelId });
  }, []);

  // Filtrar canais baseado na busca
  const filteredChannels = state.channels.filter(channel =>
    channel.name.toLowerCase().includes(state.searchQuery.toLowerCase())
  );

  // Ordenar canais (fixados primeiro, depois por última mensagem)
  const sortedChannels = [...filteredChannels].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    
    const aTime = a.lastMessage?.timestamp.getTime() || a.createdAt.getTime();
    const bTime = b.lastMessage?.timestamp.getTime() || b.createdAt.getTime();
    
    return bTime - aTime;
  });

  const currentChannel = state.channels.find(c => c.id === state.currentChannelId);
  const currentMessages = state.currentChannelId ? state.messages[state.currentChannelId] || [] : [];

  return {
    // Estado
    channels: sortedChannels,
    collaborators: state.collaborators,
    currentChannel,
    currentMessages,
    currentUser,
    typingIndicators: state.typingIndicators,
    searchQuery: state.searchQuery,
    showThreadView: state.showThreadView,
    threadMessage: state.threadMessage,

    // Ações
    sendMessage,
    editMessage,
    deleteMessage,
    reactToMessage,
    setCurrentChannel,
    createChannel,
    toggleThreadView,
    pinChannel,
    muteChannel,
    archiveChannel,
    setSearchQuery: (query: string) => dispatch({ type: 'SET_SEARCH_QUERY', payload: query }),
    dispatch,
  };
};

