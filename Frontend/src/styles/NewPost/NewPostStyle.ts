import styled from "styled-components";
import { LuImagePlus } from "react-icons/lu";

export const NewPostContainer = styled.div`
  width: 100%;
  height: 100%;
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

export const NavigationHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 0 15px;
  margin-bottom: 20px;
`;

export const NavigationButton = styled.button`
  background: none;
  border: none;
  color: white;
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
