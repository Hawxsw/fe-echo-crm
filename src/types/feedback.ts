// Feedback Types
export type FeedbackType = 'SUGGESTION' | 'BUG' | 'COMPLIMENT' | 'COMPLAINT';
export type FeedbackCategory = 'UI' | 'PERFORMANCE' | 'FEATURE' | 'INTEGRATION' | 'DOCUMENTATION' | 'OTHER';
export type FeedbackPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type FeedbackStatus = 'UNDER_REVIEW' | 'PLANNED' | 'IN_PROGRESS' | 'FIXED' | 'ACKNOWLEDGED';

export interface ICreateFeedback {
  type: FeedbackType;
  category: FeedbackCategory;
  title: string;
  description: string;
  rating: number;
  priority?: FeedbackPriority;
  isAnonymous?: boolean;
}

export interface IUpdateFeedback {
  status?: FeedbackStatus;
  title?: string;
  description?: string;
  rating?: number;
  priority?: FeedbackPriority;
}

export interface IFeedback {
  id: string;
  type: string;
  category: string;
  title: string;
  description: string;
  rating: number;
  priority: string;
  status: string;
  isAnonymous: boolean;
  userId: string;
  createdAt: string;
  updatedAt: string;
  votesCount?: number;
  hasVoted?: boolean;
}

export interface IFeedbackStats {
  total: number;
  thisMonth: number;
  averageRating: number;
  byType: Record<string, number>;
  byStatus: Record<string, number>;
}

export interface IFeedbackListResponse {
  data: IFeedback[];
  total: number;
  page: number;
  limit: number;
}

export interface IVoteResponse {
  votesCount: number;
  hasVoted: boolean;
}

