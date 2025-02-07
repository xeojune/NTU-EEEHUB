import React, { useState } from 'react';
import { FeedPostProps } from '../../types/userType';
import PostHeader from './PostHeader';
import PostContent from './PostContent';
import PostFooter from './PostFooter';
import { IoArrowBack, IoArrowForward } from 'react-icons/io5';
import {
  FeedPostContainer,
  ImageContainer,
  PostImage,
  NavigationButton,
  ImageDots,
  Dot
} from '../../styles/FeedPosts/FeedPostStyle';

const FeedPost: React.FC<FeedPostProps> = ({
  _id,
  imageUrls,
  caption,
  username,
  avatar,
  totalLikes,
  totalComments,
  points,
  centerX,
  centerY,
  createdAt,
  onPostDeleted
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handlePrevImage = () => {
    setCurrentImageIndex(prev => (prev > 0 ? prev - 1 : prev));
  };

  const handleNextImage = () => {
    setCurrentImageIndex(prev => (prev < imageUrls.length - 1 ? prev + 1 : prev));
  };

  const handleDotClick = (index: number) => {
    setCurrentImageIndex(index);
  };

  const handleDelete = async () => {
    try {

      const currentUsername = localStorage.getItem('username');

      const response = await fetch(`http://localhost:3000/api/posts/${_id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: currentUsername }),
      });

      if (response.ok) {
        onPostDeleted?.(_id);
      } else {
        const data = await response.json();
        alert(data.message || 'Failed to delete post');
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Failed to delete post');
    }
  };

  const isCurrentUserPost = localStorage.getItem('username') === username;

  const handleEdit = () => {
    // Implement edit functionality
    console.log('Edit post:', _id);
  };

  return (
    <FeedPostContainer>
      <PostHeader 
        username={username}
        avatar={avatar}
        points={points}
        showActions={isCurrentUserPost}
        createdAt={createdAt}
        onDelete={handleDelete}
        onEdit={handleEdit}
      />
      <PostContent caption={caption} points={points}/>
      <ImageContainer>
        <PostImage 
          src={imageUrls[currentImageIndex]} 
          alt={caption} 
          centerX={centerX} 
          centerY={centerY} 
        />
        {imageUrls.length > 1 && (
          <>
            {currentImageIndex > 0 && (
              <NavigationButton direction="left" onClick={handlePrevImage}>
                <IoArrowBack size={20} />
              </NavigationButton>
            )}
            {currentImageIndex < imageUrls.length - 1 && (
              <NavigationButton direction="right" onClick={handleNextImage}>
                <IoArrowForward size={20} />
              </NavigationButton>
            )}
            <ImageDots>
              {imageUrls.map((_, index) => (
                <Dot
                  key={index}
                  active={index === currentImageIndex}
                  onClick={() => handleDotClick(index)}
                />
              ))}
            </ImageDots>
          </>
        )}
      </ImageContainer>
      <PostFooter totalLikes={totalLikes} totalComments={totalComments}/>
    </FeedPostContainer>
  );
};

export default FeedPost;