export interface IChat {
  id: string;
  name?: string;
  isGroup: boolean;
  companyId: string;
  createdAt: string;
  updatedAt: string;
  participants?: IParticipant[];
  messages?: IMessage[];
}

export interface IParticipant {
  id: string;
  userId: string;
  chatId: string;
  joinedAt: string;
  user?: {
    id: string;
    firstName: string;
    lastName: string;
    avatar?: string;
  };
}

export interface IMessage {
  id: string;
  content: string;
  chatId: string;
  senderId: string;
  createdAt: string;
  updatedAt: string;
  isEdited: boolean;
  sender?: {
    id: string;
    firstName: string;
    lastName: string;
    avatar?: string;
  };
}

export interface ICreateChat {
  name?: string;
  isGroup?: boolean;
  participantIds: string[];
}

export interface ISendMessage {
  content: string;
  chatId: string;
}

export interface IUpdateMessage {
  content: string;
}

