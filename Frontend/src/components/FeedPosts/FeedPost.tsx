import React from 'react'
import PostHeader from './PostHeader'
import { Box } from '../../styles/Home/HomeStyle'
import PostFooter from './PostFooter'
import PostContent from './PostContent'
import { FeedPostContainer, ImageContainer, PostImage } from '../../styles/FeedPosts/FeedPostStyle'
import { FeedPostProps } from '../../types/userType'


const FeedPost: React.FC<FeedPostProps> = ({
  _id,
  imageUrl,
  caption,
  username,
  avatar,
  centerX,
  centerY,
  points,
  totalLikes,
  totalComments,
  createdAt,
  onPostDeleted
}) => {
  const handleDelete = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/posts/${_id}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        // Notify parent component to refresh posts
        onPostDeleted?.();
      } else {
        console.error('Failed to delete post');
      }
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

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
        createdAt={createdAt}
        onDelete={handleDelete}
        onEdit={handleEdit}
      />
      <PostContent caption={caption} points={points}/>
      <Box>
        <ImageContainer>
          <PostImage src={imageUrl} alt={caption} centerX={centerX} centerY={centerY} />
        </ImageContainer>
      </Box>
      <PostFooter totalLikes={totalLikes} totalComments={totalComments}/>
    </FeedPostContainer>
  )
}

export default FeedPost