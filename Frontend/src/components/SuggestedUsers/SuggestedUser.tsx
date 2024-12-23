import React, { useState } from 'react'
import { SuggestedUserProps } from '../../types/suggestType'
import { AvatarInfoContainer, FollowButton, SuggestedUserContainer, SuggestedUserFollowers, SuggestedUserName, SuggestedUserProfileContainer } from '../../styles/Suggested/SuggestedUserStyle'
import { AvatarImage } from '../../styles/FeedPosts/PostHeaderStyle'

const SuggestedUser: React.FC<SuggestedUserProps> = ({name, followers, avatar}) => {
  const [isFollowing, setIsFollowing] = useState(false);
  return (
    <SuggestedUserContainer>
        <AvatarInfoContainer>
            <AvatarImage src={avatar} alt='suggested user profile pic' width='40px' height='40px'/>
            <SuggestedUserProfileContainer>
                <SuggestedUserName>{name}</SuggestedUserName>
                <SuggestedUserFollowers>{followers} followers</SuggestedUserFollowers>
            </SuggestedUserProfileContainer>
        </AvatarInfoContainer>
        <FollowButton onClick={() => setIsFollowing(!isFollowing)}>
            {isFollowing ? 'UnFollow' : 'Follow'}
        </FollowButton>

    </SuggestedUserContainer>
  )
}

export default SuggestedUser