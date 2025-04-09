import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

export const NotificationContainer = styled.div`
  max-width: 800px;
  margin: 20px auto;
  padding: 20px;
  background: #1f1f27;
  border-radius: 15px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  animation: ${fadeIn} 0.3s ease-out;
`;

export const NotificationHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #2f2f37;

  h1 {
    color: #ffffff;
    font-size: 24px;
    font-weight: 600;
    margin: 0;
  }
`;

export const NotificationItem = styled.div<{ unread: boolean }>`
  display: flex;
  align-items: flex-start;
  gap: 15px;
  padding: 15px;
  background: ${props => props.unread ? '#2a2a35' : '#1f1f27'};
  border: 1px solid ${props => props.unread ? '#3a3a47' : '#2f2f37'};
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: 10px;
  position: relative;

  &:hover {
    background: #2f2f3a;
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  &:active {
    transform: translateY(0);
  }

  ${props => props.unread && `
    &::before {
      content: '';
      position: absolute;
      top: 50%;
      left: -2px;
      transform: translateY(-50%);
      width: 4px;
      height: 4px;
      background: #4a9eff;
      border-radius: 50%;
    }
  `}
`;

export const NotificationAvatar = styled.img`
  width: 45px;
  height: 45px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #2f2f37;
`;

export const NotificationContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

export const NotificationText = styled.p`
  color: #e1e1e6;
  margin: 0;
  font-size: 14px;
  line-height: 1.5;

  strong {
    color: #ffffff;
    font-weight: 600;
  }
`;

export const NotificationTime = styled.span`
  color: #8f8f9d;
  font-size: 12px;
`;

export const EmptyState = styled.div`
  text-align: center;
  padding: 40px;
  color: #8f8f9d;
  font-size: 16px;
  background: #1a1a22;
  border-radius: 10px;
  margin: 20px 0;
`;

const spin = keyframes`
  to {
    transform: rotate(360deg);
  }
`;

export const LoadingSpinner = styled.div`
  text-align: center;
  padding: 40px;
  color: #8f8f9d;
  
  &::before {
    content: '';
    display: block;
    width: 30px;
    height: 30px;
    margin: 0 auto 15px;
    border: 3px solid #2f2f37;
    border-top-color: #4a9eff;
    border-radius: 50%;
    animation: ${spin} 0.8s linear infinite;
  }
`;

export const MarkAllReadButton = styled.button`
  background: #4a9eff;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #3a8eef;
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    background: #2f2f37;
    cursor: not-allowed;
    transform: none;
  }
`;