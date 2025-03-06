import React, { useEffect } from 'react'
import { LogOutContainer, SuggestedHeaderContainer, SuggestedHeaderWrapper, UserProfileContainer } from '../../styles/Suggested/SuggestedHeaderStyle'
import { AvatarImage } from '../../styles/FeedPosts/PostHeaderStyle'
import { useNavigate } from 'react-router'
import { useUser } from '../../context/UserContext'

const SuggestedHeader: React.FC = () => {
  const navigate = useNavigate();
  const { profileImage, clearUserData, fetchUserProfile } = useUser();
  const username = localStorage.getItem('username');

  // Fetch user profile when component mounts and userId exists
  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (userId) {
      fetchUserProfile();
    }
  }, [fetchUserProfile]);

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();

    // Clear user context data
    clearUserData();
    
    // Clear authentication tokens from localStorage
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userId');
    localStorage.removeItem('username');

    //alert Logged out
    alert('Logged out Successfully');

    // Navigate to login page
    navigate('/login');
  };

  return (
    <SuggestedHeaderWrapper>
        <SuggestedHeaderContainer>
            <AvatarImage 
              src={profileImage} 
              alt="user profile pic" 
              width='40px' 
              height='40px'
            />
            <UserProfileContainer>
                {username}
            </UserProfileContainer>
        </SuggestedHeaderContainer>
        <LogOutContainer to="/login" onClick={handleLogout}>
            Log out
        </LogOutContainer>
    </SuggestedHeaderWrapper>
  )
}

export default SuggestedHeader