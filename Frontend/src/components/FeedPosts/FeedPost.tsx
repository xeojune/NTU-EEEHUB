import React from 'react'
import PostHeader from './PostHeader'
import { Box } from '../../styles/Home/HomeStyle'
import PostFooter from './PostFooter'
import PostContent from './PostContent'
import { FeedPostContainer, ImageContainer, PostImage } from '../../styles/FeedPosts/FeedPostStyle'
import { FeedPostProps } from '../../types/userType'


const FeedPost: React.FC<FeedPostProps> = ({img, username, avatar, centerX, centerY}) => {
  return (
    <FeedPostContainer>
        <PostHeader username={username} avatar={avatar}/>
        <PostContent/>
        <Box>
          <ImageContainer>
            {/* Pass centerX and centerY as props */}
            <PostImage src={img} alt={username} centerX={centerX} centerY={centerY} />
          </ImageContainer>
        </Box>
        <PostFooter />
    </FeedPostContainer>
  )
}

export default FeedPost