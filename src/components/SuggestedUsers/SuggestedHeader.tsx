import React from 'react'
import { LogOutContainer, SuggestedHeaderContainer, SuggestedHeaderWrapper, UserProfileContainer } from '../../styles/Suggested/SuggestedHeaderStyle'
import { AvatarImage } from '../../styles/FeedPosts/PostHeaderStyle'
import avatar from '../../assets/userImg/User1.png'

const SuggestedHeader: React.FC = () => {
  return (
    <SuggestedHeaderWrapper>
        <SuggestedHeaderContainer>
            <AvatarImage src={avatar} alt="user profile pic" width='40px' height='40px'/>
            <UserProfileContainer>
                dex_xeb
            </UserProfileContainer>
        </SuggestedHeaderContainer>
        <LogOutContainer to={'/login'}>
            Log out
        </LogOutContainer>
    </SuggestedHeaderWrapper>
  )
}

export default SuggestedHeader