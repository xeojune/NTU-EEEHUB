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
import NewPost from '../NewPost/NewPost'

const SideBar: React.FC = () => {
  const [showDropdown, setShowDropdown] = useState<boolean>(false); // Toggle dropdown
  const [showCreate, setShowCreate] = useState<boolean>(false); // Toggle modal
  const navigate = useNavigate();
  const username = 'dex_xeb';

  const openCreateModal = () => setShowCreate(true);
  const closeCreateModal = () => setShowCreate(false);

  return (
    <>
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
              <DropdownItem>Settings</DropdownItem>
              <DropdownItem>Logout</DropdownItem>
            </MoreMenu>
          )}
        </div>
      </SideBarContainer>
      {showCreate && <NewPost onClose={closeCreateModal}/>}
    </>
  );
};

export default SideBar
