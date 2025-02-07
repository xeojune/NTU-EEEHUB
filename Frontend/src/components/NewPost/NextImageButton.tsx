import React from 'react';
import styled from 'styled-components';
import { IoArrowBack, IoArrowForward } from 'react-icons/io5';

const NavigationButtonContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  pointer-events: none;
  z-index: 1000;
`;

const NavigationButton = styled.button`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: rgba(0, 0, 0, 0.6);
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  pointer-events: auto;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: rgba(0, 0, 0, 0.8);
  }
`;

interface ImageNavigationButtonsProps {
  onPrevious: () => void;
  onNext: () => void;
  showPrevious: boolean;
  showNext: boolean;
}

const ImageNavigationButtons: React.FC<ImageNavigationButtonsProps> = ({
  onPrevious,
  onNext,
  showPrevious,
  showNext,
}) => {
  return (
    <NavigationButtonContainer>
      {showPrevious && (
        <NavigationButton onClick={onPrevious}>
          <IoArrowBack size={20} color="white" />
        </NavigationButton>
      )}
      {!showPrevious && <div />} {/* Spacer when no previous button */}
      {showNext && (
        <NavigationButton onClick={onNext}>
          <IoArrowForward size={20} color="white" />
        </NavigationButton>
      )}
      {!showNext && <div />} {/* Spacer when no next button */}
    </NavigationButtonContainer>
  );
};

export default ImageNavigationButtons;