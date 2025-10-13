import { INotification, ICreateNotification, IMarkAsReadDto } from '../../types/notification';

export const notificationsClient = (instance: any) => ({
  getAll: async (): Promise<INotification[]> => {
    try {
      const response = await instance.get('/notifications');
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error('Error fetching notifications:', error);
      return [];
    }
  },

  getUnread: async (): Promise<INotification[]> => {
    try {
      const response = await instance.get('/notifications/unread');
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error('Error fetching unread notifications:', error);
      return [];
    }
  },

  getUnreadCount: async (): Promise<number> => {
    try {
      const response = await instance.get('/notifications/unread/count');
      return typeof response.data === 'number' ? response.data : 0;
    } catch (error) {
      console.error('Error fetching unread count:', error);
      return 0;
    }
  },

  create: async (data: ICreateNotification): Promise<INotification> => {
    const response = await instance.post('/notifications', data);
    return response.data;
  },

  markAsRead: async (data: IMarkAsReadDto): Promise<{ success: boolean; count: number }> => {
    const response = await instance.patch('/notifications/mark-read', data);
    return response.data;
  },

  markAllAsRead: async (): Promise<{ success: boolean; count: number }> => {
    const response = await instance.patch('/notifications/mark-all-read');
    return response.data;
  },

  delete: async (id: string): Promise<{ success: boolean }> => {
    const response = await instance.delete(`/notifications/${id}`);
    return response.data;
  },

  deleteAll: async (): Promise<{ success: boolean; count: number }> => {
    const response = await instance.delete('/notifications');
    return response.data;
  },
});

