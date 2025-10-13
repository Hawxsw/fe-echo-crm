// =============== Board Types ===============

export interface IBoard {
  id: string;
  name: string;
  description?: string;
  companyId: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  columns?: IColumn[];
}

export interface ICreateBoard {
  name: string;
  description?: string;
}

export interface IUpdateBoard {
  name?: string;
  description?: string;
  isActive?: boolean;
}

// =============== Column Types ===============

export interface IColumn {
  id: string;
  name: string;
  position: number;
  color?: string;
  limit?: number;
  description?: string;
  boardId: string;
  createdAt: string;
  updatedAt: string;
  cards?: ICard[];
}

export interface ICreateColumn {
  name: string;
  position: number;
  color?: string;
  limit?: number;
  description?: string;
}

export interface IUpdateColumn {
  name?: string;
  position?: number;
  color?: string;
  limit?: number;
  description?: string;
}

export interface IMoveColumn {
  newPosition: number;
}

// =============== Card Types ===============

export type CardPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export interface ICard {
  id: string;
  title: string;
  description?: string;
  position: number;
  priority: CardPriority;
  dueDate?: string;
  columnId: string;
  assignedToId?: string;
  createdById: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  assignedTo?: {
    id: string;
    firstName: string;
    lastName: string;
    avatar?: string;
  };
  comments?: IComment[];
}

export interface ICreateCard {
  title: string;
  description?: string;
  position: number;
  priority?: CardPriority;
  dueDate?: string;
  assignedToId?: string;
  tags?: string[];
}

export interface IUpdateCard {
  title?: string;
  description?: string;
  position?: number;
  priority?: CardPriority;
  dueDate?: string;
  assignedToId?: string;
  tags?: string[];
}

export interface IMoveCard {
  targetColumnId: string;
  newPosition: number;
}

// =============== Comment Types ===============

export interface IComment {
  id: string;
  content: string;
  cardId: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    firstName: string;
    lastName: string;
    avatar?: string;
  };
}

export interface ICreateComment {
  content: string;
}

export interface IUpdateComment {
  content: string;
}

