import Layout from "../Layout";
import React from "react";
import {
    BackgroundImage,
    BackgroundImageWrapper,
    ProfileContainer,
    ProfileInfoContainer,
    ProfileWrapper,
    ProfileImage,
    ProfileInfo,
    LikesInterestWrapper,
    InterestGrid,
    PostWrapper,
    PostGrid
} from "../../styles/Profile/ProfileStyle";
import User1Image from "../../assets/userImg/User1.png";
import User1BackgroundImage from "../../assets/userImg/User1post.png";


import Like1 from "../../assets/interestImg/chess.png"
import Like2 from "../../assets/interestImg/poker.png"
import Like3 from "../../assets/interestImg/cycling.png"
import Like4 from "../../assets/interestImg/photo.png"

const Profile: React.FC = () => {
    // Mock data for interests and posts
    const interests = [
        { id: 1, image: Like1 },
        { id: 2, image: Like2 },
        { id: 3, image: Like3 },
        { id: 4, image: Like4 },
    ];

    const posts = [
        { id: 1, image: User1BackgroundImage, text: "This is my new profile picture. What do you think?" },
    ];

    return (
        <Layout>
            <ProfileContainer>
                <BackgroundImageWrapper>
                    <BackgroundImage src={User1BackgroundImage} alt="Background" />
                </BackgroundImageWrapper>
                
                <ProfileInfoContainer>
                    <LikesInterestWrapper>
                        <h2>Likes & Interests</h2>
                        <InterestGrid>
                            {interests.map(interest => (
                                <img key={interest.id} src={interest.image} alt={`Interest ${interest.id}`} />
                            ))}
                        </InterestGrid>
                    </LikesInterestWrapper>

                    <ProfileWrapper>
                        <ProfileImage src={User1Image} alt="Profile" />
                        <ProfileInfo>
                            <h1>dex_xeb</h1>
                            <p>Rank: Advanced</p>
                            <p>Points: 9200</p>
                        </ProfileInfo>
                    </ProfileWrapper>

                    <PostWrapper>
                        <h2>Recent Posts</h2>
                        <PostGrid>
                            {posts.map(post => (
                                <div key={post.id} className="post">
                                    <img src={post.image} alt={`Post ${post.id}`} />
                                    <p>{post.text}</p>
                                </div>
                            ))}
                        </PostGrid>
                    </PostWrapper>
                </ProfileInfoContainer>
            </ProfileContainer>
        </Layout>
    );
};

export default Profile;