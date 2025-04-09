import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router';
import { AvatarInfoContainer, FollowButton, SuggestedUserContainer, SuggestedUserFollowers, SuggestedUserName, SuggestedUserProfileContainer } from '../../styles/Suggested/SuggestedUserStyle'
import { AvatarImage } from '../../styles/FeedPosts/PostHeaderStyle'
import { useUser } from '../../context/UserContext'
import defaultAvatar from '../../assets/userImg/defaultAvatar.png'

interface SuggestedUserProps {
  userId: string;
  username: string;
  followers: number;
  profileImg?: string;
  isFollowing: boolean;
  onFollowToggle: (userId: string) => void;
}

const SuggestedUser: React.FC<SuggestedUserProps> = ({
  userId,
  username,
  followers,
  profileImg,
  isFollowing,
  onFollowToggle
}) => {
  const navigate = useNavigate();
  const [avatarUrl, setAvatarUrl] = useState<string>(profileImg || defaultAvatar);
  const { getUserAvatar } = useUser();

  useEffect(() => {
    const loadAvatar = async () => {
      try {
        const avatar = await getUserAvatar(username);
        setAvatarUrl(avatar);
      } catch (error) {
        console.error('Error loading avatar:', error);
        setAvatarUrl(defaultAvatar);
      }
    };
    
    loadAvatar();
  }, [username, getUserAvatar]);

  const handleUserClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button')) {
      return;
    }
    navigate(`/profile/${username}`);
  };

  return (
    <SuggestedUserContainer>
        <AvatarInfoContainer>
            <AvatarImage src={avatarUrl} alt={`${username}'s profile pic`} width='40px' height='40px'/>
            <SuggestedUserProfileContainer>
                <SuggestedUserName>{username}</SuggestedUserName>
                <SuggestedUserFollowers>{followers} followers</SuggestedUserFollowers>
            </SuggestedUserProfileContainer>
        </AvatarInfoContainer>
        <FollowButton 
          onClick={(e) => {
            e.stopPropagation();
            onFollowToggle(userId);
          }}
        >
            {isFollowing ? 'Following' : 'Follow'}
        </FollowButton>
    </SuggestedUserContainer>
  )
}

export default SuggestedUser