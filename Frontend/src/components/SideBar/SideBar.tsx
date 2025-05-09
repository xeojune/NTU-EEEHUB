import React, { useEffect, useState } from 'react'
import { 
  SideBarContainer, 
  SideBarItem, 
  UserInfo, 
  ProfilePicture, 
  UserName, 
  MoreMenu, 
  DropdownItem,
  SideBarLink, 
} from '../../styles/SideBar/SideBarStyle'

// Import icons
import { AiFillHome, AiOutlineMessage, AiOutlineBell, AiOutlinePlusCircle, AiOutlineMore } from 'react-icons/ai'
import { useNavigate } from 'react-router'
import { getUserById } from '../../apis/getUserApi'
import NewPost from '../NewPost/NewPost'
import { useUser } from '../../context/UserContext'
import { useNotification } from '../../context/NotificationContext'

interface SideBarProps {
  refreshFeed?: () => void;
}

const SideBar: React.FC<SideBarProps> = ({ refreshFeed }) => {
  const [showDropdown, setShowDropdown] = useState<boolean>(false); // Toggle dropdown
  const [showCreate, setShowCreate] = useState<boolean>(false); // Toggle modal
  const navigate = useNavigate();
  const [username, setUsername] = useState<string | null>(null);
  const { profileImage, clearUserData } = useUser();
  const { unreadCount } = useNotification();

  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const userId = localStorage.getItem('userId'); // Retrieve user ID from localStorage
        if (userId) {
          const { name } = await getUserById(userId); // Fetch usernam
          setUsername(name);
        } else {
          navigate('/login'); // Redirect to login if no user ID
        }
      } catch (error) {
        console.error('Error fetching username:', error);
        navigate('/login'); // Redirect to login on error
      }
    };

    fetchUsername();
  }, [navigate]);

  const openCreateModal = () => setShowCreate(true);
  const closeCreateModal = () => setShowCreate(false);

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
    <SideBarContainer>
      {/* User Information */}
      <SideBarLink to={`/profile/${username}`}>
        <SideBarItem>
          <UserInfo>
            <ProfilePicture src={profileImage || '/default-avatar.png'} alt="Profile" />
            <UserName>{username}</UserName>
          </UserInfo>
        </SideBarItem>
      </SideBarLink>

      {/* Sidebar Items */}
      <SideBarLink to="/">
        <SideBarItem>
          <AiFillHome size={24} /> Home
        </SideBarItem>
      </SideBarLink>
      {/* <SideBarItem>
        <AiOutlineCompass size={24} /> Explore
      </SideBarItem> */}
      <SideBarLink to="/chat">
        <SideBarItem>
          <AiOutlineMessage size={24} /> Messages
        </SideBarItem>
      </SideBarLink>
      <SideBarLink to="/notifications">
        <SideBarItem>
          <AiOutlineBell size={24} /> 
          Notifications
          {unreadCount > 0 && (
            <span style={{
              backgroundColor: '#FF3B30',
              color: 'white',
              borderRadius: '50%',
              padding: '2px 6px',
              fontSize: '12px',
              marginLeft: '5px'
            }}>
              {unreadCount}
            </span>
          )}
        </SideBarItem>
      </SideBarLink>
      
      <SideBarItem onClick={openCreateModal}>
        <AiOutlinePlusCircle size={24} /> Create
      </SideBarItem>

      {/* More Item */}
      <div style={{ marginTop: 'auto', position: 'relative' }}>
        <SideBarItem onClick={() => setShowDropdown(!showDropdown)}>
          <AiOutlineMore size={24} /> More
        </SideBarItem>

        {/* Dropdown Menu */}
        {showDropdown && (
          <MoreMenu>
            <DropdownItem onClick={handleLogout}>Logout</DropdownItem>
          </MoreMenu>
        )}
      </div>
      {showCreate && (
        <NewPost 
          onClose={closeCreateModal}
          onPostCreated={refreshFeed}
        />
      )}
    </SideBarContainer>
    
  );
};

export default SideBar
