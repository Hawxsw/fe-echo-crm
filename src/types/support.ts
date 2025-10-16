export type TicketCategory = 'TECHNICAL' | 'BILLING' | 'FEATURE' | 'OTHER';
export type TicketPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type TicketStatus = 'OPEN' | 'IN_PROGRESS' | 'CLOSED';

export interface ICreateTicket {
  subject: string;
  description: string;
  category: TicketCategory;
  priority?: TicketPriority;
}

export interface IUpdateTicket {
  subject?: string;
  description?: string;
  category?: TicketCategory;
  priority?: TicketPriority;
  status?: TicketStatus;
  assignedTo?: string;
}

export interface ITicket {
  id: string;
  subject: string;
  description: string;
  category: string;
  priority: string;
  status: string;
  userId: string;
  assignedTo: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ITicketListResponse {
  data: ITicket[];
  total: number;
  page: number;
  limit: number;
}

export interface ICreateFAQ {
  question: string;
  answer: string;
  category: string;
  position?: number;
  isActive?: boolean;
}

export interface IUpdateFAQ {
  question?: string;
  answer?: string;
  category?: string;
  position?: number;
  isActive?: boolean;
}

export interface IFAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  views: number;
  isActive: boolean;
  position: number;
  createdAt: string;
  updatedAt: string;
}

export interface IFAQListResponse {
  data: IFAQ[];
  total: number;
  page: number;
  limit: number;
}

export interface IFAQCategories {
  categories: string[];
}
