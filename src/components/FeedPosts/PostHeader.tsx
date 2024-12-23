import React from 'react'
import { PostHeaderContainer, FlexContainer, AvatarImage, TextBox, SubText, OptionsButton, PostInformation, SubTextBox } from '../../styles/FeedPosts/PostHeaderStyle'
import { FiMoreHorizontal } from 'react-icons/fi'
import { FeedPostProps } from '../../types/userType'

const PostHeader: React.FC<Omit<FeedPostProps, 'img'>> = ({username, avatar}) => {
  return (
    <PostHeaderContainer>
      <FlexContainer>
        {/* Avatar */}
        <AvatarImage src={avatar} alt="user profile pic" />

        {/* Username and Subtext */}
        <PostInformation>
          <TextBox>{username}</TextBox>
          <SubTextBox>
            <SubText>1w  · </SubText>
            <SubText color='red'>1200 points</SubText>
          </SubTextBox>
          
        </PostInformation>
      </FlexContainer>

      {/* Options Button */}
      <OptionsButton>
        <FiMoreHorizontal size={24} />
      </OptionsButton>

    </PostHeaderContainer>
  )
}

export default PostHeader
