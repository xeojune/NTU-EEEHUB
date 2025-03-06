import React from 'react';
import Layout from '../Layout';
import PeopleCard from '../../components/Friends/PeopleCard';
import followerData from '../../tests/FollowerList.json';
import followingData from '../../tests/FollowingList.json';
import { CardsContainer, FriendsPageContainer, MoreButton, Section, SectionContainer, SectionTitle } from '../../styles/Friends/FriendsPageStyle';

const FriendsPage: React.FC = () => {
  const handleAddFriend = (userId: string) => {
    // TODO: Implement add friend functionality
    console.log('Adding friend:', userId);
  };

  const handleMoreClick = (section: 'followers' | 'following') => {
    console.log(`Show more ${section}`);
    // TODO: Implement show more functionality
  };

  return (
    <Layout>
      <FriendsPageContainer>
        <Section>
          <SectionContainer>
            <SectionTitle>Followers</SectionTitle>
            <MoreButton onClick={() => handleMoreClick('followers')}>More</MoreButton>
          </SectionContainer>
          <CardsContainer>
            {followerData.followers.map((person) => (
              <PeopleCard
                key={person.id}
                imageUrl={person.imageUrl}
                name={person.name}
                description={person.description}
                onAddFriend={() => handleAddFriend(person.id)}
              />
            ))}
          </CardsContainer>
        </Section>

        <Section>
          <SectionContainer>
            <SectionTitle>Following</SectionTitle>
            <MoreButton onClick={() => handleMoreClick('following')}>More</MoreButton>
          </SectionContainer>
          <CardsContainer>
            {followingData.followings.map((person) => (
              <PeopleCard
                key={person.id}
                imageUrl={person.imageUrl}
                name={person.name}
                description={person.description}
                onAddFriend={() => handleAddFriend(person.id)}
              />
            ))}
          </CardsContainer>
        </Section>
      </FriendsPageContainer>
    </Layout>
  );
};

export default FriendsPage;