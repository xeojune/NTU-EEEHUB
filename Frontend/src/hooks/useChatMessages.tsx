import { useState, useEffect } from 'react';
import { MutualFriend } from './useMutualFriends';
import { Socket } from 'socket.io-client';

interface Message {
  from: string;
  to: string;
  content: string;
  timestamp: string;
}

export const useChatMessages = (
  socket: Socket | null,
  currentUserId: string | null,
  mutualFriends: MutualFriend[]
) => {
  const [friendsWithMessages, setFriendsWithMessages] = useState<MutualFriend[]>(mutualFriends);

  // Update state when mutualFriends changes
  useEffect(() => {
    setFriendsWithMessages(mutualFriends);
  }, [mutualFriends]);

  useEffect(() => {
    if (!socket || !currentUserId) return;

    // Set up chat rooms for each mutual friend
    mutualFriends.forEach(friend => {
      socket.emit('find_chat_room', {
        participants: [currentUserId, friend.userId]
      }, (response: { roomId: string }) => {
        if (response.roomId) {
          socket.emit('join_room', { roomId: response.roomId });
        }
      });
    });

    const handlePrivateMessage = (message: Message) => {
      setFriendsWithMessages(prev => prev.map(friend => {
        if (friend.userId === message.from || friend.userId === message.to) {
          return {
            ...friend,
            lastMessage: message.content,
            lastMessageTime: message.timestamp
          };
        }
        return friend;
      }));
    };

    const handleChatHistory = (history: Message[]) => {
      if (!history.length) return;
      
      const firstMsg = history[0];
      const friendId = firstMsg.from === currentUserId ? firstMsg.to : firstMsg.from;
      const lastMsg = history[history.length - 1];
      
      setFriendsWithMessages(prev => prev.map(friend => {
        if (friend.userId === friendId) {
          return {
            ...friend,
            lastMessage: lastMsg.content,
            lastMessageTime: lastMsg.timestamp
          };
        }
        return friend;
      }));
    };

    socket.on('private_message', handlePrivateMessage);
    socket.on('chat_history', handleChatHistory);

    return () => {
      socket.off('private_message', handlePrivateMessage);
      socket.off('chat_history', handleChatHistory);
    };
  }, [socket, currentUserId, mutualFriends]);

  return friendsWithMessages;
};