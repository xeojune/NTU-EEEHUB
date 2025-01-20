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

const Profile: React.FC = () => {
    // Mock data for interests and posts
    const interests = [
        { id: 1, image: User1Image },
        { id: 2, image: User1Image },
        { id: 3, image: User1Image },
        { id: 4, image: User1Image },
    ];

    const posts = [
        { id: 1, image: User1BackgroundImage, text: "Things got easy when you are focused" },
        { id: 2, image: User1BackgroundImage, text: "Love everyone" },
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