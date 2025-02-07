import React from 'react'
import { LogOutContainer, SuggestedHeaderContainer, SuggestedHeaderWrapper, UserProfileContainer } from '../../styles/Suggested/SuggestedHeaderStyle'
import { AvatarImage } from '../../styles/FeedPosts/PostHeaderStyle'
import avatar from '../../assets/userImg/User1.png'
import { useNavigate } from 'react-router'

const SuggestedHeader: React.FC = () => {
  const navigate = useNavigate();

  const username = localStorage.getItem('username');

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent the default link behavior

    // Clear authentication tokens from localStorage
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userId');

    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');
    const userId = localStorage.getItem('userId');

    if (!accessToken && !refreshToken && !userId) {
      alert('Logged out successfully!');
    } else {
      alert('Failed to log out completely. Please try again.');
    }

    // Navigate to login page
    navigate('/login');
  };

  return (
    <SuggestedHeaderWrapper>
        <SuggestedHeaderContainer>
            <AvatarImage src={avatar} alt="user profile pic" width='40px' height='40px'/>
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