import styled from 'styled-components';

interface AvatarProps {
  size?: number;
}

interface NavigationButtonProps {
  direction: 'left' | 'right';
}

interface DotProps {
  active: boolean;
}

export const Avatar = styled.img<AvatarProps>`
  width: ${props => props.size || 32}px;
  height: ${props => props.size || 32}px;
  border-radius: 50%;
  object-fit: cover;
`;

export const ModalContent = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  background-color: #181820;
`;

export const ImageSection = styled.div`
  position: relative;
  width: 65%;
  height: 100%;
  background-color: #000;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    max-width: 100%;
    max-height: 100%;
    width: auto;
    height: auto;
    object-fit: contain;
  }
`;

export const CommentsSection = styled.div`
  width: 35%;
  height: 100%;
  background-color: #181820;
  display: flex;
  flex-direction: column;
  border-left: 1px solid #262626;
  overflow-y: auto;
`;

export const PostHeader = styled.div`
  padding: 14px 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  border-bottom: 1px solid #262626;
`;

export const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const PostInfoContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const Username = styled.div`
  color: #fff;
  font-weight: 600;
  font-size: 14px;
`;

export const PostInfo = styled.div`
  color: #A8A8A8;
  font-size: 14px;
`;

export const NavigationButton = styled.button<NavigationButtonProps>`
  position: absolute;
  top: 50%;
  ${props => props.direction}: 10px;
  transform: translateY(-50%);
  background: rgba(0, 0, 0, 0.6);
  border: none;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: white;
  z-index: 1;

  &:hover {
    background: rgba(0, 0, 0, 0.8);
  }
`;

export const ImageDots = styled.div`
  position: absolute;
  bottom: 16px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 4px;
  z-index: 1;
`;

export const Dot = styled.div<DotProps>`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: ${props => props.active ? '#fff' : 'rgba(255, 255, 255, 0.5)'};
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${props => props.active ? '#fff' : 'rgba(255, 255, 255, 0.7)'};
  }
`;

export const CommentsList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 16px;
`;

export const Comment = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 16px;

  &:last-child {
    margin-bottom: 0;
    border-bottom: none;
  }
`;

export const CommentUserInfo = styled.div`
  display: flex;
  gap: 12px;
  flex: 1;
`;

export const CommentContent = styled.div`
  color: #fff;
  font-size: 14px;
  line-height: 1.4;
  flex: 1;
`;

export const CommentTextContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
`;

export const CommentHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const CommentUsername = styled.span`
  color: #fff;
  font-weight: 600;
  font-size: 14px;
`;

export const CommentDate = styled.span`
  color: #A8A8A8;
  font-size: 12px;
`;

export const PointsSection = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 8px;
`;

export const RemainingPoints = styled.div`
  color: #4a90e2;
  font-size: 14px;
  padding-left: 44px;
`;

export const CommentInputSection = styled.div`
  padding: 16px;
  border-top: 1px solid #262626;
  background-color: #181820;
`;

export const CommentInputForm = styled.form`
  display: flex;
  gap: 12px;
`;

export const CommentInput = styled.input`
  flex: 1;
  background-color: #262626;
  border: none;
  border-radius: 4px;
  padding: 8px 12px;
  color: #fff;
  font-size: 14px;

  &::placeholder {
    color: #A8A8A8;
  }

  &:focus {
    outline: none;
    background-color: #363636;
  }
`;

export const PostButton = styled.button`
  background-color: #0095f6;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #1877f2;
  }

  &:disabled {
    background-color: #0095f640;
    cursor: not-allowed;
  }
`;

export const PointsInput = styled.input`
  width: 80px;
  padding: 4px 8px;
  border: 1px solid #3a3a3a;
  border-radius: 4px;
  background-color: #242424;
  color: #fff;
  font-size: 14px;

  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button {
    opacity: 1;
  }
`;

export const DistributeButton = styled.button<{ disabled?: boolean }>`
  padding: 4px 12px;
  border-radius: 4px;
  background-color: ${props => props.disabled ? '#3a3a3a' : '#4a90e2'};
  color: #fff;
  font-size: 14px;
  border: none;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: background-color 0.2s;

  &:hover {
    background-color: ${props => props.disabled ? '#3a3a3a' : '#357abd'};
  }
`;

export const NoComments = styled.div`
  color: #A8A8A8;
  text-align: center;
  padding: 20px;
`;