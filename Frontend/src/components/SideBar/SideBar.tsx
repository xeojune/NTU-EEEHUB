import React, { useState } from 'react'
import { 
  SideBarContainer, 
  SideBarItem, 
  UserInfo, 
  ProfilePicture, 
  UserName, 
  MoreMenu, 
  DropdownItem 
} from '../../styles/SideBar/SideBarStyle'

// Import icons
import { AiFillHome, AiOutlineCompass, AiOutlineMessage, AiOutlineBell, AiOutlinePlusCircle, AiOutlineMore } from 'react-icons/ai'

const SideBar: React.FC = () => {
  const [showDropdown, setShowDropdown] = useState<boolean>(false); // Toggle dropdown

  return (
    <SideBarContainer>
      {/* User Information */}
      <UserInfo>
        <ProfilePicture src="https://via.placeholder.com/50" alt="User Profile" />
        <UserName>John Doe</UserName>
      </UserInfo>

      {/* Sidebar Items */}
      <SideBarItem>
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
