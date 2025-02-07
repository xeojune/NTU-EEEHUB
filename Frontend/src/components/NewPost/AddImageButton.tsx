import React from 'react';
import styled from 'styled-components';
import { IoAdd } from 'react-icons/io5';

const AddImageButtonContainer = styled.label`
  position: absolute;
  top: 20px;
  right: 20px;
  width: 40px;
  height: 40px;
  background-color: rgba(0, 0, 0, 0.6);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.2s ease;
  z-index: 1000;

  &:hover {
    background-color: rgba(0, 0, 0, 0.8);
  }
`;

const HiddenInput = styled.input`
  display: none;
`;

interface AddImageButtonProps {
  onImageSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const AddImageButton: React.FC<AddImageButtonProps> = ({ onImageSelect }) => {
  return (
    <AddImageButtonContainer>
      <IoAdd size={24} color="white" />
      <HiddenInput
        type="file"
        accept="image/*"
        onChange={onImageSelect}
      />
    </AddImageButtonContainer>
  );
};

export default AddImageButton;