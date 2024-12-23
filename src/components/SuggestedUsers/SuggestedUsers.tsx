import React from 'react'
import { SeeAllButton, SuggestedBox, SuggestedContainer, SuggestedFooter, SuggestedUsersContainer} from '../../styles/Suggested/SuggestedUsersStyle'
import SuggestedHeader from './SuggestedHeader'
import SuggestedUser from './SuggestedUser'
import User5Img from '../../assets/userImg/User5.png'
import User6Img from '../../assets/userImg/User6.png'
import User7Img from '../../assets/userImg/User7.png'

const SuggestedUsers: React.FC = () => {
  return (
    <SuggestedUsersContainer py={1} px={1} gap={2}>
      <SuggestedHeader />
      <SuggestedContainer>
        <SuggestedBox>
          Suggested For You
        </SuggestedBox>
        <SeeAllButton>See All</SeeAllButton>
      </SuggestedContainer>

      <SuggestedUser name='jxxvvxxk' followers={1392} avatar={User5Img}/>
      <SuggestedUser name='goyounjung' followers={1711} avatar={User6Img}/>
      <SuggestedUser name='39.cho' followers={571} avatar={User7Img}/>

      <SuggestedFooter>
        &copy; 2024 Copy Right All Rights Reserved
      </SuggestedFooter>

    </SuggestedUsersContainer>
  )
}

export default SuggestedUsers