export interface IWhatsAppConversation {
  id: string;
  clientName: string;
  clientPhone: string;
  assignedToId?: string;
  companyId: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  assignedTo?: {
    id: string;
    firstName: string;
    lastName: string;
    avatar?: string;
  };
  messages?: IWhatsAppMessage[];
}

export interface IWhatsAppMessage {
  id: string;
  content: string;
  conversationId: string;
  isFromClient: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ICreateConversation {
  clientName: string;
  clientPhone: string;
  assignedToId?: string;
}

export interface IUpdateConversation {
  clientName?: string;
  assignedToId?: string;
  isActive?: boolean;
}

export interface ISendWhatsAppMessage {
  conversationId: string;
  content: string;
  isFromClient?: boolean;
}

