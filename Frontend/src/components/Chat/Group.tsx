import React from 'react'
import { GroupChatContainer, ChatItem, SectionTitle, ChatList, ChatAvatar, MemberCount, ChatInfo, ChatName, ChatLastMessage, ChatMeta, ChatTime, ChatUnread } from '../../styles/Chat/chatStyle'
import Group1ProfileImg from "../../assets/chatImg/league.png"
import Group2ProfileImg from "../../assets/chatImg/computer.png"
import Group3ProfileImg from "../../assets/chatImg/chess.png"

const Group: React.FC = () => {
  const groupChats = [
    {
      id: 1,
      name: "EEE Final Year",
      lastMessage: "Hahahahahahah....",
      time: "Today, 10:09 am",
      avatar: Group2ProfileImg,
      unreadCount: 15,
      memberCount: 120
    },
    {
      id: 2,
      name: "LOL Chat",
      lastMessage: "Life is about everything.",
      time: "Yesterday, 09:09 am",
      avatar: Group1ProfileImg,
      unreadCount: 21,
      memberCount: 45
    },
    {
      id: 3,
      name: "Chess Club",
      lastMessage: "How about the internship?",
      time: "Today, 12:45 pm",
      avatar: Group3ProfileImg,
      unreadCount: 17,
      memberCount: 67
    }
  ];

  return (
    <GroupChatContainer>
      <SectionTitle>Groups</SectionTitle>
      <ChatList>
        {groupChats.map((chat) => (
          <ChatItem key={chat.id}>
            <ChatAvatar>
              <img src={chat.avatar} alt={chat.name} />
              <MemberCount>{chat.memberCount}</MemberCount>
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
    </GroupChatContainer>
  )
}

export default Group