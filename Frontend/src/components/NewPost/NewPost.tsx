import React, { useState } from 'react';
import ModalCard from '../ModalCard';
import {
  NewPostContainer,
  NewPostTitle,
  UploadContainer,
  StyledFileLabel,
  StyledFileInput,
  ImageIconContainer,
  ImageWrapper,
  NavigationHeader,
  NavigationButton,
  ExpandedSection,
  CaptionInput,
  CaptionHeader,
  CaptionProfile,
  CaptionUsername,
  PointAllocationContainer,
  PointAllocationInput,
  PointAllocationButton,
  PointAllocationHeader,
} from '../../styles/NewPost/NewPostStyle';
import Cropper from 'react-easy-crop';
import { IoArrowBack } from 'react-icons/io5';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';
import User1Profile from '../../assets/userImg/User1.png';

interface NewPostProps {
  onClose: () => void; // Function to close the modal
}

const NewPost: React.FC<NewPostProps> = ({ onClose }) => {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1.5);
  const [isCaptionVisible, setIsCaptionVisible] = useState(false); // Controls the expanded section
  const [caption, setCaption] = useState(''); // Stores the caption text
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [isCropping, setIsCropping] = useState(true);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const [isExiting, setIsExiting] = useState(false);
  const [points, setPoints] = useState(100);
  const MAX_POINTS = 9000; // User's maximum available points
  const [isPointMenuOpen, setIsPointMenuOpen] = useState(false);

  const handleBack = () => {
    if (isCaptionVisible) {
      setIsExiting(true);
      setTimeout(() => {
        setIsCaptionVisible(false);
        setIsCropping(true);
        setIsExiting(false);
      }, 300); // Match the animation duration
    } else {
      setUploadedImage(null);
      setZoom(1);
      setIsCropping(true);
      setCroppedImage(null);
    }
  };

  const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.addEventListener('load', () => resolve(image));
      image.addEventListener('error', error => reject(error));
      image.src = url;
    });

  const getCroppedImg = async (
    imageSrc: string,
    pixelCrop: any,
  ): Promise<string> => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      throw new Error('No 2d context');
    }

    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

    ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      pixelCrop.width,
      pixelCrop.height,
    );

    return canvas.toDataURL('image/jpeg');
  };

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadedImage(URL.createObjectURL(file));
      setZoom(1);
    }
  };

  // Handle image crop
  const onCropComplete = (croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  // Handle next button
  const handleNext = async () => {
    try {
      if (uploadedImage && croppedAreaPixels) {
        const croppedImageUrl = await getCroppedImg(uploadedImage, croppedAreaPixels);
        setCroppedImage(croppedImageUrl);
        setIsCaptionVisible(true);
        setIsCropping(false);
      }
    } catch (error) {
      console.error('Error cropping image:', error);
    }
  };

  // Handle point change
  const handlePointChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value)) {
      // Ensure points stay within valid range (0 to MAX_POINTS)
      setPoints(Math.min(Math.max(0, value), MAX_POINTS));
    }
  };

  const handleMaxPoints = () => {
    setPoints(MAX_POINTS);
  };

  return (
    <ModalCard width={isCaptionVisible ? '1000px' : '600px'}  radius="8px" onClose={onClose} background="black">
      <NavigationHeader isImageSelected={!!uploadedImage}>
        {uploadedImage && (
          <NavigationButton onClick={handleBack} color='white'>
            <IoArrowBack size={24} />
          </NavigationButton>
        )}
        <NewPostTitle>{isCaptionVisible ? 'Crop' : 'Create new post'}</NewPostTitle>
        {uploadedImage && !isCaptionVisible && (
          <NavigationButton onClick={handleNext} color='#4b8de0'>Next</NavigationButton>
        )}
        {isCaptionVisible && (
          <NavigationButton onClick={() => console.log({ caption, uploadedImage })} color='#4b8de0'>
            Share
          </NavigationButton>
        )}
      </NavigationHeader>
      
      <div style={{ display: 'flex', width: isCaptionVisible ? '1000px' : '600px', transition: 'width 0.3s ease' }}>
        {/* Main Modal Section */}
        <div style={{ flex: '1' }}>
          <NewPostContainer>
            {uploadedImage ? (
              <UploadContainer>
                <ImageWrapper>
                  {isCropping ? (
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
                      style={{
                        containerStyle: {
                          width: '600px',
                          height: '600px',
                        },
                      }}
                    />
                  ) : (
                    <img 
                      src={croppedImage || uploadedImage}
                      alt="Cropped"
                      style={{
                        width: '600px',
                        height: '600px',
                        objectFit: 'contain'
                      }}
                    />
                  )}
                </ImageWrapper>
              </UploadContainer>
            ) : (
              <UploadContainer>
                <ImageIconContainer />
                <p style={{ color: 'white', fontSize: '24px' }}>Drag photos and videos here.</p>
                <StyledFileLabel>
                  Upload Image from your Device
                  <StyledFileInput type="file" accept="image/*" onChange={handleFileUpload} />
                </StyledFileLabel>
              </UploadContainer>
            )}
          </NewPostContainer>
        </div>

        {/* Expanded Section for Caption */}
        {isCaptionVisible && (
          <ExpandedSection isExiting={isExiting}>
            <CaptionHeader>
              <CaptionProfile src={User1Profile} />
              <CaptionUsername>dex_xeb</CaptionUsername>
            </CaptionHeader>
            <CaptionInput
              placeholder="Write your caption here..."
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
            />
            <PointAllocationHeader>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span>Allocate Points</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}> 
                <span style={{ color: '#b3b3b3' }}>{points} points</span>
                <div 
                  onClick={() => setIsPointMenuOpen(!isPointMenuOpen)}
                  style={{ cursor: 'pointer' }}
                >
                  {isPointMenuOpen ? (
                    <IoIosArrowUp size={20} color="#b3b3b3" />
                  ) : (
                    <IoIosArrowDown size={20} color="#b3b3b3" />
                  )}
                </div>
              </div>
              
            </PointAllocationHeader>
            {isPointMenuOpen && (
              <PointAllocationContainer>
                <PointAllocationInput 
                  type="number"
                  value={points}
                  onChange={handlePointChange}
                  min="100"
                  max={MAX_POINTS}
                  step="100"
                />
                <PointAllocationButton onClick={handleMaxPoints}>Max</PointAllocationButton>
              </PointAllocationContainer>
            )}
          </ExpandedSection>
        )}
      </div>
    </ModalCard>
  );
};

export default NewPost;
