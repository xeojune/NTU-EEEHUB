import React, { useEffect, useState } from 'react';
import Layout from '../Layout';
import { notificationApi, Notification, NotificationType } from '../../apis/notificationApi';
import {
  NotificationContainer,
  NotificationItem,
  NotificationContent,
  NotificationTime,
  NotificationAvatar,
  NotificationText,
  EmptyState,
  LoadingSpinner,
  NotificationHeader,
  MarkAllReadButton
} from '../../styles/Notification/NotificationPageStyle';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import defaultAvatar from '../../assets/userImg/defaultAvatar.png';
import { useUser } from '../../context/UserContext';

const NotificationPage: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [avatarUrls, setAvatarUrls] = useState<{ [key: string]: string }>({});
  const { getUserAvatar } = useUser();

  const userId = localStorage.getItem('userId');

  const fetchNotifications = async () => {
    try {
      if (!userId) {
        console.error('No userId found in localStorage');
        return;
      }

      console.log('Fetching notifications for userId:', userId);
      const response = await notificationApi.getNotifications(userId, page);
      console.log('Notifications response:', response);

      if (response && response.notifications) {
        const newNotifications = response.notifications;
        
        // Fetch avatar URLs for new notifications
        const newAvatarUrls: { [key: string]: string } = {};
        await Promise.all(
          newNotifications.map(async (notification) => {
            if (notification.sender?._id) {  
              const avatarUrl = await getUserAvatar(notification.sender.name);
              newAvatarUrls[notification.sender._id] = avatarUrl;  
            }
          })
        );

        setAvatarUrls(prev => ({ ...prev, ...newAvatarUrls }));
        setNotifications(prev => 
          page === 1 ? newNotifications : [...prev, ...newNotifications]
        );
        setTotalPages(response.totalPages);
        setHasMore(page < response.totalPages);
      } else {
        console.error('Invalid response format:', response);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      toast.error('Failed to load notifications');
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('NotificationPage mounted, userId:', userId);
    fetchNotifications();
  }, [page, userId]);

  useEffect(() => {
    console.log('Current notifications:', notifications);
  }, [notifications]);

  const handleMarkAllAsRead = async () => {
    try {
      if (!userId) return;
      
      await notificationApi.markAllAsRead(userId);
      setNotifications(prev => 
        prev.map(notification => ({
          ...notification,
          read: true
        } as Notification))
      );
      toast.success('All notifications marked as read');
    } catch (error) {
      console.error('Error marking all as read:', error);
      toast.error('Failed to mark notifications as read');
    }
  };

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await notificationApi.markAsRead(notificationId);
      setNotifications(prev =>
        prev.map(notification =>
          notification._id === notificationId
            ? { ...notification, read: true } as Notification
            : notification
        )
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
      toast.error('Failed to mark notification as read');
    }
  };

  const handleLoadMore = () => {
    if (hasMore) {
      setPage(prev => prev + 1);
    }
  };

  const formatNotificationTime = (timestamp: string) => {
    return format(new Date(timestamp), 'MMM d, yyyy h:mm a');
  };

  if (loading) {
    return (
      <Layout>
        <NotificationContainer>
          <LoadingSpinner>Loading notifications...</LoadingSpinner>
        </NotificationContainer>
      </Layout>
    );
  }

  return (
    <Layout>
      <NotificationContainer>
        <NotificationHeader>
          <h1>Notifications ({notifications.length})</h1>
          {notifications.length > 0 && (
            <MarkAllReadButton onClick={handleMarkAllAsRead}>
              Mark all as read
            </MarkAllReadButton>
          )}
        </NotificationHeader>

        {notifications.length === 0 && !loading ? (
          <EmptyState>No notifications yet</EmptyState>
        ) : (
          <>
            {notifications.map((notification) => {
              console.log('Rendering notification:', notification);
              const avatarUrl = notification.sender?._id 
                ? avatarUrls[notification.sender._id] || defaultAvatar
                : defaultAvatar;
              
              return (
                <NotificationItem
                  key={notification._id}
                  unread={!notification.read}
                  onClick={() => !notification.read && handleMarkAsRead(notification._id)}
                >
                  <NotificationAvatar 
                    src={avatarUrl} 
                    alt={notification.sender?.name || 'User'}
                  />
                  <NotificationContent>
                    <NotificationText>
                      <strong>{notification.sender?.name}</strong> {notification.content}
                    </NotificationText>
                    <NotificationTime>
                      {formatNotificationTime(notification.createdAt)}
                    </NotificationTime>
                  </NotificationContent>
                </NotificationItem>
              );
            })}
            {hasMore && (
              <MarkAllReadButton onClick={handleLoadMore}>
                Load More
              </MarkAllReadButton>
            )}
          </>
        )}
      </NotificationContainer>
    </Layout>
  );
};

export default NotificationPage;