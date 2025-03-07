import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useUser } from '../context/UserContext';

const SOCKET_SERVER_URL = 'http://localhost:3002'; // Match the port in chat-gateway.ts

interface OnlineUser {
  socketId: string;
  userId: string;
  name: string;
  profileImg: string;
}

interface ChatMessage {
  _id: string;
  from: string;
  to: string;
  content: string;
  timestamp: Date;
  roomId: string;
}

export const useSocket = () => {
  const { user } = useUser();
  const socketRef = useRef<Socket | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [activeRoom, setActiveRoom] = useState<string | null>(null);

  useEffect(() => {
    // Only connect if we have a user
    if (!user?._id) return;

    // Create socket connection
    const socket = io(SOCKET_SERVER_URL, {
      transports: ['websocket'],
      autoConnect: true,
    });

    // Store socket in ref
    socketRef.current = socket;

    // Connect event
    socket.on('connect', () => {
      console.log('Socket connected');
      
      // Join chat when connected with user info
      socket.emit('join_chat', {
        userId: user._id,
        name: user.name,
        profileImg: user.profileImg
      });
    });

    // Listen for online users updates
    socket.on('online_users', (users: OnlineUser[]) => {
      // Filter out current user from the list
      setOnlineUsers(users.filter(u => u.userId !== user._id));
    });

    // Listen for private messages
    socket.on('private_message', (message: ChatMessage) => {
      setMessages(prev => [...prev, message]);
    });

    // Listen for chat history
    socket.on('chat_history', (history: ChatMessage[]) => {
      setMessages(history);
    });

    // Error handling
    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });

    socket.on('error', (error) => {
      console.error('Socket error:', error);
    });

    // Cleanup on unmount
    return () => {
      if (socket) {
        socket.disconnect();
        socketRef.current = null;
      }
    };
  }, [user]); // Reconnect if user changes

  // Function to send a message
  const sendMessage = (to: string, content: string) => {
    if (!socketRef.current) return;
    
    socketRef.current.emit('private_message', {
      to,
      content,
      roomId: activeRoom
    });
  };

  // Function to load chat history
  const loadChatHistory = (roomId: string) => {
    if (!socketRef.current) return;
    
    setActiveRoom(roomId);
    socketRef.current.emit('get_chat_history', { roomId });
  };

  return {
    socket: socketRef.current,
    isConnected: socketRef.current?.connected || false,
    onlineUsers,
    messages,
    activeRoom,
    sendMessage,
    loadChatHistory
  };
};
