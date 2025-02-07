import React, { useState } from 'react'
import {
  PostFooterContainer,
  IconGroup,
  IconButton,
  LikesText,
  ViewCommentsButton,
  CommentInput,
  CommentSection,
  CommentsButtonContainer
} from '../../styles/FeedPosts/PostFooterStyle'
import { AiOutlineHeart, AiFillHeart, AiOutlineComment, AiOutlineSend } from 'react-icons/ai'
import { GoBookmark } from "react-icons/go";

interface PostFooterProps {
  totalLikes: number;
  totalComments: number;
}

const PostFooter: React.FC<PostFooterProps> = ({ 
  totalLikes = 0, 
  totalComments = 0 
}) => {
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(totalLikes);

  const toggleLike = () => {
    setLiked((prev) => !prev);
    setLikes((prevLikes) => (liked ? prevLikes - 1 : prevLikes + 1));
  };

  const openCommentsModal = () => {
    alert('Open Comments Modal'); 
  };

  const openLikesList = () => {
    alert('Open Likes List'); 
  };

  return (
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
  );
};

export default PostFooter;
