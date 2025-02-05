import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { ChatContainer, MessageList, MessageInput, SendButton, ChatHeader, ChatBody, ChatFooter } from '../../styles/Chat/chatStyle';
import axios from 'axios';

const Chat: React.FC = () => {
  const { chatId } = useParams<{ chatId: string }>();
  const navigate = useNavigate();

  const [messages, setMessages] = useState<any[]>([]);
  const [messageText, setMessageText] = useState<string>('');

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get(`/api/chats/${chatId || 'defaultChatId'}/messages`);
        console.log('Fetched messages:', response.data);
        setMessages(response.data);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };
  
    fetchMessages();
  }, [chatId]);
  

  const handleSendMessage = async () => {
    if (!messageText.trim()) return;

    try {
      const newMessage = {
        senderId: 'currentUserId', // Replace with actual current user ID
        receiverId: 'receiverUserId', // Replace with actual receiver user ID
        message: messageText,
      };

      // Send the message to the backend
      await axios.post(`/api/chats/${chatId || 'defaultChatId'}/messages`, newMessage);

      // Update the local state to show the new message
      setMessages((prev) => [newMessage, ...prev]);

      // Clear the input field
      setMessageText('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleBack = () => {
    navigate('/'); // Navigate back to home or previous page
  };

  return (
    <ChatContainer>
      <ChatHeader>
        <button onClick={handleBack}>Back</button>
        <h2>Chat Room</h2>
      </ChatHeader>

      <ChatBody>
      <MessageList>
        {Array.isArray(messages) ? (
            messages.map((message, index) => (
            <div
                key={index}
                className={`message ${message.senderId === 'currentUserId' ? 'sent' : 'received'}`}
            >
                {message.message}
            </div>
            ))
        ) : (
            <div>No messages available</div>
        )}
      </MessageList>
      </ChatBody>

      <ChatFooter>
        <MessageInput
          type="text"
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          placeholder="Type your message..."
        />
        <SendButton onClick={handleSendMessage}>Send</SendButton>
      </ChatFooter>
    </ChatContainer>
  );
};

export default Chat;
