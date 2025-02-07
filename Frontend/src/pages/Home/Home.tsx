import React from 'react'
import { Box, Container, Flex, MainContent } from '../../styles/Home/HomeStyle'
import FeedPosts from '../../components/FeedPosts/FeedPosts'
import SuggestedUsers from '../../components/SuggestedUsers/SuggestedUsers'
import Layout from '../Layout'

const Home: React.FC = () => {
  return (
    <Layout>
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
    </Layout>
  )
}

export default Home