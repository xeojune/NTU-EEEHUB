import React from 'react'
import { PostContentContainer, PostContentText } from '../../styles/FeedPosts/PostContentStyle'

interface PostContentProps {
  caption: string;
  points: number;
}

const PostContent: React.FC<PostContentProps> = ({ caption}) => {
  return (
    <PostContentContainer>
        <PostContentText>
            {caption}
        </PostContentText>
    </PostContentContainer>
  )
}

export default PostContent