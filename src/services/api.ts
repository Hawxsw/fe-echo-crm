import axios, { AxiosInstance, AxiosError } from 'axios';
import { AuthService } from './clients/auth.service';
import { DepartmentService } from './clients/department.service';
import { UsersService } from './clients/users.service';
import { ChatService } from './clients/chat.service';
import { MessageService } from './clients/message.service';
import { BoardService } from './clients/board.service';
import { ColumnService } from './clients/column.service';
import { CardService } from './clients/card.service';
import { CommentService } from './clients/comment.service';
import { RolesService } from './clients/roles.service';
import { ConversationService } from './clients/conversation.service';
import { WhatsAppMessageService } from './clients/whatsapp-message.service';
import { SalesService } from './clients/sales.service';
import { FeedbackService } from './clients/feedback.service';
import { SettingsService } from './clients/settings.service';
import { SupportService } from './clients/support.service';
import { notificationsClient } from './clients/notifications.client';
import { clearAuthStorage, getToken } from '@/utils/storage';

export interface IPaginationResponse<D> {
  count: number;
  page: number;
  data: D;
}

export interface IPaginationDefaultParams {
  pageSize: number;
  page: number;
}

export class ApiService {
  public api: AxiosInstance;

  private API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

  constructor(logout?: () => void) {
    const api = axios.create({
      baseURL: this.API_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    api.interceptors.request.use(
      (config) => {
        const token = getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    api.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          clearAuthStorage();
          logout ? logout() : (window.location.href = '/login');
        }
        
        return Promise.reject(error);
      }
    );

    this.auth = new AuthService(api);
    this.department = new DepartmentService(api);
    this.users = new UsersService(api);
    this.chat = new ChatService(api);
    this.message = new MessageService(api);
    this.board = new BoardService(api);
    this.column = new ColumnService(api);
    this.card = new CardService(api);
    this.comment = new CommentService(api);
    this.roles = new RolesService(api);
    this.conversation = new ConversationService(api);
    this.whatsappMessage = new WhatsAppMessageService(api);
    this.sales = new SalesService(api);
    this.feedback = new FeedbackService(api);
    this.settings = new SettingsService(api);
    this.support = new SupportService(api);
    this.notifications = notificationsClient(api);

    this.api = api;
  }

  readonly auth
  readonly department
  readonly users
  readonly chat
  readonly message
  readonly board
  readonly column
  readonly card
  readonly comment
  readonly roles
  readonly conversation
  readonly whatsappMessage
  readonly sales
  readonly feedback
  readonly settings
  readonly support
  readonly notifications
}