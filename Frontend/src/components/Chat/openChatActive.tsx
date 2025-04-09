import React, { useState, useEffect, useCallback } from 'react';
import { useOpenSocket } from '../../hooks/useOpenSocket';
import { useUser } from '../../context/UserContext';
import styled from 'styled-components';
import {
  ActiveChatContainer,
  ActiveChatHeader,
  UserInfo,
  ActiveChatName,
  ActiveChatStatus,
  ChatArea,
  MessagesContainer,
  ChatInput,
  NoChatSelected,
  ChatAvatar,
  OnlineStatus,
  ActionButtons
} from '../../styles/Chat/chatStyle';
import { FaPaperPlane } from 'react-icons/fa';
import defaultAvatar from '../../assets/userImg/defaultAvatar.png';

interface Message {
  sender: string;
  message: string;
  timestamp: Date;
}

interface MessageWithUser extends Message {
  senderName?: string;
  senderAvatar?: string;
}

export interface Room {
  _id: string;
  roomName: string;
  createdBy: string;
  participants: string[];
  openChatAvatar?: string;
  messages: Message[];
  createdAt: Date;
}

interface OpenChatActiveProps {
  selectedRoom?: Room;
}

const MessageBubbleContainer = styled.div<{ isOwn: boolean }>`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin: 8px 0;
  width: 100%;
  justify-content: ${({ isOwn }) => isOwn ? 'flex-end' : 'flex-start'};

  @media (max-width: 768px) {
    gap: 8px;
    margin: 6px 0;
  }
`;

const MessageAvatar = styled.div`
  width: 36px;
  height: 36px;
  flex-shrink: 0;
  
  @media (max-width: 768px) {
    width: 32px;
    height: 32px;
  }
  
  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
  }
`;

const MessageContent = styled.div<{ isOwn: boolean }>`
  display: flex;
  flex-direction: column;
  max-width: 60%;
  align-items: ${({ isOwn }) => isOwn ? 'flex-end' : 'flex-start'};

  @media (max-width: 768px) {
    max-width: 75%;
  }
`;

const MessageBubble = styled.div<{ isOwn: boolean }>`
  background-color: ${({ isOwn }) => isOwn ? '#0066FF' : '#f0f2f5'};
  color: ${({ isOwn }) => isOwn ? 'white' : '#1a1a1a'};
  padding: 12px 16px;
  border-radius: 16px;
  border-top-${({ isOwn }) => isOwn ? 'right' : 'left'}-radius: 4px;
  font-size: 15px;

  @media (max-width: 768px) {
    padding: 8px 12px;
    font-size: 14px;
  }
`;

