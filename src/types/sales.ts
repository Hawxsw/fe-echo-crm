// ============ Sales Pipeline Types ============

export interface ISalesPipeline {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  stages: ISalesStage[];
}

export interface ISalesStage {
  id: string;
  name: string;
  description?: string;
  position: number;
  color: string;
  pipelineId: string;
  createdAt: string;
  updatedAt: string;
  opportunities: ISalesOpportunity[];
}

export interface ISalesOpportunity {
  id: string;
  title: string;
  description?: string;
  company: string;
  contact: string;
  email?: string;
  phone?: string;
  value: number;
  stageId: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  createdById: string;
  assignedToId?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  stage?: ISalesStage;
  createdBy?: {
    id: string;
    firstName: string;
    lastName: string;
    avatar?: string;
  };
  assignedTo?: {
    id: string;
    firstName: string;
    lastName: string;
    avatar?: string;
  };
  comments?: ISalesComment[];
  activities?: ISalesActivity[];
}

export interface ISalesComment {
  id: string;
  content: string;
  isPinned: boolean;
  opportunityId: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    avatar?: string;
  };
}

export interface ISalesActivity {
  id: string;
  type: 'CALL' | 'EMAIL' | 'MEETING' | 'TASK' | 'NOTE';
  title: string;
  description?: string;
  scheduledDate: string;
  scheduledTime: string;
  completedDate?: string;
  completedTime?: string;
  status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';
  opportunityId: string;
  assignedToId: string;
  createdAt: string;
  updatedAt: string;
  assignedTo: {
    id: string;
    firstName: string;
    lastName: string;
    avatar?: string;
  };
}

// ============ Create/Update DTOs ============

export interface ICreatePipeline {
  name: string;
  description?: string;
}

export interface IUpdatePipeline {
  name?: string;
  description?: string;
  isActive?: boolean;
}

export interface ICreateStage {
  name: string;
  description?: string;
  position: number;
  color?: string;
}

export interface IUpdateStage {
  name?: string;
  description?: string;
  position?: number;
  color?: string;
}

export interface IMoveStage {
  newPosition: number;
}

export interface ICreateOpportunity {
  title: string;
  description?: string;
  company: string;
  contact: string;
  email?: string;
  phone?: string;
  value?: number;
  stageId: string;
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  assignedToId?: string;
  tags?: string[];
}

export interface IUpdateOpportunity {
  title?: string;
  description?: string;
  company?: string;
  contact?: string;
  email?: string;
  phone?: string;
  value?: number;
  stageId?: string;
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  assignedToId?: string;
  tags?: string[];
}

export interface IMoveOpportunity {
  stageId: string;
  position?: number;
}

export interface ICreateComment {
  content: string;
  isPinned?: boolean;
}

export interface IUpdateComment {
  content?: string;
  isPinned?: boolean;
}

export interface ICreateActivity {
  type: 'CALL' | 'EMAIL' | 'MEETING' | 'TASK' | 'NOTE';
  title: string;
  description?: string;
  scheduledDate: string;
  scheduledTime: string;
  assignedToId: string;
}

export interface IUpdateActivity {
  type?: 'CALL' | 'EMAIL' | 'MEETING' | 'TASK' | 'NOTE';
  title?: string;
  description?: string;
  scheduledDate?: string;
  scheduledTime?: string;
  status?: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';
  completedDate?: string;
  completedTime?: string;
}
