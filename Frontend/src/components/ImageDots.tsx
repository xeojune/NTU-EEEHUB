import React from 'react';
import styled from 'styled-components';

const DotsContainer = styled.div`
  position: absolute;
  bottom: 20px;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: center;
  gap: 8px;
  z-index: 1000;
`;

const Dot = styled.div<{ active: boolean }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: ${props => props.active ? 'white' : 'rgba(255, 255, 255, 0.5)'};
  transition: background-color 0.2s ease;
  cursor: pointer;

  &:hover {
    background-color: ${props => props.active ? 'white' : 'rgba(255, 255, 255, 0.7)'};
  }
`;

interface ImageDotsProps {
  totalImages: number;
  currentIndex: number;
  onDotClick: (index: number) => void;
}

const ImageDots: React.FC<ImageDotsProps> = ({ totalImages, currentIndex, onDotClick }) => {
  return (
    <DotsContainer>
      {Array.from({ length: totalImages }, (_, index) => (
        <Dot
          key={index}
          active={index === currentIndex}
          onClick={() => onDotClick(index)}
        />
      ))}
    </DotsContainer>
  );
};

export default ImageDots;