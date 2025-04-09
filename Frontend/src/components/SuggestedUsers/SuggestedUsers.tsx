import React, { useState, useEffect } from 'react'
import { SeeAllButton, SuggestedBox, SuggestedContainer, SuggestedFooter, SuggestedUsersContainer} from '../../styles/Suggested/SuggestedUsersStyle'
import SuggestedHeader from './SuggestedHeader'
import SuggestedUser from './SuggestedUser'
import { friendsApi, User as Person } from '../../apis/friendsApi'
import { toast } from 'react-toastify'
import { notificationApi, NotificationType } from '../../apis/notificationApi'
import { useUser } from '../../context/UserContext'

interface ExtendedUser extends Person {
  followerCount: number;
}

const SuggestedUsers: React.FC = () => {
  const [suggestedUsers, setSuggestedUsers] = useState<ExtendedUser[]>([]);
  const [followingIds, setFollowingIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { fetchUserProfileById } = useUser();

  const fetchSuggestedUsers = async () => {
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) return;

      // First get the current user's followings
      const followingsResponse = await friendsApi.getFollowings(userId);
      const followingSet = new Set(followingsResponse.data.followings?.map(user => user.userId) || []);
      setFollowingIds(followingSet);

      // Then get all users and filter out the ones being followed
      const usersResponse = await friendsApi.getAllUsers(page);
      if (usersResponse.data.users) {
        const filteredUsers = usersResponse.data.users.filter(
          user => !followingSet.has(user.userId) && user.userId !== userId
        );

        // Fetch follower counts for each user
        const usersWithFollowers = await Promise.all(
          filteredUsers.map(async user => {
            try {
              const userProfile = await fetchUserProfileById(user.userId);
              return {
                ...user,
                followerCount: userProfile?.followerCount || 0
              };
            } catch (error) {
              console.error(`Error fetching follower count for ${user.username}:`, error);
              return {
                ...user,
                followerCount: 0
              };
            }
          })
        );

        setSuggestedUsers(usersWithFollowers);
        setTotalPages(usersResponse.data.totalPages);
      }
    } catch (error) {
      console.error('Error fetching suggested users:', error);
      toast.error('Failed to load suggested users');
    } finally {
      setLoading(false);
    }
  };

  const handleFollowToggle = async (userId: string) => {
    try {
      if (followingIds.has(userId)) {
        await friendsApi.unfollowUser(userId);
        setFollowingIds(prev => {
          const newSet = new Set(prev);
          newSet.delete(userId);
          return newSet;
        });
        toast.success('User unfollowed successfully');
      } else {
        await friendsApi.followUser(userId);
        setFollowingIds(prev => new Set([...prev, userId]));
        
        // Send notification with correct parameters
        const currentUserId = localStorage.getItem('userId');
        if (currentUserId) {
          await notificationApi.createNotification({
            recipientId: userId,
            senderId: currentUserId,
            type: NotificationType.FOLLOW,
            content: 'started following you'
          });
        }
        
        toast.success('User followed successfully');
      }
    } catch (error) {
      console.error('Error toggling follow:', error);
      toast.error('Failed to update follow status');
    }
  };

  useEffect(() => {
    fetchSuggestedUsers();
  }, [page]);

  if (loading) {
    return <SuggestedUsersContainer>Loading...</SuggestedUsersContainer>;
  }

  return (
    <SuggestedUsersContainer py={1} px={1} gap={2}>
      <SuggestedHeader />
      <SuggestedContainer>
        <SuggestedBox>
          Suggested For You
        </SuggestedBox>
        <SeeAllButton onClick={() => setPage(p => (p < totalPages ? p + 1 : 1))}>
          {page < totalPages ? 'See More' : 'Back to Start'}
        </SeeAllButton>
      </SuggestedContainer>

      {suggestedUsers.map(user => (
        <SuggestedUser
          key={user.userId}
          userId={user.userId}
          username={user.username}
          followers={user.followerCount}
          profileImg={user.profileImg}
          isFollowing={followingIds.has(user.userId)}
          onFollowToggle={handleFollowToggle}
        />
      ))}

      <SuggestedFooter>
        &copy; 2024 Copy Right All Rights Reserved
      </SuggestedFooter>
    </SuggestedUsersContainer>
  )
}

export default SuggestedUsers