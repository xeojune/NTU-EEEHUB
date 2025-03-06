import styled from "styled-components";

export const Card = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0;
  max-width: 250px;
  width: 100%;
  height: 350px; 
  position: relative;
  background: white;
`;

export const CoverImage = styled.div`
  width: 100%;
  height: 100px;
  background-color: #1a1a1a;
  position: relative;
  margin-bottom: 30px;
  border-radius: 8px 8px 0 0;
`;

export const ProfileImage = styled.div<{ url: string }>`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-image: url(${props => props.url});
  background-size: cover;
  background-position: center;
  border: 3px solid #fff;
  position: absolute;
  bottom: -30px;
  left: 20px;
`;

export const ContentContainer = styled.div`
  width: 100%;
  height: calc(100% - 100px); 
  display: flex;
  flex-direction: column;
  padding: 16px;
  padding-top: 0;
`;

export const Name = styled.h2`
  font-size: 1.2rem;
  margin: 0;
  color: #000;
  margin-top: 16px;
`;

export const Description = styled.p`
  color: #666;
  margin: 8px 0;
  font-size: 0.9rem;
  flex-grow: 1; 
  overflow-y: auto; 
`;

export const AddFriendButton = styled.button`
  background-color: #000;
  color: white;
  border: none;
  padding: 10px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  margin-top: auto;
  font-size: 0.9rem;

  &:hover {
    background-color: #333;
  }
`;