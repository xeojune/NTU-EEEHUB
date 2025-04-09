import Layout from "../Layout";
import React, { useEffect, useState, useRef } from "react";
import {
    ProfileContainer,
    ProfileInfoContainer,
    ProfileWrapper,
    ProfileImage,
    ProfileImageContainer,
    HiddenFileInput,
    RankingBar,
    RankingSection,
    StatsText,
    RankText,
    PointsText,
    ProfileInfo,
    RankFrame,
} from "../../styles/Profile/ProfileStyle";
import Like1 from "../../assets/interestImg/chess.png"
import Like2 from "../../assets/interestImg/poker.png"
import Like3 from "../../assets/interestImg/cycling.png"
import Like4 from "../../assets/interestImg/photo.png"
import ProfileBackground from "../../components/Profile/ProfileBackground";
import Interest from "../../components/Profile/Interest";
import RecentPosts from "../../components/Profile/RecentPosts";
import { FaCamera } from 'react-icons/fa';
import { FaUsers, FaUserFriends, FaStar } from 'react-icons/fa';
import { 
    GiBabyFace, 
    GiFarmer,
    GiNinjaHeroicStance,
    GiNinjaMask,
    GiNinjaHead,
    GiSupersonicArrow,
    GiCrownedExplosion,
    GiLightningHelix,
    GiPlantRoots,
    GiWhirlwind,
    GiFireBowl,
    GiMoonOrbit,
    GiSun,
    GiGalaxy,
    GiAngelWings,
    GiHeavenGate
} from 'react-icons/gi';
import { useUser } from '../../context/UserContext';

