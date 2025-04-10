import { useState, useEffect } from 'react';
import { MutualFriend } from './useMutualFriends';

interface OnlineUser {
  userId: string;
  socketId: string;
}

export const useOnlineStatus = (
  mutualFriends: MutualFriend[],
  onlineUsers: OnlineUser[]
) => {
  const [friendsWithStatus, setFriendsWithStatus] = useState<MutualFriend[]>(mutualFriends);

  useEffect(() => {
    setFriendsWithStatus(prev => {
      // Debug info for state updates
      console.debug('Previous state length:', prev.length);
      
      const updated = mutualFriends.map(friend => {
        const onlineUser = onlineUsers.find(user => user.userId === friend.userId);
        return {
          ...friend,
          isOnline: !!onlineUser,
          socketId: onlineUser?.socketId
        };
      });
      return updated;
    });
  }, [mutualFriends, onlineUsers]);

  return friendsWithStatus;
};