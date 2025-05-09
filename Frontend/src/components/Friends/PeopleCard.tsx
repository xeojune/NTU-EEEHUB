import React, { useState, useEffect } from 'react';
import { AddFriendButton, Card as OriginalCard, ContentContainer, CoverImage, Name, ProfileImage } from '../../styles/Friends/PeopleCardStyle';
import { useUser } from '../../context/UserContext';
import defaultAvatar from '../../assets/userImg/defaultAvatar.png';
import defaultBackground from '../../assets/userImg/defaultBackground.png';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const AnimatedCard = styled(OriginalCard)`
  animation: ${fadeIn} 0.5s ease-out forwards;
`;

interface PeopleCardProps {
  userId: string;
  username: string;
  profileImg?: string;
  backgroundImg?: string;
  isFollowing: boolean;
  onFollowToggle: (userId: string) => void;
  delay?: number;
}

const PeopleCard: React.FC<PeopleCardProps> = ({
  userId,
  username,
  profileImg,
  backgroundImg,
  isFollowing,
  onFollowToggle,
  delay = 0
}) => {
  const [avatarUrl, setAvatarUrl] = useState<string>(profileImg || defaultAvatar);
  const [backgroundUrl, setBackgroundUrl] = useState<string>(backgroundImg || defaultBackground);
  const { getUserAvatar, getUserBackground } = useUser();

  const StyledAnimatedCard = styled(AnimatedCard)`
    animation-delay: ${delay}ms;
  `;

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

  return (
    <StyledAnimatedCard>
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
    </StyledAnimatedCard>
  );
};

export default PeopleCard;