import styled from 'styled-components'

export const SideBarContainer = styled.aside`
  position: fixed;
  top: 56px; /* Below the Header */
  left: 0;
  height: calc(100vh - 56px);
  width: 250px;
  background: #1f1f27;
  color: white;
  display: flex;
  flex-direction: column;
  padding: 20px;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.3);
  gap: 10px;
`

export const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
`

export const ProfilePicture = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
`

export const UserName = styled.div`
  font-size: 18px;
  font-weight: 500;
`

export const SideBarItem = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 18px;
  cursor: pointer;
  padding: 10px;
  border-radius: 8px;
  transition: background 0.3s, color 0.3s;

  &:hover {
    background: #3a3a3a;
    color: red;
  }
`

export const MoreMenu = styled.div`
  position: absolute;
  bottom: 50px;
  left: 10px;
  background: #2f2f37;
  border-radius: 8px;
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.5);
  width: 200px;
  z-index: 1000;
  overflow: hidden;
`

export const DropdownItem = styled.div`
  padding: 10px 15px;
  font-size: 16px;
  cursor: pointer;
  transition: background 0.3s, color 0.3s;

  &:hover {
    background: #3a3a3a;
    color: red;
  }
`
