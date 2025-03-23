import Layout from "../Layout";
import React, { useEffect, useState, useRef } from "react";
import {
    ProfileContainer,
    ProfileInfoContainer,
    ProfileWrapper,
    ProfileImage,
    ProfileInfo,
    ProfileImageContainer,
    HiddenFileInput,
} from "../../styles/Profile/ProfileStyle";
import Like1 from "../../assets/interestImg/chess.png"
import Like2 from "../../assets/interestImg/poker.png"
import Like3 from "../../assets/interestImg/cycling.png"
import Like4 from "../../assets/interestImg/photo.png"
import ProfileBackground from "../../components/Profile/ProfileBackground";
import Interest from "../../components/Profile/Interest";
import RecentPosts from "../../components/Profile/RecentPosts";
import { FaCamera } from 'react-icons/fa';
import { useUser } from '../../context/UserContext';

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
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const backgroundFileInputRef = useRef<HTMLInputElement>(null);
    const currentUsername = localStorage.getItem('username');
    const userId = localStorage.getItem('userId'); // Make sure you store userId during login
    const { profileImage, backgroundImage, setProfileImage, setBackgroundImage, points, user, fetchUserProfile } = useUser();

    //handle concurrent fetching with Promise.all (before had 2 useEffect)
    useEffect(() => {
        const fetchData = async () => {
            if (!userId || !currentUsername) return;
            
            setLoading(true);
            try {
                // Fetch user profile to get updated follower/following counts
                await fetchUserProfile();
                
                const response = await fetch(`http://localhost:3000/api/posts?userId=${userId}`);
                const allPosts = await response.json();

                // Filter posts by the current user
                const filteredPosts = allPosts.filter(
                    (post: Post) => post.username === currentUsername
                );
                
                setUserPosts(filteredPosts);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [userId, currentUsername, fetchUserProfile]);

    const handlePostDeleted = (postId: string) => {
        setUserPosts(prevPosts => prevPosts.filter(post => post._id !== postId));
    };

    const handleChangeBackground = () => {
        backgroundFileInputRef.current?.click();
    };

    const handleBackgroundFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file || !userId) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('image', file);

        try {
            const response = await fetch(`http://localhost:3000/users/${userId}/background-image`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Failed to upload background image');
            }

            const imageUrl = await response.text();
            setBackgroundImage(imageUrl);
        } catch (error) {
            console.error('Error uploading background image:', error);
            alert('Failed to upload background image. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    const handleRemoveBackground = async () => {
        if (!userId) return;
        
        try {
            const response = await fetch(`http://localhost:3000/users/${userId}/background-image`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to remove background image');
            }

            setBackgroundImage('');
        } catch (error) {
            console.error('Error removing background image:', error);
            alert('Failed to remove background image. Please try again.');
        }
    };

    const handleProfileImageClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file || !userId) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('image', file);

        try {
            const response = await fetch(`http://localhost:3000/users/${userId}/profile-image`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Failed to upload image');
            }

            const imageUrl = await response.text();
            setProfileImage(imageUrl);
        } catch (error) {
            console.error('Error uploading profile image:', error);
            alert('Failed to upload profile image. Please try again.');
        } finally {
            setUploading(false);
        }
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
                <HiddenFileInput
                    ref={backgroundFileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleBackgroundFileChange}
                />
                <ProfileInfoContainer>
                    <Interest interests={interests} />

                    <ProfileWrapper>
                        <ProfileImageContainer onClick={handleProfileImageClick}>
                            <ProfileImage 
                                src={profileImage} 
                                alt="Profile"
                                style={{ opacity: uploading ? 0.5 : 1 }}
                            />
                            <FaCamera className="camera-icon" />
                            <HiddenFileInput
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                            />
                        </ProfileImageContainer>
                        <ProfileInfo>
                            <h1>{currentUsername}</h1>
                            <p>{user?.followerCount || 0} Followers · {user?.followingCount || 0} Following</p>
                            <p>Rank: Advanced</p>
                            <p>Points: {points}</p>
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