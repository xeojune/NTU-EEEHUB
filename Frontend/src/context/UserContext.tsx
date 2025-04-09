import React, { createContext, useState, useContext, useEffect, ReactNode, useCallback } from 'react';
import defaultAvatar from '../assets/userImg/defaultAvatar.png';
import defaultBackground from '../assets/userImg/defaultBackground.png';

interface User {
  _id: string;
  name: string;
  email: string;
  profileImg: string;
  backgroundImg: string;
  totalPoints: number;
  followerCount: number;
  followingCount: number;
  ranking: string;
}

interface UserContextType {
  user: User | null;
  profileImage: string;
  backgroundImage: string;
  points: number;
  followerCount: number;
  followingCount: number;
  setProfileImage: (url: string) => void;
  setBackgroundImage: (url: string) => void;
  clearUserData: () => void;
  fetchUserProfile: () => Promise<void>;
  fetchUserProfileByUsername: (username: string) => Promise<any>;
  getUserAvatar: (username: string) => Promise<string>;
  getUserBackground: (username: string) => Promise<string>;
  setUser: (user: User | null) => void;
  fetchUserProfileById: (userId: string) => Promise<any>;
}

interface AvatarCache {
  [username: string]: {
    url: string;
    timestamp: number;
  };
}

interface BackgroundCache {
  [username: string]: {
    url: string;
    timestamp: number;
  };
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profileImage, setProfileImage] = useState<string>(defaultAvatar);
  const [backgroundImage, setBackgroundImage] = useState<string>(defaultBackground);
  const [points, setPoints] = useState<number>(0);
  const [followerCount, setFollowerCount] = useState<number>(0);
  const [followingCount, setFollowingCount] = useState<number>(0);
  const [avatarCache, setAvatarCache] = useState<AvatarCache>({});
  const [backgroundCache, setBackgroundCache] = useState<BackgroundCache>({});
  
  const fetchUserProfile = useCallback(async () => {
    const userId = localStorage.getItem('userId');
    if (!userId) return;
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/users/${userId}/profile`);
      const userData = await response.json();
      
      setUser({
        _id: userData._id,
        name: userData.name,
        email: userData.email,
        profileImg: userData.profileImg || defaultAvatar,
        backgroundImg: userData.backgroundImg || defaultBackground,
        totalPoints: userData.totalPoints || 0,
        followerCount: userData.followerCount || 0,
        followingCount: userData.followingCount || 0,
        ranking: userData.ranking || 'Beginner'
      });

      if (userData.profileImg) {
        setProfileImage(userData.profileImg);
      }
      if (userData.backgroundImg) {
        setBackgroundImage(userData.backgroundImg);
      }
      if (userData.totalPoints) {
        setPoints(userData.totalPoints);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  }, []);

  const fetchUserProfileByUsername = useCallback(async (username: string) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/users/name/${username}/profile`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching user profile by username:', error);
      return null;
    }
  }, []);

  const getUserAvatar = useCallback(async (username: string) => {
    // Check cache first
    const cached = avatarCache[username];
    if (cached && Date.now() - cached.timestamp < 3600000) { // 1 hour cache
      return cached.url;
    }

    try {
      const userProfile = await fetchUserProfileByUsername(username);
      const avatarUrl = userProfile?.profileImg || defaultAvatar;
      
      setAvatarCache(prev => ({
        ...prev,
        [username]: {
          url: avatarUrl,
          timestamp: Date.now()
        }
      }));

      return avatarUrl;
    } catch (error) {
      console.error('Error getting user avatar:', error);
      return defaultAvatar;
    }
  }, [avatarCache, fetchUserProfileByUsername]);

  const getUserBackground = useCallback(async (username: string) => {
    // Check cache first
    const cached = backgroundCache[username];
    if (cached && Date.now() - cached.timestamp < 3600000) { // 1 hour cache
      return cached.url;
    }

    try {
      const userProfile = await fetchUserProfileByUsername(username);
      const backgroundUrl = userProfile?.backgroundImg || defaultBackground;
      
      setBackgroundCache(prev => ({
        ...prev,
        [username]: {
          url: backgroundUrl,
          timestamp: Date.now()
        }
      }));

      return backgroundUrl;
    } catch (error) {
      console.error('Error getting user background:', error);
      return defaultBackground;
    }
  }, [backgroundCache, fetchUserProfileByUsername]);

  const fetchUserProfileById = useCallback(async (userId: string) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/users/${userId}/profile`);
      if (!response.ok) {
        throw new Error('Failed to fetch user profile');
      }
      const userData = await response.json();
      return userData;
    } catch (error) {
      console.error('Error fetching user profile by ID:', error);
      return null;
    }
  }, []);

  const clearUserData = useCallback(() => {
    setUser(null);
    setProfileImage(defaultAvatar);
    setBackgroundImage(defaultBackground);
    setPoints(0);
    setFollowerCount(0);
    setFollowingCount(0);
  }, []);

  useEffect(() => {
    fetchUserProfile();
  }, [points, fetchUserProfile]);

  return (
    <UserContext.Provider value={{
      user,
      profileImage,
      backgroundImage,
      points,
      followerCount,
      followingCount,
      setProfileImage,
      setBackgroundImage,
      clearUserData,
      fetchUserProfile,
      fetchUserProfileByUsername,
      getUserAvatar,
      getUserBackground,
      setUser,
      fetchUserProfileById
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};