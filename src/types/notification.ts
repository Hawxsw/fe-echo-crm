export enum NotificationType {
  MESSAGE = 'MESSAGE',
  TASK_ASSIGNED = 'TASK_ASSIGNED',
  TASK_COMMENT = 'TASK_COMMENT',
  TASK_DUE_SOON = 'TASK_DUE_SOON',
  WHATSAPP_MESSAGE = 'WHATSAPP_MESSAGE',
  SALES_ASSIGNED = 'SALES_ASSIGNED',
  SALES_COMMENT = 'SALES_COMMENT',
  MENTION = 'MENTION',
  SYSTEM = 'SYSTEM',
}

export interface INotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  userId: string;
  isRead: boolean;
  metadata?: any;
  actionUrl?: string;
  createdAt: string;
  readAt?: string | null;
}

export interface ICreateNotification {
  type: NotificationType;
  title: string;
  message: string;
  userId: string;
  metadata?: any;
  actionUrl?: string;
}

export interface IMarkAsReadDto {
  notificationIds: string[];
}

export interface IMarkAllAsReadDto {
  userId: string;
}

export interface INotificationCount {
  count: number;
}

