import { IChat } from '@/types/chat';

type ChatParticipant = {
  userId: string;
  user?: {
    firstName?: string;
    lastName?: string;
    email?: string;
    avatar?: string;
  };
};

type ChatData = IChat & {
  data?: IChat;
  participants?: ChatParticipant[];
};

const extractChatData = (chat: ChatData): IChat => (chat as any).data || chat;

const getFullName = (firstName = '', lastName = ''): string => 
  `${firstName} ${lastName}`.trim();

const findOtherParticipant = (participants: ChatParticipant[], userId: string) => 
  participants.find(p => p.userId !== userId);

const findParticipantWithName = (participants: ChatParticipant[]) =>
  participants.find(p => p.user?.firstName || p.user?.lastName);

const findParticipantWithEmail = (participants: ChatParticipant[], userId?: string) =>
  participants.find(p => p.user?.email && (!userId || p.userId !== userId));

const getParticipantName = (participant?: ChatParticipant): string | null => {
  if (!participant?.user) return null;
  
  const fullName = getFullName(participant.user.firstName, participant.user.lastName);
  return fullName || participant.user.email || null;
};

const getDirectChatName = (participants: ChatParticipant[], currentUserId: string): string => {
  const otherParticipant = findOtherParticipant(participants, currentUserId);
  const otherName = getParticipantName(otherParticipant);
  if (otherName) return otherName;

  const participantWithName = findParticipantWithName(participants);
  const anyName = getParticipantName(participantWithName);
  if (anyName) return anyName;

  const participantWithEmail = findParticipantWithEmail(participants, currentUserId);
  if (participantWithEmail?.user?.email) return participantWithEmail.user.email;

  const anyParticipantWithEmail = findParticipantWithEmail(participants);
  return anyParticipantWithEmail?.user?.email || 'Conversa';
};

export const getChatDisplayName = (chat: ChatData, currentUserId: string): string => {
  const chatData = extractChatData(chat);
  
  if (chatData.isGroup) {
    return chatData.name?.trim() || `Grupo (${chatData.participants?.length || 0} membros)`;
  }
  
  if (!chatData.participants?.length) return 'Conversa';
  
  return getDirectChatName(chatData.participants, currentUserId);
};

export const getChatDisplayAvatar = (chat: ChatData, currentUserId: string): string | undefined => {
  const chatData = extractChatData(chat);
  
  if (chatData.isGroup || !chatData.participants) return undefined;

  const otherParticipant = findOtherParticipant(chatData.participants, currentUserId);
  if (otherParticipant?.user?.avatar) return otherParticipant.user.avatar;

  const participantWithAvatar = chatData.participants.find(p => p.user?.avatar);
  return participantWithAvatar?.user?.avatar;
};
