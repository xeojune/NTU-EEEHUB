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
}

interface UserContextType {
  user: User | null;
  profileImage: string;
  backgroundImage: string;
  points: number;
  setProfileImage: (url: string) => void;
  setBackgroundImage: (url: string) => void;
  clearUserData: () => void;
  fetchUserProfile: () => Promise<void>;
  fetchUserProfileByUsername: (username: string) => Promise<any>;
  getUserAvatar: (username: string) => Promise<string>;
  setUser: (user: User | null) => void;
}

interface AvatarCache {
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
  const [avatarCache, setAvatarCache] = useState<AvatarCache>({});
  
  const fetchUserProfile = async () => {
    const userId = localStorage.getItem('userId');
    if (!userId) return;
    
    try {
      const response = await fetch(`http://localhost:3000/users/${userId}/profile`);
      const userData = await response.json();
      
      setUser({
        _id: userId,
        name: userData.name,
        email: userData.email,
        profileImg: userData.profileImg || defaultAvatar,
        backgroundImg: userData.backgroundImg || defaultBackground,
        totalPoints: userData.totalPoints || 0
      });

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
      return await response.json();
    } catch (error) {
      console.error('Error fetching user profile by username:', error);
      return null;
    }
  };

  const getUserAvatar = async (username: string) => {
    // Check cache first
    const cached = avatarCache[username];
    if (cached && Date.now() - cached.timestamp < 3600000) { // 1 hour cache
      return cached.url;
    }

    try {
      const userProfile = await fetchUserProfileByUsername(username);
      const avatarUrl = userProfile?.profileImg || defaultAvatar;
      
      // Update cache
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
  };

  const clearUserData = () => {
    setUser(null);
    setProfileImage(defaultAvatar);
    setBackgroundImage(defaultBackground);
    setPoints(0);
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  return (
    <UserContext.Provider value={{
      user,
      profileImage,
      backgroundImage,
      points,
      setUser,
      setProfileImage,
      setBackgroundImage,
      clearUserData,
      fetchUserProfile,
      fetchUserProfileByUsername,
      getUserAvatar
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