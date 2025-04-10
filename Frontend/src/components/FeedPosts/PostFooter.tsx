import React, { useState, useEffect } from 'react'
import {
  PostFooterContainer,
  IconGroup,
  IconButton,
  LikesText,
  ViewCommentsButton,
  CommentsButtonContainer
} from '../../styles/FeedPosts/PostFooterStyle'
import { AiOutlineHeart, AiFillHeart, AiOutlineComment, AiOutlineSend } from 'react-icons/ai'
import { GoBookmark } from "react-icons/go";
import FeedPostModal from './FeedPostModal';
import { likesApi } from '../../apis/likesApi';
import { useUser } from '../../context/UserContext';

interface PostFooterProps {
  postId: string;
  totalLikes: number;
  totalComments: number;
  postImage: string | string[];
  username?: string;
  points: number;
  distributedPoints?: number;
  date: string;
}

const PostFooter: React.FC<PostFooterProps> = ({ 
  postId,
  totalLikes = 0, 
  totalComments = 0,
  postImage,
  username,
  points,
  distributedPoints = 0,
  date
}) => {
  const { user } = useUser();
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(totalLikes);
  const [isCommentsModalOpen, setIsCommentsModalOpen] = useState(false);
  const [currentDistributedPoints, setCurrentDistributedPoints] = useState(distributedPoints);

  useEffect(() => {
    // Check initial like status when component mounts
    const checkLikeStatus = async () => {
      try {
        if (user?._id) {
          const { isLiked } = await likesApi.getLikeStatus(postId, user._id);
          setLiked(isLiked);
        }
      } catch (error) {
        console.error('Error checking like status:', error);
      }
    };

    checkLikeStatus();
  }, [postId, user?._id]);

  const toggleLike = async () => {
    try {
      if (!user?._id) {
        console.error('User not logged in');
        return;
      }

      const { isLiked } = await likesApi.toggleLike(user._id, postId);
      setLiked(isLiked);
      setLikes((prevLikes) => (isLiked ? prevLikes + 1 : prevLikes - 1));
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const openCommentsModal = () => {
    setIsCommentsModalOpen(true);
  };

  const closeCommentsModal = () => {
    setIsCommentsModalOpen(false);
  };

  const openLikesList = () => {
    alert('Open Likes List'); 
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 7) {
      return `${diffDays}d`;
    } else if (diffDays < 30) {
      return `${Math.floor(diffDays / 7)}w`;
    } else if (diffDays < 365) {
      return `${Math.floor(diffDays / 30)}m`;
    } else {
      return `${Math.floor(diffDays / 365)}y`;
    }
  };

  return (
    <>
      <PostFooterContainer>
        {/* Icons */}
        <IconGroup>
          <IconButton onClick={toggleLike}>
            {liked ? <AiFillHeart size={24} color="red" /> : <AiOutlineHeart size={24} />}
          </IconButton>
          <IconButton onClick={openCommentsModal}>
            <AiOutlineComment size={24} />
          </IconButton>
          <IconButton>
            <AiOutlineSend size={24} />
          </IconButton>
          <IconButton style={{ marginLeft: 'auto' }}>
            <GoBookmark size={24} />
          </IconButton>
        </IconGroup>

        {/* Total Likes */}
        <LikesText onClick={openLikesList}>
          {(likes || 0).toLocaleString()} likes
        </LikesText>

        {/* View All Comments */}
        <CommentsButtonContainer>
          <ViewCommentsButton onClick={openCommentsModal}>
            View all {totalComments || 0} comments
          </ViewCommentsButton>
        </CommentsButtonContainer>
      </PostFooterContainer>

      <FeedPostModal
        isOpen={isCommentsModalOpen}
        onClose={closeCommentsModal}
        postId={postId}
        postImage={postImage}
        username={username}
        points={points}
        distributedPoints={currentDistributedPoints}
        onPointsDistributed={setCurrentDistributedPoints}
        date={formatDate(date)}
      />
    </>
  );
};

export default PostFooter;
