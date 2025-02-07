import React, { useState } from 'react'
import { PostHeaderContainer, FlexContainer, AvatarImage, TextBox, SubText, OptionsButton, PostInformation, SubTextBox } from '../../styles/FeedPosts/PostHeaderStyle'
import { FiMoreHorizontal } from 'react-icons/fi'
import ModalCard from '../ModalCard'
import styled from 'styled-components'

//showActions added to check if the post belongs to current user logged in (prevent deleting other users' posts)
interface PostHeaderProps {
  username?: string;
  avatar?: string;
  points: number;
  createdAt: string;
  onDelete?: () => void;
  onEdit?: () => void;
  showActions?: boolean;
}

const OptionButton = styled.button`
  width: 100%;
  height: 48px;
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 14px;
  color: ${props => props.color || '#fff'};
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;

const PostHeader: React.FC<PostHeaderProps> = ({ 
  username = 'User', 
  avatar = '/default-avatar.png',
  points,
  createdAt,
  onDelete,
  onEdit,
  showActions = false
}) => {
  const [showModal, setShowModal] = useState(false);

  // Function to format the date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 7) {
      return `${diffDays}d`;
    } else if (diffDays < 30) {
      return `${Math.floor(diffDays / 7)}w`;
    } else if (diffDays < 365) {
      return `${Math.floor(diffDays / 30)}m`;
    } else {
      return `${Math.floor(diffDays / 365)}y`;
    }
  };

  return (
    <PostHeaderContainer>
      <FlexContainer>
        <AvatarImage src={avatar} alt={username} />
        <TextBox>
          <PostInformation>
            <TextBox>
              {username}
            </TextBox>
            <SubTextBox>
              <SubText>{formatDate(createdAt)}</SubText>
              <SubText>·</SubText>
              <SubText color='red'>{points} points</SubText>
            </SubTextBox>
          </PostInformation>
        </TextBox>
      </FlexContainer>
      {showActions && (
        <OptionsButton onClick={() => setShowModal(true)}>
          <FiMoreHorizontal size={24} />
        </OptionsButton>
      )}
      
      {showModal && showActions && (
        <ModalCard top="0" onClose={() => setShowModal(false)}>
          {onEdit && (
            <OptionButton onClick={() => {
              onEdit();
              setShowModal(false);
            }}>
              Edit Post
            </OptionButton>
          )}
          {onDelete && (
            <OptionButton 
              color="#FF453A"
              onClick={() => {
                onDelete();
                setShowModal(false);
              }}
            >
              Delete Post
            </OptionButton>
          )}
        </ModalCard>
      )}
    </PostHeaderContainer>
  );
};

export default PostHeader;
