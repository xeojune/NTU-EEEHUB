import React from 'react'
import { FriendsChatContainer, ChatItem, SectionTitle, ChatList, ChatAvatar, OnlineStatus, ChatInfo, ChatName, ChatLastMessage, ChatMeta, ChatTime, ChatUnread } from '../../styles/Chat/chatStyle'
import User3ProfileImg from "../../assets/userImg/User3.png"
import User5ProfileImg from "../../assets/userImg/User5.png"
import User6ProfileImg from "../../assets/userImg/User6.png"
import User7ProfileImg from "../../assets/userImg/User7.png"

const Individual: React.FC = () => {
  const individualChats = [
    {
      id: 1,
      name: "eunwo.o_c",
      lastMessage: "Oya nw.",
      time: "Today, 10:09 am",
      avatar: User3ProfileImg,
      unreadCount: 0,
      online: true
    },
    {
      id: 2,
      name: "jxxvvxxk",
      lastMessage: "Good 9te and sweet drmz..",
      time: "Yesterday, 09:09 am",
      avatar: User5ProfileImg,
      unreadCount: 0,
      online: false
    },
    {
      id: 3,
      name: "goyounjung",
      lastMessage: "Doings",
      time: "Today, 12:45 pm",
      avatar: User6ProfileImg,
      unreadCount: 0,
      online: true
    },
    {
      id: 4,
      name: "39.cho",
      lastMessage: "Thank you boss.",
      time: "Today, 09:57 am",
      avatar: User7ProfileImg,
      unreadCount: 0,
      online: false
    }
  ];

  return (
    <FriendsChatContainer>
      <SectionTitle>Friends</SectionTitle>
      <ChatList>
        {individualChats.map((chat) => (
          <ChatItem key={chat.id}>
            <ChatAvatar>
              <img src={chat.avatar} alt={chat.name} />
              {chat.online && <OnlineStatus />}
            </ChatAvatar>
            <ChatInfo>
              <ChatName>{chat.name}</ChatName>
              <ChatLastMessage>{chat.lastMessage}</ChatLastMessage>
            </ChatInfo>
            <ChatMeta>
              <ChatTime>{chat.time}</ChatTime>
              {chat.unreadCount > 0 && (
                <ChatUnread>{chat.unreadCount}</ChatUnread>
              )}
            </ChatMeta>
          </ChatItem>
        ))}
      </ChatList>
    </FriendsChatContainer>
  )
}

export default Individual