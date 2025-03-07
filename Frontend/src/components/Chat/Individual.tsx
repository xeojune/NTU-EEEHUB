import React from 'react';
import styled from 'styled-components';
import { useSocket } from '../../hooks/useSocket';

interface IndividualProps {
  onUserSelect: (user: { socketId: string; _id: string; name: string; profileImg: string }) => void;
  selectedUserSocketId: string | null;
}

const Individual: React.FC<IndividualProps> = ({ 
  onUserSelect, 
  selectedUserSocketId 
}) => {
  const { onlineUsers } = useSocket();

  return (
    <UserList>
      {onlineUsers.map(user => (
        <UserItem 
          key={user.socketId}
          onClick={() => onUserSelect({
            socketId: user.socketId,
            _id: user.userId,
            name: user.name,
            profileImg: user.profileImg
          })}
          selected={selectedUserSocketId === user.socketId}
        >
          <UserAvatar src={user.profileImg} alt={user.name} />
          <UserInfo>
            <UserName>{user.name}</UserName>
            <OnlineStatus>Online</OnlineStatus>
          </UserInfo>
        </UserItem>
      ))}
      {onlineUsers.length === 0 && (
        <NoUsersMessage>No users online</NoUsersMessage>
      )}
    </UserList>
  );
};

const UserList = styled.div`
  width: 100%;
  height: 100%;
  overflow-y: auto;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  padding: 1rem 0;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: #ddd;
    border-radius: 3px;
  }
`;

const UserItem = styled.div<{ selected?: boolean }>`
  display: flex;
  align-items: center;
  padding: 1rem 1.5rem;
  cursor: pointer;
  background: ${props => props.selected ? 'rgba(0, 122, 255, 0.08)' : 'transparent'};
  position: relative;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(0, 122, 255, 0.05);
  }

  ${props => props.selected && `
    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 4px;
      background: #007AFF;
      border-radius: 0 4px 4px 0;
    }
  `}
`;

const UserAvatar = styled.img`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  margin-right: 1rem;
  object-fit: cover;
  border: 2px solid white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;

  ${UserItem}:hover & {
    transform: scale(1.05);
  }
`;

const UserInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const UserName = styled.div`
  font-weight: 600;
  color: #1a1a1a;
  font-size: 0.95rem;
  transition: color 0.2s ease;

  ${UserItem}:hover & {
    color: #007AFF;
  }
`;

const OnlineStatus = styled.div`
  font-size: 0.8rem;
  color: #4CAF50;
  display: flex;
  align-items: center;
  gap: 4px;

  &::before {
    content: '';
    display: inline-block;
    width: 8px;
    height: 8px;
    background: #4CAF50;
    border-radius: 50%;
    box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.2);
  }
`;

const NoUsersMessage = styled.div`
  padding: 3rem 2rem;
  text-align: center;
  color: #666;
  font-style: italic;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;

  &::before {
    content: '👥';
    font-size: 2rem;
  }
`;

export default Individual;