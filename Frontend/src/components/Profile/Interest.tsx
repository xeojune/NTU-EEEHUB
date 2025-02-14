import React from 'react';
import {
    LikesInterestWrapper,
    InterestGrid,
} from '../../styles/Profile/ProfileStyle';

interface Interest {
    id: number;
    image: string;
}

interface InterestProps {
    interests: Interest[];
}

const Interest: React.FC<InterestProps> = ({ interests }) => {
    return (
        <LikesInterestWrapper>
            <h2>Likes & Interests</h2>
            <InterestGrid>
                {interests.map(interest => (
                    <img key={interest.id} src={interest.image} alt={`Interest ${interest.id}`} />
                ))}
            </InterestGrid>
        </LikesInterestWrapper>
    );
};

export default Interest;