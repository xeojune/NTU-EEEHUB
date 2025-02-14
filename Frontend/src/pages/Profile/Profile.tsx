import Layout from "../Layout";
import React, { useEffect, useState } from "react";
import {
    ProfileContainer,
    ProfileInfoContainer,
    ProfileWrapper,
    ProfileImage,
    ProfileInfo,
} from "../../styles/Profile/ProfileStyle";
import User1Image from "../../assets/userImg/User1.png";
import User1BackgroundImage from "../../assets/userImg/User1post.png";
import Like1 from "../../assets/interestImg/chess.png"
import Like2 from "../../assets/interestImg/poker.png"
import Like3 from "../../assets/interestImg/cycling.png"
import Like4 from "../../assets/interestImg/photo.png"
import ProfileBackground from "../../components/Profile/profileBackground";
import Interest from "../../components/Profile/Interest";
import RecentPosts from "../../components/Profile/RecentPosts";

interface Post {
    _id: string;
    username: string;
    caption: string;
    imageUrls: string[];
    points: number;
    totalLikes: number;
    totalComments: number;
    createdAt: string;
}

const Profile: React.FC = () => {
    const [userPosts, setUserPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [backgroundImage, setBackgroundImage] = useState(User1BackgroundImage);
    const currentUsername = localStorage.getItem('username');

    useEffect(() => {
        const fetchUserPosts = async () => {
            try {
                const response = await fetch('http://localhost:3000/api/posts');
                const allPosts = await response.json();
                
                // Filter posts by the current user
                const filteredPosts = allPosts.filter(
                    (post: Post) => post.username === currentUsername
                );
                
                setUserPosts(filteredPosts);
            } catch (error) {
                console.error('Error fetching posts:', error);
            } finally {
                setLoading(false);
            }
        };

        if (currentUsername) {
            fetchUserPosts();
        }
    }, [currentUsername]);

    const handlePostDeleted = (postId: string) => {
        setUserPosts(prevPosts => prevPosts.filter(post => post._id !== postId));
    };

    const handleChangeBackground = () => {
        // You can implement file upload logic here
        console.log('Change background clicked');
        // For now, we'll just log the action
    };

    const handleRemoveBackground = () => {
        setBackgroundImage(''); // Or set to a default background
        console.log('Remove background clicked');
    };

    // Mock data for interests and posts
    const interests = [
        { id: 1, image: Like1 },
        { id: 2, image: Like2 },
        { id: 3, image: Like3 },
        { id: 4, image: Like4 },
    ];

    return (
        <Layout>
            <ProfileContainer>
                <ProfileBackground 
                    backgroundImage={backgroundImage}
                    onChangeBackground={handleChangeBackground}
                    onRemoveBackground={handleRemoveBackground}
                />
                <ProfileInfoContainer>
                    <Interest interests={interests} />

                    <ProfileWrapper>
                        <ProfileImage src={User1Image} alt="Profile" />
                        <ProfileInfo>
                            <h1>{currentUsername}</h1>
                            <p>Rank: Advanced</p>
                            <p>Points: 9200</p>
                        </ProfileInfo>
                    </ProfileWrapper>

                    {loading ? (
                        <div>Loading posts...</div>
                    ) : (
                        <RecentPosts 
                            posts={userPosts.map(post => ({
                                id: post._id,
                                image: post.imageUrls[0],
                                likes: post.totalLikes || 0,
                                comments: post.totalComments || 0
                            }))}
                            onPostDeleted={handlePostDeleted}
                        />
                    )}
                </ProfileInfoContainer>
            </ProfileContainer>
        </Layout>
    );
};

export default Profile;