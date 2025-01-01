import React, { useEffect, useState } from 'react'
import { 
  SideBarContainer, 
  SideBarItem, 
  UserInfo, 
  ProfilePicture, 
  UserName, 
  MoreMenu, 
  DropdownItem, 
} from '../../styles/SideBar/SideBarStyle'

// Import icons
import { AiFillHome, AiOutlineCompass, AiOutlineMessage, AiOutlineBell, AiOutlinePlusCircle, AiOutlineMore } from 'react-icons/ai'
import User1Profile from '../../assets/userImg/User1.png'
import { Link, useNavigate } from 'react-router'
import { getUserById } from '../../apis/getUserApi'

const SideBar: React.FC = () => {
  const [showDropdown, setShowDropdown] = useState<boolean>(false); // Toggle dropdown
  const navigate = useNavigate();
  const [username, setUsername] = useState<string | null>(null);

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

  return (
    <SideBarContainer>
      {/* User Information */}
      <UserInfo onClick={() => navigate(`/${username}`)}>
        <ProfilePicture src={User1Profile} alt="User Profile" />
        <UserName>{username}</UserName>
      </UserInfo>

      {/* Sidebar Items */}
      <SideBarItem onClick={() => navigate('/')}>
        <AiFillHome size={24} /> Home
      </SideBarItem>
      <SideBarItem>
        <AiOutlineCompass size={24} /> Explore
      </SideBarItem>
      <SideBarItem>
        <AiOutlineMessage size={24} /> Messages
      </SideBarItem>
      <SideBarItem>
        <AiOutlineBell size={24} /> Notifications
      </SideBarItem>
      <SideBarItem>
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
            <DropdownItem>Settings</DropdownItem>
            <DropdownItem>Logout</DropdownItem>
          </MoreMenu>
        )}
      </div>
    </SideBarContainer>
  )
}

export default SideBar