// Import rank frame images
import Level1Frame from "../../assets/rankImg/Level=1.png";
import Level2Frame from "../../assets/rankImg/Level=2.png";
import Level3Frame from "../../assets/rankImg/Level=3.png";
import Level4Frame from "../../assets/rankImg/Level=4.png";
import Level5Frame from "../../assets/rankImg/Level=5.png";
import Level6Frame from "../../assets/rankImg/Level=6.png";

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

    const getRankColor = (rank: string) => {
        switch (rank) {
            case 'Beginner':
                return '#FFD700';
            case 'Civilian':
                return '#FFA500';
            case 'Novice':
                return '#90EE90';
            case 'Intermediate':
                return '#90EE90';
            case 'Advanced':
                return '#90EE90';
            case 'Hero':
                return '#87CEEB';
            case 'Supreme':
                return '#87CEEB';
            case 'Superhuman':
                return '#87CEEB';
            case 'Plant God':
                return '#00CED1';
            case 'Wind God':
                return '#00CED1';
            case 'Fire God':
                return '#FFA07A';
            case 'Moon God':
                return '#FFA07A';
            case 'Sun God':
                return '#DDA0DD';
            case 'Space God':
                return '#DDA0DD';
            case 'Guardian God':
                return '#9370DB';
            case 'Absolute God':
                return '#9370DB';
            default:
                return '#FFD700';
        }
    };

    const getRankIcon = (rank: string) => {
        switch (rank) {
            case 'Beginner':
                return <GiBabyFace />;
            case 'Civilian':
                return <GiFarmer />;
            case 'Novice':
                return <GiNinjaHeroicStance />;
            case 'Intermediate':
                return <GiNinjaMask />;
            case 'Advanced':
                return <GiNinjaHead />;
            case 'Hero':
                return <GiSupersonicArrow />;
            case 'Supreme':
                return <GiCrownedExplosion />;
            case 'Superhuman':
                return <GiLightningHelix />;
            case 'Plant God':
                return <GiPlantRoots />;
            case 'Wind God':
                return <GiWhirlwind />;
            case 'Fire God':
                return <GiFireBowl />;
            case 'Moon God':
                return <GiMoonOrbit />;
            case 'Sun God':
                return <GiSun />;
            case 'Space God':
                return <GiGalaxy />;
            case 'Guardian God':
                return <GiAngelWings />;
            case 'Absolute God':
                return <GiHeavenGate />;
            default:
                return <GiBabyFace />;
        }
    };

    const getRankFrame = (rank: string) => {
        switch (rank) {
            case 'Beginner':
            case 'Civilian':
                return Level1Frame;
            case 'Novice':
            case 'Intermediate':
            case 'Advanced':
                return Level2Frame;
            case 'Hero':
            case 'Supreme':
            case 'Superhuman':
                return Level3Frame;
            case 'Plant God':
            case 'Wind God':
            case 'Fire God':
                return Level4Frame;
            case 'Moon God':
            case 'Sun God':
            case 'Space God':
                return Level5Frame;
            case 'Guardian God':
            case 'Absolute God':
                return Level6Frame;
            default:
                return Level1Frame;
        }
    };

    //handle concurrent fetching with Promise.all (before had 2 useEffect)
    useEffect(() => {
        const fetchData = async () => {
            if (!userId || !currentUsername) return;
            
            setLoading(true);
            try {
                // Fetch user profile to get updated follower/following counts and ranking
                await fetchUserProfile();
                
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/posts?userId=${userId}`);
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
            const response = await fetch(`${import.meta.env.VITE_API_URL}/users/${userId}/background-image`, {
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
            const response = await fetch(`${import.meta.env.VITE_API_URL}/users/${userId}/background-image`, {
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
            const response = await fetch(`${import.meta.env.VITE_API_URL}/users/${userId}/profile-image`, {
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
                            <RankFrame 
                                src={getRankFrame(user?.ranking || 'Beginner')} 
                                alt="Rank Frame" 
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
                            <h1 style={{marginBottom: '2rem' }}>{currentUsername}</h1>
                            <div>
                                <StatsText>
                                    <FaUsers style={{ verticalAlign: 'middle', marginRight: '4px' }} />
                                    Followers <span>{user?.followerCount || 0}</span>
                                </StatsText>
                                <StatsText>
                                    <FaUserFriends style={{ verticalAlign: 'middle', marginRight: '4px' }} />
                                    Following <span>{user?.followingCount || 0}</span>
                                </StatsText>
                            </div>
                            <RankText rankColor={getRankColor(user?.ranking || 'Beginner')}>
                                <span className="rank-icon">
                                    {getRankIcon(user?.ranking || 'Beginner')}
                                </span>
                                {user?.ranking || 'Beginner'}
                            </RankText>
                            <PointsText rankColor={getRankColor(user?.ranking || 'Beginner')}>
                                <FaStar className="points-icon" />
                                {points?.toLocaleString()} Points
                            </PointsText>
                            <RankingBar>
                                <RankingSection color="#FFD700" width="10%" text="Beginner" points="0" isCurrentRank={user?.ranking === 'Beginner'}>
                                    <GiBabyFace className="rank-icon" />
                                </RankingSection>
                                <RankingSection color="#FFA500" width="10%" text="Civilian" points="1,501" isCurrentRank={user?.ranking === 'Civilian'}>
                                    <GiFarmer className="rank-icon" />
                                </RankingSection>
                                <RankingSection color="#90EE90" width="10%" text="Novice" points="5,000" isCurrentRank={user?.ranking === 'Novice'}>
                                    <GiNinjaHeroicStance className="rank-icon" />
                                </RankingSection>
                                <RankingSection color="#90EE90" width="10%" text="Intermediate" points="10,000" isCurrentRank={user?.ranking === 'Intermediate'}>
                                    <GiNinjaMask className="rank-icon" />
                                </RankingSection>
                                <RankingSection color="#90EE90" width="10%" text="Advanced" points="50,000" isCurrentRank={user?.ranking === 'Advanced'}>
                                    <GiNinjaHead className="rank-icon" />
                                </RankingSection>
                                <RankingSection color="#87CEEB" width="10%" text="Hero" points="75,000" isCurrentRank={user?.ranking === 'Hero'}>
                                    <GiSupersonicArrow className="rank-icon" />
                                </RankingSection>
                                <RankingSection color="#87CEEB" width="10%" text="Supreme" points="90,000" isCurrentRank={user?.ranking === 'Supreme'}>
                                    <GiCrownedExplosion className="rank-icon" />
                                </RankingSection>
                                <RankingSection color="#87CEEB" width="10%" text="Superhuman" points="100,001" isCurrentRank={user?.ranking === 'Superhuman'}>
                                    <GiLightningHelix className="rank-icon" />
                                </RankingSection>
                                <RankingSection color="#00CED1" width="10%" text="Plant God" points="200,000" isCurrentRank={user?.ranking === 'Plant God'}>
                                    <GiPlantRoots className="rank-icon" />
                                </RankingSection>
                                <RankingSection color="#00CED1" width="10%" text="Wind God" points="400,000" isCurrentRank={user?.ranking === 'Wind God'}>
                                    <GiWhirlwind className="rank-icon" />
                                </RankingSection>
                                <RankingSection color="#FFA07A" width="10%" text="Fire God" points="600,001" isCurrentRank={user?.ranking === 'Fire God'}>
                                    <GiFireBowl className="rank-icon" />
                                </RankingSection>
                                <RankingSection color="#FFA07A" width="10%" text="Moon God" points="1,000,000" isCurrentRank={user?.ranking === 'Moon God'}>
                                    <GiMoonOrbit className="rank-icon" />
                                </RankingSection>
                                <RankingSection color="#DDA0DD" width="10%" text="Sun God" points="2,000,000" isCurrentRank={user?.ranking === 'Sun God'}>
                                    <GiSun className="rank-icon" />
                                </RankingSection>
                                <RankingSection color="#DDA0DD" width="10%" text="Space God" points="3,000,000" isCurrentRank={user?.ranking === 'Space God'}>
                                    <GiGalaxy className="rank-icon" />
                                </RankingSection>
                                <RankingSection color="#9370DB" width="10%" text="Guardian God" points="4,000,000" isCurrentRank={user?.ranking === 'Guardian God'}>
                                    <GiAngelWings className="rank-icon" />
                                </RankingSection>
                                <RankingSection color="#9370DB" width="10%" text="Absolute God" points="5,000,001" isCurrentRank={user?.ranking === 'Absolute God'}>
                                    <GiHeavenGate className="rank-icon" />
                                </RankingSection>
                            </RankingBar>
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