import styled from 'styled-components';

export const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #f0f2f5;
`;

export const ChatHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 20px;
  background-color: #ffffff;
  border-bottom: 1px solid #ddd;

  h2 {
    margin: 0;
    font-size: 1.2rem;
    color: #333;
  }

  button {
    padding: 5px 10px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;

    &:hover {
      background-color: #0056b3;
    }
  }
`;

export const ChatBody = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  background-color: #e4e6eb;
`;

export const MessageList = styled.div`
  display: flex;
  flex-direction: column-reverse;
`;

export const MessageInput = styled.input`
  flex: 1;
  padding: 10px;
  font-size: 1rem;
  border: 1px solid #ddd;
  border-radius: 20px;
  outline: none;
  background-color: #ffffff;

  &:focus {
    border-color: #007bff;
  }
`;

export const SendButton = styled.button`
  padding: 10px 20px;
  margin-left: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 20px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`;

export const ChatFooter = styled.div`
  display: flex;
  align-items: center;
  padding: 10px 20px;
  background-color: #ffffff;
  border-top: 1px solid #ddd;
`;

export const Message = styled.div`
  max-width: 60%;
  margin-bottom: 10px;
  padding: 10px 15px;
  border-radius: 15px;
  font-size: 0.9rem;
  line-height: 1.4;
  word-wrap: break-word;

  &.sent {
    align-self: flex-end;
    background-color: #007bff;
    color: white;
  }

  &.received {
    align-self: flex-start;
    background-color: #ffffff;
    border: 1px solid #ddd;
  }
`;