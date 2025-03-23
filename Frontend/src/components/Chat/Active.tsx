import React, { useState, useEffect, useCallback } from 'react';
import { useSocket } from '../../hooks/useSocket';
import { useUser } from '../../context/UserContext';
import {
  ActiveChatContainer,
  ActiveChatHeader,
  UserInfo,
  ActiveChatName,
  ActiveChatStatus,
  ChatArea,
  MessagesContainer,
  MessageBubble,
  ChatInput,
  NoChatSelected,
  ChatAvatar,
  OnlineStatus,
  ActionButtons
} from '../../styles/Chat/chatStyle';
import { FaVideo, FaPhoneAlt, FaPaperPlane } from 'react-icons/fa';

interface Message {
  _id: string;
  from: string;
  to: string;
  content: string;
  timestamp: string | Date;
  roomId: string;
  sender: {
    _id: string;
    name: string;
    profileImg: string;
  };
  receiver: {
    _id: string;
    name: string;
    profileImg: string;
  };
}

interface ActiveProps {
  selectedUserSocketId: string | null;
  selectedUser?: {
    name: string;
    profileImg: string;
    _id: string;
  };
}

const Active: React.FC<ActiveProps> = ({ selectedUserSocketId, selectedUser }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentRoomId, setCurrentRoomId] = useState<string | null>(null);
  const { socket } = useSocket();
  const { user } = useUser();

  // Load chat history when user is selected
  useEffect(() => {
    if (!socket || !selectedUser || !user) return;

    const loadChatHistory = async () => {
      if (!selectedUser || !user) return;
      
      try {
        console.log('Finding chat room for users:', user._id, selectedUser._id);
        // First, find or create chat room
        socket.emit('find_chat_room', {
          participants: [user._id, selectedUser._id]
        }, (response: { roomId: string }) => {
          if (response.roomId) {
            console.log('Chat room found:', response.roomId);
            setCurrentRoomId(response.roomId);
            // Join room and get history
            socket.emit('join_room', { roomId: response.roomId });
            // Request chat history even if the user is offline
            socket.emit('get_chat_history', { roomId: response.roomId });
          } else {
            console.log('No chat room found');
          }
        });
      } catch (error) {
        console.error('Error loading chat history:', error);
      }
    };

    loadChatHistory();
  }, [socket, selectedUser, user]);

  // Listen for chat history and messages
  useEffect(() => {
    if (!socket || !currentRoomId) return;

    // Listen for chat history
    const handleChatHistory = (history: Message[]) => {
      setMessages(history);
    };

    // Listen for private messages
    const handlePrivateMessage = (message: Message) => {
      // Only add message if it's part of the current conversation
      if (
        (message.from === user?._id && message.to === selectedUser?._id) ||
        (message.from === selectedUser?._id && message.to === user?._id)
      ) {
        setMessages(prev => [...prev, message]);
      }
    };

    // Listen for typing indicators
    const handleTyping = ({ userId }: { userId: string }) => {
      if (userId === selectedUser?._id) {
        setIsTyping(true);
      }
    };

    const handleStopTyping = ({ userId }: { userId: string }) => {
      if (userId === selectedUser?._id) {
        setIsTyping(false);
      }
    };

    socket.on('chat_history', handleChatHistory);
    socket.on('private_message', handlePrivateMessage);
    socket.on('typing', handleTyping);
    socket.on('stop_typing', handleStopTyping);

    // Request chat history when listeners are set up
    socket.emit('get_chat_history', { roomId: currentRoomId });

    return () => {
      socket.off('chat_history', handleChatHistory);
      socket.off('private_message', handlePrivateMessage);
      socket.off('typing', handleTyping);
      socket.off('stop_typing', handleStopTyping);
    };
  }, [socket, currentRoomId, selectedUser?._id, user?._id]);

  // Clear messages when switching users
  useEffect(() => {
    setMessages([]);
    setMessageInput('');
    setIsTyping(false);
    setCurrentRoomId(null);
  }, [selectedUserSocketId]);

  const sendMessage = useCallback(() => {
    if (!selectedUser?._id || !messageInput.trim() || !socket || !user || !currentRoomId) return;

    socket.emit('private_message', {
      to: selectedUser._id,
      content: messageInput.trim(),
      roomId: currentRoomId
    });

    setMessageInput('');
    socket.emit('stop_typing', selectedUser._id);
  }, [socket, selectedUser?._id, messageInput, user, currentRoomId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessageInput(e.target.value);
    if (selectedUserSocketId && socket) {
      socket.emit('typing', selectedUserSocketId);
    }
  };

  const handleClick = () => {
    if (!selectedUserSocketId || !selectedUser) return;
    if (selectedUserSocketId && socket) {
      socket.emit('typing', selectedUserSocketId);
    }
  };

  if (!selectedUserSocketId || !selectedUser) {
    return (
      <NoChatSelected>
        <h3>Select a user to start chatting</h3>
      </NoChatSelected>
    );
  }

  return (
    <ActiveChatContainer>
      <ActiveChatHeader>
        <ChatAvatar>
          <img src={selectedUser.profileImg} alt={selectedUser.name} />
          <OnlineStatus />
        </ChatAvatar>
        
        <UserInfo>
          <ActiveChatName>{selectedUser.name}</ActiveChatName>
          {isTyping ? (
            <ActiveChatStatus>typing...</ActiveChatStatus>
          ) : (
            <ActiveChatStatus>online</ActiveChatStatus>
          )}
        </UserInfo>

        <ActionButtons>
          <button onClick={handleClick}>
            <FaVideo size={20} />
          </button>
          <button onClick={handleClick}>
            <FaPhoneAlt size={20} />
          </button>
        </ActionButtons>
      </ActiveChatHeader>

      <ChatArea>
        <MessagesContainer>
          {messages.map((msg) => (
            <MessageBubble key={msg._id} isOwn={msg.from === user?._id}>
              <div className="message-content">
                <div className="message">{msg.content}</div>
                <div className="time">
                  {new Date(msg.timestamp).toLocaleString('en-US', {
                    hour: 'numeric',
                    minute: 'numeric',
                    hour12: true,
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </div>
              </div>
            </MessageBubble>
          ))}
        </MessagesContainer>

        <ChatInput>
          <div className="input-container">
            <input
              value={messageInput}
              onChange={handleInputChange}
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

export default Active;