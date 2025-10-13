// ============= Types para o sistema de chat interno =============

export type UserStatus = 'online' | 'offline' | 'away' | 'in_meeting';

export type MessageStatus = 'sending' | 'sent' | 'delivered' | 'read';

export type ChannelType = 'direct' | 'group' | 'public' | 'private';

export interface Reaction {
  emoji: string;
  users: string[]; // IDs dos usuários que reagiram
  count: number;
}

export interface MessageAttachment {
  id: string;
  name: string;
  url: string;
  type: 'image' | 'video' | 'audio' | 'file';
  size: number;
  thumbnail?: string;
}

export interface LinkPreview {
  url: string;
  title: string;
  description?: string;
  image?: string;
  siteName?: string;
}

export interface Message {
  id: string;
  content: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  channelId: string;
  timestamp: Date;
  status: MessageStatus;
  edited?: boolean;
  editedAt?: Date;
  reactions: Reaction[];
  attachments: MessageAttachment[];
  linkPreview?: LinkPreview;
  replyTo?: {
    id: string;
    content: string;
    senderName: string;
  };
  isPinned?: boolean;
  scheduledFor?: Date;
}

export interface Channel {
  id: string;
  name: string;
  type: ChannelType;
  description?: string;
  avatar?: string;
  color?: string;
  icon?: string;
  memberIds: string[];
  createdBy: string;
  createdAt: Date;
  lastMessage?: Message;
  unreadCount: number;
  isPinned?: boolean;
  isMuted?: boolean;
  isArchived?: boolean;
}

export interface Collaborator {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role?: string;
  department?: string;
  status: UserStatus;
  lastSeen?: Date;
  customStatus?: string;
}

export interface TypingIndicator {
  channelId: string;
  userId: string;
  userName: string;
}

export interface ChatNotification {
  id: string;
  channelId: string;
  message: Message;
  read: boolean;
}

// Estado do chat
export interface ChatState {
  channels: Channel[];
  messages: Record<string, Message[]>; // channelId -> messages
  collaborators: Collaborator[];
  currentChannelId: string | null;
  currentUser: Collaborator | null;
  typingIndicators: TypingIndicator[];
  notifications: ChatNotification[];
  searchQuery: string;
  showThreadView: boolean;
  threadMessage: Message | null;
}

// Ações do chat
export type ChatAction =
  | { type: 'SET_CHANNELS'; payload: Channel[] }
  | { type: 'SET_MESSAGES'; payload: { channelId: string; messages: Message[] } }
  | { type: 'ADD_MESSAGE'; payload: Message }
  | { type: 'UPDATE_MESSAGE'; payload: Message }
  | { type: 'DELETE_MESSAGE'; payload: { channelId: string; messageId: string } }
  | { type: 'SET_CURRENT_CHANNEL'; payload: string | null }
  | { type: 'SET_COLLABORATORS'; payload: Collaborator[] }
  | { type: 'UPDATE_COLLABORATOR_STATUS'; payload: { id: string; status: UserStatus } }
  | { type: 'ADD_REACTION'; payload: { messageId: string; channelId: string; emoji: string; userId: string } }
  | { type: 'REMOVE_REACTION'; payload: { messageId: string; channelId: string; emoji: string; userId: string } }
  | { type: 'SET_TYPING'; payload: TypingIndicator }
  | { type: 'REMOVE_TYPING'; payload: { channelId: string; userId: string } }
  | { type: 'SET_SEARCH_QUERY'; payload: string }
  | { type: 'TOGGLE_THREAD_VIEW'; payload: Message | null }
  | { type: 'PIN_CHANNEL'; payload: string }
  | { type: 'MUTE_CHANNEL'; payload: string }
  | { type: 'ARCHIVE_CHANNEL'; payload: string }
  | { type: 'MARK_AS_READ'; payload: string };

