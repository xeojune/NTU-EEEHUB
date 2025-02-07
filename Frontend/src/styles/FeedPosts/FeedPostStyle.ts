import styled from "styled-components";

export const FeedPostContainer = styled.div`
    background: #1f1f27;
    border-radius: 8px;
`;

export const ImageContainer = styled.div`
  width: 100%;
  overflow: hidden; /* Hide any overflow content */
  position: relative; /* Ensures absolute positioning inside if needed */
  padding-top: 100%;

  @media (max-width: 768px) {
    /* Optional: Adjust for smaller screens */
    padding-top: 100%; /* Keeps the 1:1 ratio */
  }
`

export const PostImage = styled.img<{ centerX?: number; centerY?: number }>`
  width: auto;
  height: auto;
  min-width: 100%;
  min-height: 100%;
  position: absolute;
  display: block;
  max-width: 100%;
  object-fit: cover;

  ${({ centerX = 50, centerY = 0 }) => `
    top: ${centerY}%;
    left: ${centerX}%;
    transform: translate(-${centerX}%, -${centerY}%);
  `}
`;

export const NavigationButton = styled.button<{ direction: 'left' | 'right' }>`
  position: absolute;
  ${props => props.direction}: 10px;
  top: 50%;
  transform: translateY(-50%);
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 1;
  transition: background-color 0.2s;

  &:hover {
    background-color: rgba(0, 0, 0, 0.8);
  }
`;

export const ImageDots = styled.div`
  position: absolute;
  bottom: 20px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  gap: 8px;
  z-index: 1;
`;

export const Dot = styled.div<{ active: boolean }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: ${props => props.active ? 'white' : 'rgba(255, 255, 255, 0.5)'};
  transition: background-color 0.2s;
  cursor: pointer;

  &:hover {
    background-color: ${props => props.active ? 'white' : 'rgba(255, 255, 255, 0.7)'};
  }
`;
