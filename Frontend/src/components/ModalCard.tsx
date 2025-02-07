import React from 'react';
import styled from 'styled-components';

interface ModalCardProps {
  width?: string;
  height?: string;
  radius?: string;
  background?: string;
  color?: string;
  top?: string;
  children?: React.ReactNode;
  onClose?: () => void;
}

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5); /* Backdrop */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
`;

const ModalContainer = styled.div<ModalCardProps>`
  background-color: ${(props) => props.background || '#181820'};
  width: ${(props) => props.width || '400px'};
  height: ${(props) => props.height || 'auto'};
  border-radius: ${(props) => props.radius || '8px'};
  color: ${(props) => props.color || '#fff'};
  padding-top: ${(props) => props.top || '20px'};
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
`;

const ModalCard: React.FC<ModalCardProps> = ({
  width,
  height,
  radius,
  background,
  top,
  children,
  onClose,
}) => {
  return (
    <ModalOverlay onClick={onClose}>
      <ModalContainer
        width={width}
        height={height}
        radius={radius}
        background={background}
        top={top}
        onClick={(e) => {
          e.stopPropagation(); // Stops the click event from propagating to the overlay
        }}
      >
        {children}
      </ModalContainer>
    </ModalOverlay>
  );
};

export default ModalCard;
