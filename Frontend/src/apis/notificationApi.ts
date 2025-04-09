import axios from 'axios';

export enum NotificationType {
  FOLLOW = 'follow',
  LIKE = 'like',
  NEW_POST = 'new_post',
  UNFOLLOW = 'unfollow',
  COMMENT = 'comment',
  MENTION = 'mention',
  GROUP_INVITE = 'group_invite',
  GROUP_JOIN = 'group_join'
}

export enum NotificationScope {
  SINGLE = 'single',
  FOLLOWERS = 'followers'
}

export interface User {
  _id: string;
  name: string;
  profileImg?: string;
  email?: string;
}

export interface Notification {
  _id: string;
  recipients: User[];
  sender: User;
  type: NotificationType;
  scope: NotificationScope;
  content: string;
  read: boolean;
  entityId?: string;
  entityType?: string;
  createdAt: string;
}

interface PaginatedResponse<T> {
  notifications: T[];
  page: number;
  totalPages: number;
  total: number;
}

const BASE_URL = `${import.meta.env.VITE_API_URL}/notifications`;

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const notificationApi = {
  // Get notifications for a user with pagination
  getNotifications: async (
    userId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<PaginatedResponse<Notification>> => {
    try {
      const response = await api.get('/', {
        params: { userId, page, limit },
      });
      return response.data;
    } catch (error) {
      console.error('Error in getNotifications:', error);
      throw error;
    }
  },

  // Get unread notification count
  getUnreadCount: async (userId: string): Promise<number> => {
    try {
      const response = await api.get('/unread/count', {
        params: { userId },
      });
      return response.data.count;
    } catch (error) {
      console.error('Error in getUnreadCount:', error);
      throw error;
    }
  },

  // Create a new notification
  createNotification: async (data: {
    recipientId: string | string[];
    senderId: string;
    type: NotificationType;
    content: string;
    entityId?: string;
    entityType?: string;
  }): Promise<Notification> => {
    try {
      console.log('Creating notification with data:', data);
      // Convert single recipientId to array if needed
      const recipients = Array.isArray(data.recipientId) ? data.recipientId : [data.recipientId];
      
      const notificationData = {
        ...data,
        recipients: recipients.map((recipientId) => ({ _id: recipientId })),
        scope: recipients.length > 1 ? NotificationScope.FOLLOWERS : NotificationScope.SINGLE
      };
      
      const response = await api.post('', notificationData);
      console.log('Create notification response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error in createNotification:', error);
      throw error;
    }
  },

  // Mark a notification as read
  markAsRead: async (notificationId: string): Promise<Notification> => {
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        throw new Error('User ID not found');
      }
      const response = await api.post(`/${notificationId}/read`, { userId });
      return response.data;
    } catch (error) {
      console.error('Error in markAsRead:', error);
      throw error;
    }
  },

  // Mark all notifications as read
  markAllAsRead: async (userId: string): Promise<void> => {
    try {
      await api.post('/read/all', { userId });
    } catch (error) {
      console.error('Error in markAllAsRead:', error);
      throw error;
    }
  },

  // Delete a notification
  deleteNotification: async (notificationId: string): Promise<void> => {
    try {
      await api.delete(`/${notificationId}`);
    } catch (error) {
      console.error('Error in deleteNotification:', error);
      throw error;
    }
  },
};