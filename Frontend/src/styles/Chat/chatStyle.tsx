import styled from "styled-components";

//Chat Page Style
export const ChatPageContainer = styled.div`
  display: flex;
  width: 100%;
  height: calc(100vh - 60px);
  background-color: #fff;
  overflow: hidden;
`

export const LeftPanel = styled.div`
  flex: 0 0 400px;
  display: flex;
  flex-direction: column;
  border-right: 1px solid #eef2f7;
  background-color: white;
  height: 100%;
  overflow: hidden;
`

export const RightPanel = styled.div`
  flex: 1;
  background-color: white;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  max-height: 100%;
`

//Individual Chat List Style
export const FriendsChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 50%;
  border-bottom: 1px solid #eef2f7;
  
  .chat-list {
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: 0 12px;
    overflow-y: auto;
    
    &::-webkit-scrollbar {
      width: 6px;
    }
    
    &::-webkit-scrollbar-track {
      background: #f1f1f1;
    }
    
    &::-webkit-scrollbar-thumb {
      background: #ddd;
      border-radius: 3px;
      
      &:hover {
        background: #ccc;
      }
    }
  }
`

export const ChatItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 8px;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 8px;
    right: 8px;
    height: 1px;
    background-color: #eef2f7;
  }
  
  &:last-child {
    &::after {
      display: none;
    }
  }
  
  &:hover {
    background-color: #f5f7fb;
  }
`

export const SectionTitle = styled.div`
    padding: 20px;
    font-size: 24px;
    font-weight: 600;
    color: #1a1a1a;
`

export const ChatList = styled.div`
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: 0 12px;
    overflow-y: auto;
    
    &::-webkit-scrollbar {
      width: 6px;
    }
    
    &::-webkit-scrollbar-track {
      background: #f1f1f1;
    }
    
    &::-webkit-scrollbar-thumb {
      background: #ddd;
      border-radius: 3px;
      
      &:hover {
        background: #ccc;
      }
    }
`

export const ChatAvatar = styled.div`
  position: relative;
    width: 48px;
    height: 48px;
    
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      object-fit: cover;
    }
`

export const OnlineStatus = styled.div`
  position: absolute;
      bottom: 2px;
      right: 2px;
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background-color: #22c55e;
      border: 2px solid white;
`

export const ChatInfo = styled.div`
  flex: 1;
  min-width: 0;
`

export const ChatName = styled.div`
  font-weight: bold;
  color: #1a1a1a;
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

export const ChatLastMessage = styled.div`
  font-size: 14px;
  color: #666;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

export const ChatMeta = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
`

export const ChatTime = styled.div`
  font-size: 12px;
  color: #666;
`

export const ChatUnread = styled.div`
  background-color: #0037ff;
  color: white;
  font-size: 12px;
  padding: 2px 6px;
  border-radius: 10px;
  min-width: 20px;
  text-align: center;
`

//Group Chat List Style
export const GroupChatContainer = styled(FriendsChatContainer)`
  height: 50%;
  border-bottom: none;
`

export const MemberCount = styled.div`
  position: absolute;
  bottom: -4px;
  right: -4px;
  background-color: #f5f7fb;
  border: 2px solid white;
  border-radius: 10px;
  padding: 2px 6px;
  font-size: 10px;
  color: #666;
`

//Active Chat Style
export const ActiveChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
`

export const ActiveChatHeader = styled.div`
  display: flex;
  align-items: center;
  padding: 16px 24px;
  border-bottom: 1px solid #eef2f7;
  background-color: white;
  gap: 16px;
`

export const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`

export const ActiveChatName = styled.div`
  font-size: 18px;
  font-weight: 600;
  color: #1a1a1a;
`

export const ActiveChatStatus = styled.div`
  font-size: 14px;
  color: #65676B;
`

export const ActionButtons = styled.div`
  display: flex;
  gap: 16px;
  
  button {
    background: none;
    border: none;
    cursor: pointer;
    padding: 8px;
    border-radius: 50%;
    color: #0066FF;
    
    &:hover {
      background-color: #f5f7fb;
    }
  }
`

export const ChatArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  overflow: hidden;
`

export const MessagesContainer = styled.div`
  flex: 1;
  padding: 24px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-height: 0;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: #f1f1f1;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #ddd;
    border-radius: 3px;
    
    &:hover {
      background: #ccc;
    }
  }
`

export const MessageBubble = styled.div<{ isOwn?: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-direction: ${props => props.isOwn ? 'row-reverse' : 'row'};
  
  .message-avatar {
    width: 32px;
    height: 32px;
    flex-shrink: 0;
    
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      object-fit: cover;
    }
  }

  .avatar-space {
    width: 32px;
    flex-shrink: 0;
  }

  .message-content {
    display: flex;
    gap: 8px;
    align-items: flex-end;
    flex-direction: ${props => props.isOwn ? 'row-reverse' : 'row'};
    max-width: 60%;
  }
  
  .message-avatar {
    width: 32px;
    height: 32px;
    flex-shrink: 0;
    
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      object-fit: cover;
    }
  }

  .message-content {
    display: flex;
    gap: 8px;
    align-items: flex-end;
    flex-direction: ${props => props.isOwn ? 'row-reverse' : 'row'};
    max-width: 60%;
  }
  
  .message {
    background-color: ${props => props.isOwn ? '#0066FF' : '#f0f2f5'};
    color: ${props => props.isOwn ? 'white' : '#1a1a1a'};
    padding: 12px 16px;
    border-radius: 16px;
    font-size: 15px;
  }
  
  .time {
    font-size: 12px;
    color: #65676B;
    white-space: nowrap;
  }
`

export const ChatInput = styled.div`
  padding: 20px;
  border-top: 1px solid #eef2f7;
  background-color: white;
  
  .input-container {
    display: flex;
    align-items: center;
    gap: 12px;
    background-color: #f0f2f5;
    padding: 8px 16px;
    border-radius: 24px;
    
    input {
      flex: 1;
      border: none;
      background: none;
      outline: none;
      padding: 8px 0;
      font-size: 15px;
      
      &::placeholder {
        color: #65676B;
      }
    }
    
    button {
      background: none;
      border: none;
      cursor: pointer;
      padding: 8px;
      color: #0066FF;
      
      &:hover {
        opacity: 0.8;
      }
    }
  }
`