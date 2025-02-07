import React, { useState } from 'react'
import {
  PostFooterContainer,
  IconGroup,
  IconButton,
  LikesText,
  // CommentText,
  ViewCommentsButton,
  CommentInput,
  CommentSection,
  CommentsButtonContainer
} from '../../styles/FeedPosts/PostFooterStyle'
import { AiOutlineHeart, AiFillHeart, AiOutlineComment, AiOutlineSend } from 'react-icons/ai'
import { GoBookmark } from "react-icons/go";

const PostFooter: React.FC = () => {
  const [liked, setLiked] = useState(false)
  const [likes, setLikes] = useState(19680)

  const toggleLike = () => {
    setLiked((prev) => !prev)
    setLikes((prevLikes) => (liked ? prevLikes - 1 : prevLikes + 1))
  }

  const openCommentsModal = () => {
    alert('Open Comments Modal') // Replace with your modal logic
  }

  const openLikesList = () => {
    alert('Open Likes List') // Replace with your modal logic
  }

  return (
    <PostFooterContainer>
      {/* Icon Section */}
      <IconGroup>
        <IconButton onClick={toggleLike}>
          {liked ? <AiFillHeart size={24} color="red" /> : <AiOutlineHeart size={24} color='white'/>}
        </IconButton>
        <IconButton onClick={openCommentsModal}>
          <AiOutlineComment size={24} color='white'/>
        </IconButton>
        <IconButton>
          <AiOutlineSend size={24} color='white'/>
        </IconButton>
        <IconButton className="bookmark">
          <GoBookmark size={24} color='white'/>
        </IconButton>
      </IconGroup>

      {/* Total Likes */}
      <LikesText onClick={openLikesList}>{likes.toLocaleString()} likes</LikesText>

      {/* Username + Comment */}
      {/* <CommentSection>
        <span>
          <strong>asaprogrammer</strong> My new profile pic. What do you think? ...
        </span>
      </CommentSection> */}

      {/* View All Comments */}
      <CommentsButtonContainer>
        <ViewCommentsButton onClick={openCommentsModal}>View all 23 comments</ViewCommentsButton>
      </CommentsButtonContainer>
      

      {/* Add a Comment Input */}
      <CommentInput type="text" placeholder="Add a comment..." />
    </PostFooterContainer>
  )
}

export default PostFooter
