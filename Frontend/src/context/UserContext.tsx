import React, { createContext, useState, useContext, useEffect, ReactNode, useCallback } from 'react';
import defaultAvatar from '../assets/userImg/defaultAvatar.png';
import defaultBackground from '../assets/userImg/defaultBackground.png';

interface UserContextType {
  profileImage: string;
  backgroundImage: string;
  points: number;
  setProfileImage: (url: string) => void;
  setBackgroundImage: (url: string) => void;
  clearUserData: () => void;
  fetchUserProfile: () => Promise<void>;
  fetchUserProfileByUsername: (username: string) => Promise<any>;
  getUserAvatar: (username: string) => Promise<string>;
}

interface AvatarCache {
  [username: string]: {
    url: string;
    timestamp: number;
  };
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [profileImage, setProfileImage] = useState<string>(defaultAvatar);
  const [backgroundImage, setBackgroundImage] = useState<string>(defaultBackground);
  const [points, setPoints] = useState<number>(0);
  const [avatarCache, setAvatarCache] = useState<AvatarCache>({});
  
  const fetchUserProfile = async () => {
    const userId = localStorage.getItem('userId');
    if (!userId) return;
    
    try {
      const response = await fetch(`http://localhost:3000/users/${userId}/profile`);
      const userData = await response.json();
      
      if (userData.profileImg) {
        setProfileImage(userData.profileImg);
      }
      if (userData.backgroundImg) {
        setBackgroundImage(userData.backgroundImg);
      }
      if (userData.totalPoints !== undefined) {
        setPoints(userData.totalPoints);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const fetchUserProfileByUsername = async (username: string) => {
    try {
      const response = await fetch(`http://localhost:3000/users/name/${username}/profile`);
      if (!response.ok) {
        console.error('Failed to fetch user profile:', username);
        return { profileImg: defaultAvatar, totalPoints: 0 };
      }
      const userData = await response.json();
      return {
        profileImg: userData.profileImg || defaultAvatar,
        totalPoints: userData.totalPoints || 0
      };
    } catch (error) {
      console.error('Error fetching user profile by username:', error);
      return { profileImg: defaultAvatar, totalPoints: 0 };
    }
  };

  const getUserAvatar = useCallback(async (username: string): Promise<string> => {
    const currentTime = Date.now();
    const cacheExpiration = 5 * 60 * 1000; // 5 minutes

    // Check if we have a cached avatar URL that's not expired
    const cachedData = avatarCache[username];
    if (cachedData && (currentTime - cachedData.timestamp) < cacheExpiration) {
      return cachedData.url;
    }

    // If not cached or expired, fetch new avatar
    const userData = await fetchUserProfileByUsername(username);
    const avatarUrl = userData.profileImg;

    // Update cache
    setAvatarCache(prev => ({
      ...prev,
      [username]: {
        url: avatarUrl,
        timestamp: currentTime
      }
    }));

    return avatarUrl;
  }, [avatarCache]);

  const clearUserData = () => {
    setProfileImage(defaultAvatar);
    setBackgroundImage(defaultBackground);
    setPoints(0);
    setAvatarCache({});
  };

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (userId) {
      fetchUserProfile();
    }
  }, []);

  return (
    <UserContext.Provider value={{
      profileImage,
      backgroundImage,
      points,
      setProfileImage,
      setBackgroundImage,
      clearUserData,
      fetchUserProfile,
      fetchUserProfileByUsername,
      getUserAvatar,
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