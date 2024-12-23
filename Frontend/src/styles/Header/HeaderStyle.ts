import styled from "styled-components"
import { Link } from "react-router"
import { IoIosSearch } from "react-icons/io";
import { TiHome } from "react-icons/ti";
import { FaUserFriends } from "react-icons/fa";
import { MdOndemandVideo } from "react-icons/md";
import { IoChatboxEllipses } from "react-icons/io5";

export const HeaderContainer = styled.header`
    position: fixed;
    top: 0;
    height: 56px;
    z-index: 99;
    background: #1f1f27;
    width: 100%;
    box-shadow: 1px 8px 15px -7px rgba(0,0,0,0.75);
    display: grid;
    grid-template-columns: repeat(3, 1fr);
`
//Left Header (Logo)
export const HeaderLeft = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 5px 1rem;
`
//Link to Home
export const HeaderLogo = styled(Link)`
`
//Wrap for Logo
export const LogoWrap = styled.div`
    width: 100%;
`
//Logo Text (EEEHub)
export const Logo = styled.div`
    color: #D71541;
    font-family: 'Poppins', Arial, sans-serif;
    font-size: 32px; 
    font-weight: 700; 
    letter-spacing: 2px; 
    text-transform: uppercase;
    display: inline-block; 
    cursor: pointer; 
    user-select: none;
`

export const SearchWrap = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 32px 10px 10px;
    border-radius: 50px;
    background: #2f2f37;
    cursor: text;
`
export const SearchIcon = styled(IoIosSearch)`
    color: white;
`
export const SearchInput = styled.input`
    outline: none;
    border: none;
    background: transparent;
    font-size: 15px;
    font-family: 'Poppins', Arial, sans-serif;
    color: white;

    $::placeholder {
        transform: translateY(-1px);
    }
    
`

export const HeaderMiddle = styled.div`
    display: flex;
    align-items: center;
    gap: 14px;
    transform: translateX(3px);
`
export const MiddleLogo = styled(Link)<{ isActive?: boolean }>`
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 125px;
    height: ${(props) => (props.isActive ? '56px' : '50px')}; /* Adjust height if active */
    border-radius: ${(props) => (props.isActive ? '0' : '10px')}; /* No border radius if active */
    cursor: pointer;
    transform: translateX(-2px);
    transition: 
        background 0.3s ease, 
        border-bottom 0.3s ease,
        height 0.3s ease,
        border-radius 0.3s ease; /* Smooth transition for active styles */

    &:hover {
    background: #3a3a3a; /* Gray highlight when hovered */
    }

    border-bottom: ${(props) => (props.isActive ? '4px solid red' : 'none')};
`
export const HomeIcon = styled(TiHome)<{ color?: string }>`
  color: ${(props) => props.color || 'white'};
  width: 30px;
  height: 30px;
`

export const FriendsIcon = styled(FaUserFriends)<{ color?: string }>`
  color: ${(props) => props.color || 'white'};
  width: 30px;
  height: 30px;
`

export const WatchIcon = styled(MdOndemandVideo)<{ color?: string }>`
  color: ${(props) => props.color || 'white'};
  width: 30px;
  height: 30px;
`

export const ChatIcon = styled(IoChatboxEllipses)<{ color?: string }>`
  color: ${(props) => props.color || 'white'};
  width: 30px;
  height: 30px;
`


export const HeaderRight = styled.div`
`