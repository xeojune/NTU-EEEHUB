import React, { useEffect, useState } from 'react'
import { ChatIcon, FriendsIcon, HeaderContainer, HeaderLeft, HeaderLogo, HeaderMiddle, HeaderRight, HomeIcon, Logo, LogoWrap, MiddleLogo, SearchIcon, SearchInput, SearchWrap, WatchIcon } from '../../styles/Header/HeaderStyle'
import { useLocation, useNavigate } from 'react-router';

const Header: React.FC = () => {
  const [activeLogo, setActiveLogo] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const pathToLogo: { [key: string]: string } = {
      '/': 'home',
      '/friends': 'friends',
      '/watch': 'watch',
      '/chat': 'chat',
    };

    // Set the active logo based on the current path or null if not in header navigation
    setActiveLogo(pathToLogo[location.pathname] || null);
  }, [location.pathname]);

  const handleLogoClick = (logo: string, path: string) => {
    setActiveLogo(logo);
    navigate(path); // Navigate to the specified path
  };
  return (
    <HeaderContainer>
        <HeaderLeft>
            <HeaderLogo to='/'>
                <LogoWrap>
                    <Logo>EEEHub</Logo>
                </LogoWrap>
            </HeaderLogo>
            <SearchWrap>
                <SearchIcon/>
                <SearchInput placeholder='Search EEEHub' type='text'/>
            </SearchWrap>

        </HeaderLeft>

        <HeaderMiddle>
            <MiddleLogo
                to='/'
                onClick={() => handleLogoClick('home', '/')}
                isActive={activeLogo === 'home'}
            >
                <HomeIcon color={activeLogo === 'home' ? 'red' : 'white'} />
            </MiddleLogo>
            <MiddleLogo
                to='/friends'
                onClick={() => handleLogoClick('friends', '/friends')}
                isActive={activeLogo === 'friends'}
            >
                <FriendsIcon color={activeLogo === 'friends' ? 'red' : 'white'} />
            </MiddleLogo>
            <MiddleLogo
                to='/watch'
                onClick={() => handleLogoClick('watch', '/watch')}
                isActive={activeLogo === 'watch'}
            >
                <WatchIcon color={activeLogo === 'watch' ? 'red' : 'white'} />
            </MiddleLogo>
            <MiddleLogo
                to='/chat'
                onClick={() => handleLogoClick('chat', '/chat')}
                isActive={activeLogo === 'chat'}
            >
                <ChatIcon color={activeLogo === 'chat' ? 'red' : 'white'} />
            </MiddleLogo>
        </HeaderMiddle>

        <HeaderRight>

        </HeaderRight>

    </HeaderContainer>
    
  )
}

export default Header