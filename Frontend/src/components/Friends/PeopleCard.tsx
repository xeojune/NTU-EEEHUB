import React from 'react';
import { AddFriendButton, Card, ContentContainer, CoverImage, Description, Name, ProfileImage } from '../../styles/Friends/PeopleCardStyle';

interface PeopleCardProps {
  imageUrl: string;
  name: string;
  description: string;
  onAddFriend: () => void;
}

const PeopleCard: React.FC<PeopleCardProps> = ({
  imageUrl,
  name,
  description,
  onAddFriend,
}) => {
  return (
    <Card>
      <CoverImage>
        <ProfileImage url={imageUrl} />
      </CoverImage>
      <ContentContainer>
        <Name>{name}</Name>
        <Description>{description}</Description>
        <AddFriendButton onClick={onAddFriend}>
          <span>+</span> Add Friend
        </AddFriendButton>
      </ContentContainer>
    </Card>
  );
};

export default PeopleCard;