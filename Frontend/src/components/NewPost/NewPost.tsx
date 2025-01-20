import React, { useState } from 'react';
import ModalCard from '../ModalCard';
import { 
  NewPostContainer, 
  NewPostTitle, 
  NewPostOptionSelector, 
  NewPostOptionButton, 
  UploadContainer, 
  InquiryContainer, 
  StyledFileLabel,
  StyledFileInput,
  ImageIconContainer,
  ImageWrapper,
  NavigationHeader,
  NavigationButton
} from '../../styles/NewPost/NewPostStyle';
import Cropper from 'react-easy-crop';
import { IoArrowBack } from "react-icons/io5";

interface NewPostProps {
  onClose: () => void; // Function to close the modal
}

const NewPost: React.FC<NewPostProps> = ({ onClose }) => {
  const [activeOption, setActiveOption] = useState<'upload' | 'inquiry'>('upload');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1.5);

  const handleBack = () => {
    setUploadedImage(null);
    setZoom(1);
  };

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadedImage(URL.createObjectURL(file));
      setZoom(1);
    }
  };

  // Hanlde image crop
  const onCropComplete = (croppedArea: any, croppedAreaPixels: any) => {
    console.log(croppedArea, croppedAreaPixels);
  }

  return (
    <ModalCard width="600px" height="719px" radius="8px" onClose={onClose} background="black">
      {uploadedImage ? (
        <NavigationHeader>
          <NavigationButton onClick={handleBack}>
            <IoArrowBack size={24} />
          </NavigationButton>
          <NewPostTitle>Crop</NewPostTitle>
          <NavigationButton>
            Next
          </NavigationButton>
        </NavigationHeader>
      ) : (
        <NewPostTitle style={{ marginBottom: '20px' }}>Create New Post</NewPostTitle>
      )}

      {/* Option Selector */}
      <NewPostOptionSelector>
        <NewPostOptionButton
          isActive={activeOption === 'upload'}
          onClick={() => setActiveOption('upload')}
        >
          Upload Image
        </NewPostOptionButton>
        <NewPostOptionButton
          isActive={activeOption === 'inquiry'}
          onClick={() => setActiveOption('inquiry')}
        >
          Write Inquiry
        </NewPostOptionButton>
      </NewPostOptionSelector>

      {/* Content Based on Selection */}
      <NewPostContainer>
        {activeOption === 'upload' && (
          <UploadContainer>
            {uploadedImage ? (
              <ImageWrapper>
                {/* <DraggableImage src={uploadedImage} alt="Uploaded" /> */}
                <Cropper
                  image={uploadedImage}
                  crop={crop}
                  zoom={zoom}
                  aspect={1 / 1}
                  onCropChange={setCrop}
                  onCropComplete={onCropComplete}
                  onZoomChange={setZoom}
                  objectFit="horizontal-cover"
                  cropSize={{ width: 600, height: 600 }}
                  // minZoom={1}
                  // maxZoom={5}
                  style={{
                    containerStyle: {
                      width: '600px',
                      height: '600px'
                    }
                  }}
                />
              </ImageWrapper>
            ) : (
              <>
                <ImageIconContainer />
                <p style={{ color: 'white', fontSize: '24px' }}>Drag photos and videos here.</p>
                <StyledFileLabel>
                  Upload Image from your Device
                  <StyledFileInput type="file" accept="image/*" onChange={handleFileUpload} />
                </StyledFileLabel>
              </>
            )}
          </UploadContainer>
        )}

        {activeOption === 'inquiry' && (
          <InquiryContainer>
            <p style={{ color: 'white' }}>Write your inquiry post below:</p>
            <textarea placeholder="Write your inquiry here..." rows={10} />
          </InquiryContainer>
        )}
      </NewPostContainer>
    </ModalCard>
  );
};

export default NewPost;
