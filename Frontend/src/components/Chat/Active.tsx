import React, { useState } from 'react'
import { 
  ActiveChatContainer, 
  ActiveChatHeader, 
  UserInfo, 
  ActionButtons,
  ChatArea,
  MessagesContainer,
  MessageBubble,
  ChatInput,
  ChatAvatar,
  OnlineStatus,
  ActiveChatName,
  ActiveChatStatus
} from '../../styles/Chat/chatStyle'
import { BsTelephone, BsCameraVideo } from 'react-icons/bs'
import { IoSend } from 'react-icons/io5'
import { FiPaperclip, FiSmile } from 'react-icons/fi'
import User3ProfileImg from "../../assets/userImg/User3.png"

const Active: React.FC = () => {
  const [message, setMessage] = useState('')

  const dummyMessages = [
    { id: 1, text: "Hey There....", time: "09:56 am", isOwn: false },
    { id: 2, text: "How are you?", time: "09:57 am", isOwn: false },
    { id: 3, text: "Hello", time: "09:57 am", isOwn: true },
    { id: 4, text: "I'm good, you?", time: "09:57 am", isOwn: true },
    { id: 5, text: "Can we meet today?", time: "09:57 am", isOwn: false },
    { id: 6, text: "Oya nw.", time: "09:57 am", isOwn: true },
  ]

  const activeUser = {
    id: 1,
    name: "eunwo.o_c",
    lastMessage: "Oya nw.",
    time: "Today, 10:09 am",
    avatar: User3ProfileImg,
    unreadCount: 0,
    online: true
  }

  const handleSendMessage = () => {
    if (message.trim()) {
      // Handle sending message
      setMessage('')
    }
  }

  return (
    <ActiveChatContainer>
      <ActiveChatHeader>
        <ChatAvatar>
          <img src={activeUser.avatar} alt={activeUser.name} />
          {activeUser.online && <OnlineStatus />}
        </ChatAvatar>
        
        <UserInfo>
          <ActiveChatName>{activeUser.name}</ActiveChatName>
          <ActiveChatStatus>{activeUser.online ? 'Online' : 'Offline'}</ActiveChatStatus>
        </UserInfo>
        <ActionButtons>
          <button><BsTelephone size={20} /></button>
          <button><BsCameraVideo size={20} /></button>
        </ActionButtons>
      </ActiveChatHeader>

      <ChatArea>
        <MessagesContainer>
          {dummyMessages.map((msg, index) => {
            const isFirstInSequence = index === 0 || dummyMessages[index - 1].isOwn !== msg.isOwn;
            
            return (
              <MessageBubble key={msg.id} isOwn={msg.isOwn}>
                {!msg.isOwn && isFirstInSequence && (
                  <ChatAvatar className="message-avatar">
                    <img src={activeUser.avatar} alt={activeUser.name} />
                  </ChatAvatar>
                )}
                {!msg.isOwn && !isFirstInSequence && <div className="avatar-space" />}
                <div className="message-content">
                  <div className="message">{msg.text}</div>
                  <div className="time">{msg.time}</div>
                </div>
              </MessageBubble>
            );
          })}
        </MessagesContainer>

        <ChatInput>
          <div className="input-container">
            <button><FiPaperclip size={20} /></button>
            <input
              type="text"
              placeholder="Type your message here..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <button><FiSmile size={20} /></button>
            <button onClick={handleSendMessage}><IoSend size={20} /></button>
          </div>
        </ChatInput>
      </ChatArea>
    </ActiveChatContainer>
  )
}

export default Active