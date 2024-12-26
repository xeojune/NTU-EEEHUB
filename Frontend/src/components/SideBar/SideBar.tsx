import React, { useState } from 'react'
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

const SideBar: React.FC = () => {
  const [showDropdown, setShowDropdown] = useState<boolean>(false); // Toggle dropdown
  const navigate = useNavigate();
  const username = 'dex_xeb';

  return (
    <SideBarContainer>
      {/* User Information */}
      <UserInfo onClick={() => navigate(`/${username}`)}>
        <ProfilePicture src={User1Profile} alt="User Profile" />
        <UserName>dex_xeb</UserName>
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
