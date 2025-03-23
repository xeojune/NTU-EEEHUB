import styled from "styled-components";

export const FriendsPageContainer = styled.div`
  padding: 50px;
  background-color: white;
  display: flex;
  flex-direction: column;
  gap: 24px;
  max-width: 1200px;
  margin: 0 auto;
`;

export const Section = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  margin-bottom: 40px;
`;

export const SectionContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 20px;
`;

export const SectionTitle = styled.h2`
  margin: 0 0 24px 0;
  color: #000;
  font-size: 2rem;
  align-self: flex-start;
`;

export const MoreButton = styled.button`
  background: black;
  border: none;
  color: white;
  font-size: 1rem;
  cursor: pointer;
  padding: 8px 16px;
  border-radius: 10px;
  transition: all 0.2s ease;
  align-self: center;
  margin-top: 20px;

  &:hover {
    background-color: #333;
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

export const CardsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  width: 100%;
  align-items: start;
`;