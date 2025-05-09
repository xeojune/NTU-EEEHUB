import React, { useState, useEffect, useRef } from 'react';
import Layout from '../Layout';
import PeopleCard from '../../components/Friends/PeopleCard';
import { CardsContainer, FriendsPageContainer, MoreButton, Section, SectionTitle, SectionContainer } from '../../styles/Friends/FriendsPageStyle';
import { friendsApi, User as Person } from '../../apis/friendsApi';
import { useUser } from '../../context/UserContext';
import { toast } from 'react-toastify';
import { notificationApi, NotificationType } from '../../apis/notificationApi';
import SkeletonUI from '../../components/SkeletonUI';
import styled from 'styled-components';

const SkeletonCard = styled.div`
  width: 250px;
  height: 300px;
  background: white;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
`;

const SkeletonCardContent = styled.div`
  padding: 15px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const EmptyStateContainer = styled.div`
  width: 100%;
  padding: 40px 20px;
  text-align: center;
  background: white;
  border-radius: 15px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const EmptyStateText = styled.p`
  font-size: 1.1rem;
  color: #666;
  margin: 0;
`;

interface PaginationState {
    page: number;
    totalPages: number;
    loading: boolean;
}

const FriendsPage: React.FC = () => {
    const { fetchUserProfile } = useUser();
    const [followers, setFollowers] = useState<Person[]>([]);
    const [following, setFollowing] = useState<Person[]>([]);
    const [followingIds, setFollowingIds] = useState<Set<string>>(new Set());
    const [potentialFriends, setPotentialFriends] = useState<Person[]>([]);
    const [showSkeleton, setShowSkeleton] = useState(true);
    const skeletonTimeoutRef = useRef<ReturnType<typeof setTimeout>>();
    
    const [followersPagination, setFollowersPagination] = useState<PaginationState>({
        page: 1,
        totalPages: 1,
        loading: false
    });

    const [followingPagination, setFollowingPagination] = useState<PaginationState>({
        page: 1,
        totalPages: 1,
        loading: false
    });

    const [potentialFriendsPagination, setPotentialFriendsPagination] = useState<PaginationState>({
        page: 1,
        totalPages: 1,
        loading: false
    });

    // Set minimum skeleton display time when component mounts
    useEffect(() => {
        skeletonTimeoutRef.current = setTimeout(() => {
            setShowSkeleton(false);
        }, 1000);

        return () => {
            if (skeletonTimeoutRef.current) {
                clearTimeout(skeletonTimeoutRef.current);
            }
        };
    }, []);

    const renderSkeletonCards = (count: number) => (
        <CardsContainer>
            {Array(count).fill(0).map((_, idx) => (
                <SkeletonCard key={idx}>
                    <SkeletonUI width="100%" height="150px" /> {/* Cover image */}
                    <div style={{ 
                        position: 'relative', 
                        marginTop: '-50px', 
                        marginLeft: '20px',
                        width: '80px',
                        height: '80px'
                    }}>
                        <SkeletonUI width="80px" height="80px" borderRadius="50%" /> {/* Profile image */}
                    </div>
                    <SkeletonCardContent>
                        <SkeletonUI width="70%" height="20px" /> {/* Username */}
                        <SkeletonUI width="100px" height="35px" borderRadius="20px" /> {/* Follow button */}
                    </SkeletonCardContent>
                </SkeletonCard>
            ))}
        </CardsContainer>
    );

    const fetchFollowers = async (page: number = 1) => {
        try {
            setFollowersPagination(prev => ({ ...prev, loading: true }));
            const userId = localStorage.getItem('userId');
            if (!userId) {
                console.error('No user ID found');
                return;
            }
            const response = await friendsApi.getFollowers(userId, page);
            
            if (response.data.followers) {
                if (page === 1) {
                    setFollowers(response.data.followers);
                } else {
                    setFollowers(prev => [...prev, ...response.data.followers!]);
                }
                setFollowersPagination({
                    page: response.data.page,
                    totalPages: response.data.totalPages,
                    loading: false
                });
            }
        } catch (error) {
            console.error('Error fetching followers:', error);
            setFollowersPagination(prev => ({ ...prev, loading: false }));
        }
    };

    const fetchFollowing = async (page: number = 1) => {
        try {
            setFollowingPagination(prev => ({ ...prev, loading: true }));
            
            const userId = localStorage.getItem('userId');
            if (!userId) {
                return;
            }

            const response = await friendsApi.getFollowings(userId, page);
            
            if (response.data.followings) {
                const followings = response.data.followings;

                if (page === 1) {
                    setFollowing(followings);
                    const newFollowingIds = new Set(followings.map(user => user.userId));
                    setFollowingIds(newFollowingIds);
                    
                    setPotentialFriends(prev => {
                        const followingSet = new Set(followings.map(f => f.userId));
                        return prev.filter(p => !followingSet.has(p.userId));
                    });
                } else {
                    setFollowing(prev => [...prev, ...followings]);
                    setFollowingIds(prev => new Set([...prev, ...followings.map(user => user.userId)]));
                }
                
                setFollowingPagination({
                    page: response.data.page,
                    totalPages: response.data.totalPages,
                    loading: false
                });
            }
        } catch (error) {
            console.error('Error fetching following:', error);
            setFollowingPagination(prev => ({ ...prev, loading: false }));
        }
    };

    const fetchPotentialFriends = async (page: number = 1) => {
        try {
            setPotentialFriendsPagination(prev => ({ ...prev, loading: true }));
            const response = await friendsApi.getAllUsers(page);
            
            if (response.data.users) {
                const users = response.data.users;
                
                // Update following IDs
                const followingUsers = users.filter(user => user.isFollowing);
                
                followingUsers.forEach(user => {
                    setFollowingIds(prev => {
                        const newSet = new Set([...prev, user.userId]);
                        return newSet;
                    });
                });

                // Add following users to following list if not already there
                setFollowing(prev => {
                    const existingIds = new Set(prev.map(p => p.userId));
                    const newFollowing = followingUsers.filter(user => !existingIds.has(user.userId));
                    return [...prev, ...newFollowing];
                });

                // Only show non-following users in potential friends
                const potentialFriends = users.filter(user => !user.isFollowing);
                
                if (page === 1) {
                    setPotentialFriends(potentialFriends);
                } else {
                    setPotentialFriends(prev => [...prev, ...potentialFriends]);
                }

                setPotentialFriendsPagination({
                    page: response.data.page,
                    totalPages: response.data.totalPages,
                    loading: false
                });
            }
        } catch (error) {
            console.error('Error fetching potential friends:', error);
            setPotentialFriendsPagination(prev => ({ ...prev, loading: false }));
        }
    };

    const handleFollowToggle = async (userId: string) => {
        try {
            const currentUserId = localStorage.getItem('userId');
            if (!currentUserId) {
                console.error('No user ID found in localStorage');
                return;
            }

            if (followingIds.has(userId)) {
                console.log('Unfollowing user:', userId);
                // Unfollow user
                const response = await friendsApi.unfollowUser(userId);
                if (response.success) {
                    // Create notification in database
                    await notificationApi.createNotification({
                        recipientId: userId,
                        senderId: currentUserId,
                        type: NotificationType.FOLLOW,
                        content: 'unfollowed you'
                    });

                    toast.success('Successfully unfollowed user', {
                        position: 'top-right',
                        autoClose: 3000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                    });
                    
                    // Update local state first
                    setFollowingIds(prev => {
                        const newSet = new Set(prev);
                        newSet.delete(userId);
                        return newSet;
                    });

                    // Find user in following list to move to potential friends
                    const userToMove = following.find(p => p.userId === userId);
                    
                    if (userToMove) {
                        setFollowing(prev => {
                            const newFollowing = prev.filter(p => p.userId !== userId);
                            return newFollowing;
                        });
                        setPotentialFriends(prev => {
                            const newPotential = [{...userToMove, isFollowing: false}, ...prev];
                            return newPotential;
                        });
                    }

                    // Then refresh lists to ensure sync with backend
                    console.log('Refreshing lists after unfollow');
                    await fetchFollowing(1);
                    await fetchPotentialFriends(1);
                }
            } else {
                console.log('Following user:', userId);
                // Follow user
                const response = await friendsApi.followUser(userId);
                if (response.success && response.data) {
                    // Create notification in database with single recipient
                    await notificationApi.createNotification({
                        recipientId: userId, // Single recipient
                        senderId: currentUserId,
                        type: NotificationType.FOLLOW,
                        content: `started following you`
                    });

                    toast.success('Successfully followed user', {
                        position: 'top-right',
                        autoClose: 3000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                    });
                    
                    // Update local state first
                    setFollowingIds(prev => {
                        const newSet = new Set([...prev, userId]);
                        return newSet;
                    });
                    
                    // Find user in potential friends or followers list
                    const userToMove = potentialFriends.find(p => p.userId === userId) || 
                                     followers.find(p => p.userId === userId);

                    if (userToMove) {
                        // Update following list immediately
                        setFollowing(prev => {
                            const newFollowing = [{
                                ...userToMove,
                                isFollowing: true
                            }, ...prev];
                            return newFollowing;
                        });

                        // Remove from potential friends if they were there
                        setPotentialFriends(prev => {
                            const newPotential = prev.filter(p => p.userId !== userId);
                            return newPotential;
                        });
                    }

                    // Then refresh lists to ensure sync with backend
                    console.log('Refreshing lists after follow');
                    await fetchFollowing(1);
                    await fetchPotentialFriends(1);
                }
            }
        } catch (error) {
            console.error('Error toggling follow status:', error);
            toast.error('Failed to update follow status. Please try again.', {
                position: 'top-right',
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
            // On error, refresh all lists to ensure correct state
            await Promise.all([
                fetchFollowing(1),
                fetchPotentialFriends(1)
            ]);
        }
    };

    const handleMoreClick = (section: 'followers' | 'following') => {
        console.debug(`Loading more ${section}...`);
        if (section === 'followers' && followersPagination.page < followersPagination.totalPages) {
            fetchFollowers(followersPagination.page + 1);
        } else if (section === 'following' && followingPagination.page < followingPagination.totalPages) {
            fetchFollowing(followingPagination.page + 1);
        }
    };

    const loadMorePotentialFriends = () => {
        console.debug('Loading more potential friends...');
        if (!potentialFriendsPagination.loading && potentialFriendsPagination.page < potentialFriendsPagination.totalPages) {
            fetchPotentialFriends(potentialFriendsPagination.page + 1);
        }
    };

    useEffect(() => {
        const debugProfile = async () => {
            try {
                const profile = await fetchUserProfile();
                console.debug('User profile:', profile);
            } catch (error) {
                console.error('Error fetching profile:', error);
            }
        };
        debugProfile();
    }, [fetchUserProfile]);

    useEffect(() => {
        const initializeLists = async () => {
            try {
                // First fetch following to establish followingIds
                await fetchFollowing(1);
                
                // Then fetch other lists
                await Promise.all([
                    fetchFollowers(1),
                    fetchPotentialFriends(1)
                ]);
            } catch (error) {
                console.error('Error initializing friend lists:', error);
            }
        };

        initializeLists();
    }, []);

    useEffect(() => {
        console.log('Current state:', {
            followers: followers.map(f => ({ userId: f.userId, username: f.username, isFollowing: f.isFollowing })),
            following: following.map(f => ({ userId: f.userId, username: f.username, isFollowing: f.isFollowing })),
            followingIds: Array.from(followingIds),
            potentialFriends: potentialFriends.map(f => ({ userId: f.userId, username: f.username, isFollowing: f.isFollowing }))
        });
    }, [followers, following, followingIds, potentialFriends]);

    if (showSkeleton) {
        return (
            <Layout>
                <FriendsPageContainer>
                    <Section>
                        <SectionTitle>Followers</SectionTitle>
                        <SectionContainer>
                            {renderSkeletonCards(4)}
                        </SectionContainer>
                    </Section>
                    
                    <Section>
                        <SectionTitle>Following</SectionTitle>
                        <SectionContainer>
                            {renderSkeletonCards(4)}
                        </SectionContainer>
                    </Section>

                    <Section>
                        <SectionTitle>People You May Know</SectionTitle>
                        <SectionContainer>
                            {renderSkeletonCards(4)}
                        </SectionContainer>
                    </Section>
                </FriendsPageContainer>
            </Layout>
        );
    }

    return (
        <Layout>
            <FriendsPageContainer>
                <Section>
                    <SectionTitle>Followers</SectionTitle>
                    <SectionContainer>
                        {followers.length > 0 ? (
                            <CardsContainer>
                                {followers.map((follower) => (
                                    <PeopleCard
                                        key={follower.userId}
                                        userId={follower.userId}
                                        username={follower.username}
                                        profileImg={follower.profileImg}
                                        isFollowing={followingIds.has(follower.userId)}
                                        onFollowToggle={handleFollowToggle}
                                    />
                                ))}
                            </CardsContainer>
                        ) : (
                            <EmptyStateContainer>
                                <EmptyStateText>No Followers Yet</EmptyStateText>
                            </EmptyStateContainer>
                        )}
                        {followersPagination.page < followersPagination.totalPages && (
                            <MoreButton onClick={() => handleMoreClick('followers')}>
                                Load More
                            </MoreButton>
                        )}
                    </SectionContainer>
                </Section>

                <Section>
                    <SectionTitle>Following</SectionTitle>
                    <SectionContainer>
                        {following.length > 0 ? (
                            <CardsContainer>
                                {following.map((followedUser) => (
                                    <PeopleCard
                                        key={followedUser.userId}
                                        userId={followedUser.userId}
                                        username={followedUser.username}
                                        profileImg={followedUser.profileImg}
                                        isFollowing={true}
                                        onFollowToggle={handleFollowToggle}
                                    />
                                ))}
                            </CardsContainer>
                        ) : (
                            <EmptyStateContainer>
                                <EmptyStateText>You're Not Following Anyone Yet</EmptyStateText>
                            </EmptyStateContainer>
                        )}
                        {followingPagination.page < followingPagination.totalPages && (
                            <MoreButton onClick={() => handleMoreClick('following')}>
                                Load More
                            </MoreButton>
                        )}
                    </SectionContainer>
                </Section>

                <Section>
                    <SectionTitle>People You May Know</SectionTitle>
                    <SectionContainer>
                        {potentialFriends.length > 0 ? (
                            <CardsContainer>
                                {potentialFriends.map((user) => (
                                    <PeopleCard
                                        key={user.userId}
                                        userId={user.userId}
                                        username={user.username}
                                        profileImg={user.profileImg}
                                        isFollowing={followingIds.has(user.userId)}
                                        onFollowToggle={handleFollowToggle}
                                    />
                                ))}
                            </CardsContainer>
                        ) : (
                            <EmptyStateContainer>
                                <EmptyStateText>No Suggested Users Available</EmptyStateText>
                            </EmptyStateContainer>
                        )}
                        {potentialFriendsPagination.page < potentialFriendsPagination.totalPages && (
                            <MoreButton onClick={loadMorePotentialFriends}>
                                Load More
                            </MoreButton>
                        )}
                    </SectionContainer>
                </Section>
            </FriendsPageContainer>
        </Layout>
    );
};

export default FriendsPage;