const MessageInfo = styled.div<{ isOwn: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: ${({ isOwn }) => isOwn ? 'flex-end' : 'flex-start'};
  gap: 2px;
  width: 100%;
`;

const MessageRow = styled.div<{ isOwn: boolean }>`
  display: flex;
  align-items: flex-end;
  gap: 8px;
  flex-direction: ${({ isOwn }) => isOwn ? 'row-reverse' : 'row'};
`;

const SenderName = styled.span`
  font-size: 12px;
  color: #65676B;
  margin-bottom: 2px;
`;

const TimeStamp = styled.span`
  font-size: 11px;
  color: #65676B;
  margin-bottom: 4px;
`;

const ChatHeader = styled.div`
  display: flex;
  align-items: center;
  padding: 15px;
  background-color: #f5f5f5;
  border-bottom: 1px solid #ddd;

  @media (max-width: 768px) {
    padding: 10px;
    position: sticky;
    top: 0;
    z-index: 10;
  }
`;

const RoomAvatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 15px;
  object-fit: cover;

  @media (max-width: 768px) {
    width: 36px;
    height: 36px;
    margin-right: 10px;
  }
`;

const DefaultAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 15px;
  background-color: #ddd;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  color: #666;
`;

const OpenChatActive: React.FC<OpenChatActiveProps> = ({ selectedRoom }) => {
  const [messageInput, setMessageInput] = useState('');
  const { socket } = useOpenSocket();
  const { user, fetchUserProfile, fetchUserProfileByUsername } = useUser();
  const [messages, setMessages] = useState<MessageWithUser[]>([]);
  const [userCache, setUserCache] = useState<{ [key: string]: { name: string; avatar: string } }>({});

  const fetchUserInfo = async (userId: string) => {
    if (userCache[userId]) return userCache[userId];

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/users/${userId}/profile`);
      const userProfile = await response.json();
      
      const userInfo = {
        name: userProfile?.name || 'Unknown User',
        avatar: userProfile?.profileImg || defaultAvatar
      };
      
      setUserCache(prev => ({
        ...prev,
        [userId]: userInfo
      }));
      
      return userInfo;
    } catch (error) {
      console.error('Error fetching user info:', error);
      return { name: 'Unknown User', avatar: defaultAvatar };
    }
  };

  useEffect(() => {
    if (!socket || !selectedRoom || !user?._id) return;

    // Join the room when component mounts
    socket.emit('joinOpenRoom', {
      roomId: selectedRoom._id,
      userId: user._id
    });

    const updateMessagesWithUserInfo = async () => {
      const updatedMessages = await Promise.all(
        selectedRoom.messages.map(async (msg) => {
          const userInfo = await fetchUserInfo(msg.sender);
          return {
            ...msg,
            senderName: userInfo.name,
            senderAvatar: userInfo.avatar
          };
        })
      );
      setMessages(updatedMessages);
    };

    updateMessagesWithUserInfo();

    // Listen for new messages
    socket.on('newMessage', async (updatedRoom: Room) => {
      console.log('Received new message:', updatedRoom);
      if (updatedRoom._id === selectedRoom._id) {
        const latestMessage = updatedRoom.messages[updatedRoom.messages.length - 1];
        const userInfo = await fetchUserInfo(latestMessage.sender);
        
        setMessages(prevMessages => [
          ...prevMessages,
          {
            ...latestMessage,
            senderName: userInfo.name,
            senderAvatar: userInfo.avatar
          }
        ]);
      }
    });

    return () => {
      // Leave the room when component unmounts
      socket.emit('leaveOpenRoom', {
        roomId: selectedRoom._id,
        userId: user._id
      });
      socket.off('newMessage');
    };
  }, [socket, selectedRoom?._id, user?._id]);

  useEffect(() => {
    if (selectedRoom && socket) {
      // Rejoin the room whenever socket connects/reconnects
      socket.emit('joinOpenRoom', {
        roomId: selectedRoom._id,
        userId: user?._id
      });
    }
  }, [socket, selectedRoom, user?._id]);

  const sendMessage = useCallback(() => {
    if (!selectedRoom?._id || !messageInput.trim() || !socket || !user?._id) {
      console.error('Cannot send message:', {
        roomId: selectedRoom?._id,
        messageInput,
        socketConnected: socket?.connected,
        userId: user?._id
      });
      return;
    }

    console.log('Sending message:', {
      roomId: selectedRoom._id,
      userId: user._id,
      message: messageInput.trim()
    });

    socket.emit('sendOpenMessage', {
      roomId: selectedRoom._id,
      userId: user._id,
      message: messageInput.trim()
    });

    setMessageInput('');
  }, [socket, selectedRoom?._id, messageInput, user?._id]);

  if (!selectedRoom) {
    return (
      <NoChatSelected>
        <h3>Select a room to start chatting</h3>
      </NoChatSelected>
    );
  }

  return (
    <ActiveChatContainer>
      <ChatHeader>
        {selectedRoom.openChatAvatar ? (
          <RoomAvatar src={selectedRoom.openChatAvatar} alt={selectedRoom.roomName} />
        ) : (
          <DefaultAvatar>
            {selectedRoom.roomName.charAt(0).toUpperCase()}
          </DefaultAvatar>
        )}
        <UserInfo>
          <ActiveChatName>{selectedRoom.roomName}</ActiveChatName>
          <ActiveChatStatus>
            {selectedRoom.participants.length} participants
          </ActiveChatStatus>
        </UserInfo>
      </ChatHeader>

      <ChatArea>
        <MessagesContainer>
          {messages.map((msg, index) => {
            const isOwn = msg.sender === user?._id;
            return (
              <MessageBubbleContainer key={index} isOwn={isOwn}>
                {!isOwn && (
                  <MessageAvatar>
                    <img src={msg.senderAvatar || defaultAvatar} alt={msg.senderName} />
                  </MessageAvatar>
                )}
                <MessageContent isOwn={isOwn}>
                  <MessageInfo isOwn={isOwn}>
                    {!isOwn && <SenderName>{msg.senderName || 'Unknown User'}</SenderName>}
                    <MessageRow isOwn={isOwn}>
                      <MessageBubble isOwn={isOwn}>
                        {msg.message}
                      </MessageBubble>
                      <TimeStamp>
                        {new Date(msg.timestamp).toLocaleString('en-US', {
                          hour: 'numeric',
                          minute: 'numeric',
                          hour12: true
                        })}
                      </TimeStamp>
                    </MessageRow>
                  </MessageInfo>
                </MessageContent>
              </MessageBubbleContainer>
            );
          })}
        </MessagesContainer>

        <ChatInput>
          <div className="input-container">
            <input
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              placeholder="Type a message..."
              onKeyPress={e => e.key === 'Enter' && sendMessage()}
            />
            <button onClick={sendMessage}>
              <FaPaperPlane size={18} />
            </button>
          </div>
        </ChatInput>
      </ChatArea>
    </ActiveChatContainer>
  );
};

export default OpenChatActive;