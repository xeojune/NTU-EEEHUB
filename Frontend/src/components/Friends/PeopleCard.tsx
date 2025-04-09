import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { AddFriendButton, Card, ContentContainer, CoverImage, Description, Name, ProfileImage } from '../../styles/Friends/PeopleCardStyle';
import { useUser } from '../../context/UserContext';
import defaultAvatar from '../../assets/userImg/defaultAvatar.png';
import defaultBackground from '../../assets/userImg/defaultBackground.png';

interface PeopleCardProps {
  userId: string;
  username: string;
  profileImg?: string;
  backgroundImg?: string;
  isFollowing: boolean;
  onFollowToggle: (userId: string) => void;
}

const PeopleCard: React.FC<PeopleCardProps> = ({
  userId,
  username,
  profileImg,
  backgroundImg,
  isFollowing,
  onFollowToggle,
}) => {
  const navigate = useNavigate();
  const [avatarUrl, setAvatarUrl] = useState<string>(profileImg || defaultAvatar);
  const [backgroundUrl, setBackgroundUrl] = useState<string>(backgroundImg || defaultBackground);
  const { getUserAvatar, getUserBackground } = useUser();

  useEffect(() => {
    const loadImages = async () => {
      try {
        const [avatar, background] = await Promise.all([
          getUserAvatar(username),
          getUserBackground(username)
        ]);
        setAvatarUrl(avatar);
        setBackgroundUrl(background);
      } catch (error) {
        console.error('Error loading images:', error);
        setAvatarUrl(defaultAvatar);
        setBackgroundUrl(defaultBackground);
      }
    };
    
    loadImages();
  }, [username, getUserAvatar, getUserBackground]);

  const handleCardClick = (e: React.MouseEvent) => {
    // Prevent navigation if clicking the follow button
    if ((e.target as HTMLElement).closest('button')) {
      return;
    }
    navigate(`/profile/${username}`);
  };

  return (
    <Card>
      <CoverImage url={backgroundUrl}>
        <ProfileImage url={avatarUrl} />
      </CoverImage>
      <ContentContainer>
        <Name>{username}</Name>
        <AddFriendButton 
          onClick={(e) => {
            e.stopPropagation();
            onFollowToggle(userId);
          }} 
          $isFollowing={isFollowing}
        >
          {!isFollowing && <span>+</span>}{isFollowing ? 'Following' : 'Follow'}
        </AddFriendButton>
      </ContentContainer>
    </Card>
  );
};

export default PeopleCard;