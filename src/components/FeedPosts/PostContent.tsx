import React from 'react'
import { PostContentContainer, PostContentText } from '../../styles/FeedPosts/PostContentStyle'

const PostContent: React.FC = () => {
  return (
    <PostContentContainer>
        <PostContentText>
            This is my new profile picture. What do you think?
        </PostContentText>
    </PostContentContainer>
  )
}

export default PostContent