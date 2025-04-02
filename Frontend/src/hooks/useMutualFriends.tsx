import { useState, useEffect } from 'react';
import { friendsApi } from '../apis/friendsApi';

export interface MutualFriend {
  userId: string;
  name: string;
  profileImg: string;
  isOnline: boolean;
  socketId?: string;
  lastMessage?: string;
  lastMessageTime?: string;
}

export const useMutualFriends = (currentUserId: string | null) => {
  const [mutualFriends, setMutualFriends] = useState<MutualFriend[]>([]);

  useEffect(() => {
    const fetchMutualConnections = async () => {
      if (!currentUserId) return;
      
      try {
        const followingsResponse = await friendsApi.getFollowings(currentUserId);
        const followersResponse = await friendsApi.getFollowers(currentUserId);
        
        const followingIds = new Set(followingsResponse.data.followings?.map(user => user.userId) || []);
        const followerIds = new Set(followersResponse.data.followers?.map(user => user.userId) || []);
        
        // Find mutual connections (users who follow each other)
        const mutualIds = [...followingIds].filter(id => followerIds.has(id));
        
        // Create initial mutual friends list with offline status
        const mutualFriendsList = followingsResponse.data.followings
          ?.filter(user => mutualIds.includes(user.userId))
          .map(user => ({
            userId: user.userId,
            name: user.username,
            profileImg: user.profileImg,
            isOnline: false
          })) || [];
        
        setMutualFriends(mutualFriendsList);
      } catch (error) {
        console.error('Error fetching mutual connections:', error);
      }
    };

    fetchMutualConnections();
  }, [currentUserId]);

  return { mutualFriends, setMutualFriends };
};