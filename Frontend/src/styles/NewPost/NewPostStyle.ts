import styled, { keyframes, css } from "styled-components";
import { LuImagePlus } from "react-icons/lu";

export const NewPostContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #181820;
  border-radius: 8px;
  position: relative;
`;

export const NewPostTitle = styled.div`
  font-size: 20px;
  font-weight: 600;
  color: white;
  text-align: center;
`;

export const NewPostOptionSelector = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 20px;
`;

export const NewPostOptionButton = styled.button<{ isActive: boolean }>`
  background-color: ${(props) => (props.isActive ? '#1a73e8' : '#282828')};
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;

  &:hover {
    background-color: ${(props) => (props.isActive ? '#1665c1' : '#383838')};
  }
`;

export const PostContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding: 20px;
  background-color: #181820;
  border-radius: 8px;
`;

export const UploadContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 50px;
  width: 600px;
  height: 600px;
  margin: 0 auto;
`;

export const ImageIconContainer = styled(LuImagePlus)`
    width: 100px;
    height: 100px;
`
export const StyledFileLabel = styled.label`
  background-color: #1a73e8;
  color: white;
  padding: 10px 20px;
  border-radius: 10px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  text-align: center;

  &:hover {
    background-color: #1665c1;
  }
`;

export const StyledFileInput = styled.input`
  display: none; /* Hide the actual file input */
`;

export const ImageWrapper = styled.div`
  width: 600px;
  height: 600px;
  position: relative;
  overflow: hidden;
`;

export const DraggableImage = styled.img`
  width: 100%;
  height: auto;
  position: absolute;
  top: 0;
  left: 0;
  cursor: grab;

  &:active {
    cursor: grabbing;
  }
`;

export const NavigationHeader = styled.div<{ isImageSelected: boolean }>`
  display: flex;
  justify-content: ${(props) => (props.isImageSelected ? 'space-between' : 'center')};
  align-items: center;
  width: 100%;
  padding: 0 15px;
  height: 50px;
  border-bottom: 1px solid #383838;
`;

export const NavigationButton = styled.button<{ color: string }>`
  background: none;
  border: none;
  color: ${(props) => props.color};
  font-size: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 5px;

  &:hover {
    opacity: 0.8;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const InquiryContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;

  textarea {
    width: 90%;
    padding: 10px;
    background-color: #282828;
    border: none;
    border-radius: 4px;
    color: white;
    font-size: 14px;
    outline: none;
  }

  textarea::placeholder {
    color: #b3b3b3;
  }
`;

// Animation keyframes
const expandWidth = keyframes`
  from {
    width: 0;
    opacity: 0;
  }
  to {
    width: 100%;
    opacity: 1;
  }
`;

const collapseWidth = keyframes`
  from {
    width: 100%;
    opacity: 1;
  }
  to {
    width: 0;
    opacity: 0;
  }
`;

// Expanded Section for the caption
export const ExpandedSection = styled.div<{ isExiting?: boolean }>`
  width: 100%;
  height: 600px;
  background-color: #282828;
  display: flex;
  flex-direction: column;
  padding: 20px;
  align-items: flex-start;
  justify-content: flex-start;
  border-left: 1px solid #383838;
  animation: ${props => props.isExiting ? collapseWidth : expandWidth} 0.3s ease-out forwards;
  overflow: hidden;
`;

export const CaptionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 2rem;
  width: 100%;
`;

export const CaptionProfile = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
`;

export const CaptionUsername = styled.p`
  font-size: 16px;
  font-weight: bold;
  color: white;
`;


export const CaptionInput = styled.textarea`
  width: 100%;
  height: 200px;
  background-color: transparent;
  color: white;
  font-size: 16px;
  border: none;
  resize: none;
  outline: none;

  &::placeholder {
    color: #b3b3b3;
  }
`;

export const PointAllocationHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 0;
  margin-bottom: 0;
  width: 100%;
  color: white;
  font-size: 16px;
  border-top: 1px solid #383838;
`;

export const PointAllocationContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  justify-content: space-between;
  width: 100%;
  padding: 15px;
  background-color: #181818;
  border-radius: 4px;
  margin-top: 5px;
`;

export const PointAllocationInput = styled.input`
  width: 100%;
  padding: 8px 12px;
  background-color: #181818;
  border: 1px solid #383838;
  border-radius: 4px;
  color: white;
  font-size: 14px;
  outline: none;

  &::-webkit-inner-spin-button {
    -webkit-appearance: inner-spin-button;
    opacity: 1;
    height: 30px;
    position: relative;
    cursor: pointer;
    display: block;
    border-left: 1px solid #383838;
    background: transparent;
  }

  &::-webkit-outer-spin-button {
    display: none;
  }

  &:focus {
    border-color: #1a73e8;
  }
`;

export const PointAllocationButton = styled.button`
  background-color: #1a73e8;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: background-color 0.2s;

  &:hover {
    background-color: #1557b0;
  }

  &:active {
    background-color: #0d47a1;
  }
`;