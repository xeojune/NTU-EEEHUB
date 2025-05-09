import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { notificationApi, Notification } from '../apis/notificationApi';

interface NotificationContextType {
  unreadCount: number;
  setUnreadCount: (count: number) => void;
  updateUnreadCount: () => Promise<void>;
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [unreadCount, setUnreadCount] = useState(0);
  const userId = localStorage.getItem('userId');

  const updateUnreadCount = async () => {
    try {
      if (!userId) return;
      const count = await notificationApi.getUnreadCount(userId);
      setUnreadCount(count);
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      await notificationApi.markAsRead(notificationId);
      // Update unread count after marking as read
      updateUnreadCount();
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  };

  const markAllAsRead = async () => {
    try {
      if (!userId) return;
      await notificationApi.markAllAsRead(userId);
      // Set unread count to 0 after marking all as read
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  };

  useEffect(() => {
    // Initial fetch of unread count
    updateUnreadCount();

    // Set up polling interval for unread count
    const interval = setInterval(updateUnreadCount, 60000); // Update every minute
    return () => clearInterval(interval);
  }, [userId]);

  return (
    <NotificationContext.Provider
      value={{
        unreadCount,
        setUnreadCount,
        updateUnreadCount,
        markAsRead,
        markAllAsRead,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};