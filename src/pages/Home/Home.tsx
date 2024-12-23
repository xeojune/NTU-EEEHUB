import React from 'react'
import Header from '../../components/Header/Header'
import SideBar from '../../components/SideBar/SideBar'
import { Box, Container, Flex, MainContent } from '../../styles/Home/HomeStyle'
import FeedPosts from '../../components/FeedPosts/FeedPosts'
import SuggestedUsers from '../../components/SuggestedUsers/SuggestedUsers'

const Home: React.FC = () => {
  return (
    <div>
      <Header />
      <SideBar />
      <MainContent>
        <Container>
          <Flex>
            <Box 
              flex={2} 
              padding='20px'
              
            >
              <FeedPosts/>
            </Box>

            <Box 
              flex={3}
              marginRight='20px'
              maxWidth='300px'
              display={{ base: 'none', lg: 'block' }}
              padding='20px'
            >
              <SuggestedUsers/>
            </Box>
          </Flex>
        </Container>
      </MainContent>
    </div>
  )
}

export default Home