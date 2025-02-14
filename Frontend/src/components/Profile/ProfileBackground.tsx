import React, { useState } from 'react';
import {
    BackgroundImage,
    BackgroundImageWrapper,
} from '../../styles/Profile/ProfileStyle';
import ModalCard from '../ModalCard';
import styled from 'styled-components';
import { FiMoreHorizontal } from 'react-icons/fi';

interface ProfileBackgroundProps {
    backgroundImage: string;
    onChangeBackground?: () => void;
    onRemoveBackground?: () => void;
}

const OptionButton = styled.button`
  width: 100%;
  height: 48px;
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 14px;
  color: ${props => props.color || '#fff'};
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;

const OptionsButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(0, 0, 0, 0.5);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: white;
  z-index: 1;

  &:hover {
    background: rgba(0, 0, 0, 0.7);
  }
`;

const ProfileBackground: React.FC<ProfileBackgroundProps> = ({ 
    backgroundImage, 
    onChangeBackground, 
    onRemoveBackground 
}) => {
    const [showModal, setShowModal] = useState(false);

    return (
        <BackgroundImageWrapper>
            <OptionsButton onClick={() => setShowModal(true)}>
                <FiMoreHorizontal size={24} />
            </OptionsButton>
            
            {showModal && (
                <ModalCard top="0" onClose={() => setShowModal(false)}>
                    {onChangeBackground && (
                        <OptionButton onClick={() => {
                            onChangeBackground();
                            setShowModal(false);
                        }}>
                            Change Background Image
                        </OptionButton>
                    )}
                    {onRemoveBackground && (
                        <OptionButton 
                            color="#FF453A"
                            onClick={() => {
                                onRemoveBackground();
                                setShowModal(false);
                            }}
                        >
                            Remove Background Image
                        </OptionButton>
                    )}
                </ModalCard>
            )}
            <BackgroundImage src={backgroundImage} alt="Background" />
        </BackgroundImageWrapper>
    );
};

export default ProfileBackground;