import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { FeedPostProps } from '../../types/postType';
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
  distributedPoints,
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

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/posts/${_id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: currentUsername }),
      });

      if (response.ok) {
        toast.success('Post deleted successfully! 🗑️', {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        onPostDeleted?.(_id);
      } else {
        const data = await response.json();
        toast.error(data.message || 'Failed to delete post', {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      toast.error('Failed to delete post. Please try again.', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
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
      <PostFooter 
        postId={_id}
        totalLikes={totalLikes} 
        totalComments={totalComments}
        postImage={imageUrls}
        username={username}
        points={points}
        distributedPoints={distributedPoints}
        date={createdAt}
      />
    </FeedPostContainer>
  );
};

export default FeedPost;