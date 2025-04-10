import React from 'react';
import styled from 'styled-components';
import { useSocket } from '../../hooks/useSocket';
import { useMutualFriends } from '../../hooks/useMutualFriends';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';
import { useChatMessages } from '../../hooks/useChatMessages';

interface IndividualProps {
  onUserSelect: (user: { socketId: string; _id: string; name: string; profileImg: string }) => void;
  selectedUserSocketId: string | null;
}

const Individual: React.FC<IndividualProps> = ({ 
  onUserSelect, 
  selectedUserSocketId 
}) => {
  const { socket, onlineUsers } = useSocket();
  const currentUserId = localStorage.getItem('userId');

  // Step 1: Get mutual friends
  const { mutualFriends } = useMutualFriends(currentUserId);
  
  // Step 2: Update online status
  const friendsWithStatus = useOnlineStatus(mutualFriends, onlineUsers);
  
  // Step 3: Handle messages
  const friendsWithMessages = useChatMessages(socket, currentUserId, friendsWithStatus);

  const getRelativeTime = (timestamp: string) => {
    const now = new Date();
    const messageDate = new Date(timestamp);
    const diffInMilliseconds = now.getTime() - messageDate.getTime();
    const diffInMinutes = Math.floor(diffInMilliseconds / (1000 * 60));
    const diffInHours = Math.floor(diffInMilliseconds / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24));

    if (diffInMinutes < 60) {
      return `${diffInMinutes} ${diffInMinutes === 1 ? 'minute' : 'minutes'} ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours} ${diffInHours === 1 ? 'hour' : 'hours'} ago`;
    } else {
      return `${diffInDays} ${diffInDays === 1 ? 'day' : 'days'} ago`;
    }
  };

  return (
    <Container>
      <Heading>Friends</Heading>
      <UserList>
        {friendsWithMessages && friendsWithMessages.length > 0 ? (
          friendsWithMessages.map(friend => (
            <UserItem 
              key={friend.userId}
              onClick={() => {
                onUserSelect({
                  socketId: friend.socketId || '',
                  _id: friend.userId,
                  name: friend.name,
                  profileImg: friend.profileImg
                });
              }}
              selected={selectedUserSocketId === friend.socketId}
              isOnline={friend.isOnline}
            >
              <UserAvatar src={friend.profileImg} alt={friend.name} />
              <UserInfo>
                <UserName>{friend.name}</UserName>
                <LastMessageContainer>
                  <LastMessage>{friend.lastMessage || 'No messages yet'}</LastMessage>
                  {friend.lastMessageTime && (
                    <MessageTime>
                      {getRelativeTime(friend.lastMessageTime)}
                    </MessageTime>
                  )}
                </LastMessageContainer>
                <OnlineStatus isOnline={friend.isOnline}>
                  {friend.isOnline ? 'Online' : 'Offline'}
                </OnlineStatus>
              </UserInfo>
            </UserItem>
          ))
        ) : (
          <NoUsersMessage>No mutual friends found</NoUsersMessage>
        )}
      </UserList>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  border-bottom: 1px solid #eef2f7;
`;

const Heading = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: #1a1a1a;
  margin: 1rem 1.5rem;
`;

const UserList = styled.div`
  width: 100%;
  height: 100%;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 3px;
  }
`;

const UserItem = styled.div<{ selected?: boolean; isOnline: boolean }>`
  display: flex;
  align-items: center;
  padding: 0.75rem 1.5rem;
  cursor: pointer;
  background: ${props => props.selected ? '#f0f2f5' : 'transparent'};
  opacity: 1
  transition: all 0.2s ease;
  border-bottom: 1px solid #eef2f7;

  &:hover {
    background: ${props => props.selected ? '#f0f2f5' : 'transparent'};
  }
`;

const UserAvatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;

  ${UserItem}:hover & {
    transform: scale(1.05);
  }
`;

const UserInfo = styled.div`
  margin-left: 12px;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const UserName = styled.div`
  font-weight: 500;
  color: #1a1a1a;
  margin-bottom: 2px;
`;

const LastMessageContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin: 2px 0;
`;

const LastMessage = styled.span`
  font-size: 0.9em;
  color: #666;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 70%;
`;

const MessageTime = styled.span`
  font-size: 0.8em;
  color: #999;
`;

const OnlineStatus = styled.div<{ isOnline: boolean }>`
  display: flex;
  align-items: center;
  font-size: 0.85rem;
  color: ${props => props.isOnline ? '#2ecc71' : '#95a5a6'};

  &::before {
    content: '';
    display: inline-block;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: ${props => props.isOnline ? '#2ecc71' : '#95a5a6'};
    margin-right: 6px;
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