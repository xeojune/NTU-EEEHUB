import React, { useState } from 'react'
import { PostHeaderContainer, FlexContainer, AvatarImage, TextBox, SubText, OptionsButton, PostInformation, SubTextBox } from '../../styles/FeedPosts/PostHeaderStyle'
import { FiMoreHorizontal } from 'react-icons/fi'
import ModalCard from '../ModalCard'
import styled from 'styled-components'

interface PostHeaderProps {
  username?: string;
  avatar?: string;
  points: number;
  createdAt: string;
  onDelete?: () => void;
  onEdit?: () => void;
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
  onEdit
}) => {
  const [showOptions, setShowOptions] = useState(false);

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
        <AvatarImage src={avatar} alt="user profile pic" />
        <PostInformation>
          <TextBox>{username}</TextBox>
          <SubTextBox>
            <SubText>{formatDate(createdAt)} · </SubText>
            <SubText color='red'>{points} points</SubText>
          </SubTextBox>
        </PostInformation>
      </FlexContainer>

      <OptionsButton onClick={() => setShowOptions(true)}>
        <FiMoreHorizontal size={24} />
      </OptionsButton>

      {showOptions && (
        <ModalCard
          width="300px"
          height="auto"
          onClose={() => setShowOptions(false)}
        >
          <div onClick={e => e.stopPropagation()}>
            <OptionButton onClick={() => {
              onEdit?.();
              setShowOptions(false);
            }}>
              Edit
            </OptionButton>
            <OptionButton 
              color="#ff4d4d"
              onClick={() => {
                onDelete?.();
                setShowOptions(false);
              }}
            >
              Delete
            </OptionButton>
            <OptionButton onClick={() => setShowOptions(false)}>
              Cancel
            </OptionButton>
          </div>
        </ModalCard>
      )}
    </PostHeaderContainer>
  )
}

export default PostHeader
