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
import { createPost, CreatePostResponse } from '../../apis/createPostApi';
import AddImageButton from './AddImageButton';
import NextImageButton from './NextImageButton';
import ImageDots from '../ImageDots'

interface NewPostProps {
  onClose: () => void; // Function to close the modal
  onPostCreated?: () => void;
}

const NewPost: React.FC<NewPostProps> = ({ onClose, onPostCreated }) => {
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [crops, setCrops] = useState<{ x: number, y: number }[]>([]);
  const [zoom, setZoom] = useState(1);
  const [isCaptionVisible, setIsCaptionVisible] = useState(false); // Controls the expanded section
  const [caption, setCaption] = useState(''); // Stores the caption text
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any[]>([]);
  const [isCropping, setIsCropping] = useState(true);
  const [croppedImages, setCroppedImages] = useState<string[]>([]);
  const [isExiting, setIsExiting] = useState(false);
  const [points, setPoints] = useState(100);
  const MAX_POINTS = 9000; // User's maximum available points
  const [isPointMenuOpen, setIsPointMenuOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageDimensions, setImageDimensions] = useState<Array<{ width: number; height: number }>>([]);

  const username = localStorage.getItem('username');

  // Function to get image dimensions
  const getImageDimensions = (url: string): Promise<{ width: number; height: number }> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        resolve({
          width: img.width,
          height: img.height
        });
      };
      img.src = url;
    });
  };

  // Handle Back Button 
  const handleBack = () => {
    if (isCaptionVisible) {
      setIsExiting(true);
      setTimeout(() => {
        setIsCaptionVisible(false);
        setIsCropping(true);
        setIsExiting(false);
      }, 300); // Match the animation duration
    } else {
      setUploadedImages([]);
      setFiles([]);
      setZoom(1);
      setIsCropping(true);
      setCroppedImages([]);
    }
  };

  // Helper function to load and create an image
  const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.addEventListener('load', () => resolve(image));
      image.addEventListener('error', error => reject(error));
      image.src = url;
    });

  // Helper function to crop the image
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
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      const newUrls = newFiles.map(file => URL.createObjectURL(file));
      
      // Get dimensions for all new images
      const dimensions = await Promise.all(
        newUrls.map(url => getImageDimensions(url))
      );
      
      setImageDimensions(prev => [...prev, ...dimensions]);
      setFiles(prev => [...prev, ...newFiles]);
      setUploadedImages(prev => [...prev, ...newUrls]);
      setCrops(prev => [...prev, ...newFiles.map(() => ({ x: 0, y: 0 }))]);
      setCroppedAreaPixels(prev => [...prev, ...newFiles.map(() => null)]);
    }
  };

  // Handle additional image upload
  const handleAdditionalImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFile = e.target.files[0];
      const newUrl = URL.createObjectURL(newFile);
      
      // Get dimensions for the new image
      const dimension = await getImageDimensions(newUrl);
      
      setImageDimensions(prev => [...prev, dimension]);
      setFiles(prev => [...prev, newFile]);
      setUploadedImages(prev => [...prev, newUrl]);
      setCrops(prev => [...prev, { x: 0, y: 0 }]);
      setCroppedAreaPixels(prev => [...prev, null]);
    }
  };

  // Inside your NewPost component, add these functions:
  const handlePreviousImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(prev => prev - 1);
    }
  };

  const handleNextImage = () => {
    if (currentImageIndex < uploadedImages.length - 1) {
      setCurrentImageIndex(prev => prev + 1);
    }
  };

  const handleDotClick = (index: number) => {
    setCurrentImageIndex(index);
  };

  // Handle image crop
  const onCropComplete = (croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(prev => {
      const newCroppedAreaPixels = [...prev];
      newCroppedAreaPixels[currentImageIndex] = croppedAreaPixels;
      return newCroppedAreaPixels;
    });
  };

  // Handle next button
  const handleNext = async () => {
    try {
      if (uploadedImages[currentImageIndex] && croppedAreaPixels[currentImageIndex]) {
        const croppedImageUrl = await getCroppedImg(
          uploadedImages[currentImageIndex],
          croppedAreaPixels[currentImageIndex]
        );
        setCroppedImages(prev => {
          const newCroppedImages = [...prev];
          newCroppedImages[currentImageIndex] = croppedImageUrl;
          return newCroppedImages;
        });

        if (currentImageIndex < uploadedImages.length - 1) {
          setCurrentImageIndex(prev => prev + 1);
        } else {
          setIsCaptionVisible(true);
          setIsCropping(false);
        }
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

  // Handle Max Points
  const handleMaxPoints = () => {
    setPoints(MAX_POINTS);
  };

  const handleSubmit = async () => {
    if (!uploadedImages.length || !caption) {
      return;
    }

    try {
      setIsSubmitting(true);
      // Create cropped files for all images
      const croppedFiles = await Promise.all(
        uploadedImages.map(async (image, index) => {
          const croppedImage = await getCroppedImg(
            image,
            croppedAreaPixels[index]
          );
          if (!croppedImage) {
            throw new Error('Failed to crop image');
          }
          // Convert base64 to file
          const base64Response = await fetch(croppedImage);
          const blob = await base64Response.blob();
          return new File([blob], `image-${index}.jpg`, { type: 'image/jpeg' });
        })
      );

      const username = localStorage.getItem('username');
      if (!username) {
        throw new Error('User not logged in');
      }

      const result = await createPost(croppedFiles, caption, points, username);
      
      // Reset all states
      setUploadedImages([]);
      setFiles([]);
      setCaption('');
      setPoints(100);
      setIsCaptionVisible(false);
      setCurrentImageIndex(0);
      setCroppedImages([]);

      if (onPostCreated) {
        onPostCreated();
      }
      
      // Close the modal
      onClose();
    } catch (error) {
      console.error('Error submitting post:', error);
      alert('Failed to create post. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ModalCard width={isCaptionVisible ? '1000px' : '600px'} radius="8px" onClose={onClose} background="black">
      <NavigationHeader isImageSelected={!!uploadedImages.length}>
        {uploadedImages.length > 0 && (
          <NavigationButton onClick={handleBack} color='white'>
            <IoArrowBack size={24} />
          </NavigationButton>
        )}
        <NewPostTitle>{isCaptionVisible ? 'Crop' : 'Create new post'}</NewPostTitle>
        {uploadedImages.length > 0 && !isCaptionVisible && (
          <NavigationButton onClick={handleNext} color='#4b8de0'>Next</NavigationButton>
        )}
        {isCaptionVisible && (
          <NavigationButton
            onClick={handleSubmit}
            disabled={!caption || isSubmitting}
            style={{ marginLeft: 'auto' }}
            color="#1a73e8"
          >
            {isSubmitting ? 'Posting...' : 'Share'}
          </NavigationButton>
        )}
      </NavigationHeader>
      
      <div style={{ display: 'flex', width: isCaptionVisible ? '1000px' : '600px', transition: 'width 0.3s ease' }}>
        {/* Main Modal Section */}
        <div style={{ flex: '1' }}>
          <NewPostContainer>
            {uploadedImages.length > 0 ? (
              <UploadContainer>
                <ImageWrapper>
                  {isCropping ? (
                    <>
                      <Cropper
                        image={uploadedImages[currentImageIndex]}
                        crop={crops[currentImageIndex]}
                        zoom={zoom}
                        aspect={1 / 1}
                        onCropChange={(crop) => {
                          const newCrops = [...crops];
                          newCrops[currentImageIndex] = crop;
                          setCrops(newCrops);
                        }}
                        onCropComplete={onCropComplete}
                        onZoomChange={setZoom}
                        /* If width < height, uses horizontal-cover, if height < width, uses vertical-cover */
                        objectFit={imageDimensions[currentImageIndex]?.width < imageDimensions[currentImageIndex]?.height ? 'horizontal-cover' : 'vertical-cover'}
                        cropSize={{ width: 600, height: 600 }}
                      />
                      <AddImageButton onImageSelect={handleAdditionalImage} />
                      <NextImageButton
                        onPrevious={handlePreviousImage}
                        onNext={handleNextImage}
                        showPrevious={currentImageIndex > 0}
                        showNext={currentImageIndex < uploadedImages.length - 1}
                      />
                      <ImageDots
                        totalImages={uploadedImages.length}
                        currentIndex={currentImageIndex}
                        onDotClick={handleDotClick}
                      />
                    </>
                  ) : (
                    <img 
                      src={croppedImages[currentImageIndex] || uploadedImages[currentImageIndex]}
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
                  <StyledFileInput 
                    type="file" 
                    accept="image/*" 
                    onChange={handleFileUpload} 
                    multiple
                  />
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
              <CaptionUsername>{username}</CaptionUsername>
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
