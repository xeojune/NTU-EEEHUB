import React, { useState } from 'react'
import { ChatIcon, FriendsIcon, HeaderContainer, HeaderLeft, HeaderLogo, HeaderMiddle, HeaderRight, HomeIcon, Logo, LogoWrap, MiddleLogo, SearchIcon, SearchInput, SearchWrap, WatchIcon } from '../../styles/Header/HeaderStyle'

const Header: React.FC = () => {
  const [activeLogo, setActiveLogo] = useState<string>('home');

  const handleLogoClick = (logo:string) => {
    setActiveLogo(logo);
  }
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
                onClick={() => handleLogoClick('home')}
                isActive={activeLogo === 'home'}
            >
                <HomeIcon color={activeLogo === 'home' ? 'red' : 'white'} />
            </MiddleLogo>
            <MiddleLogo
                to='/'
                onClick={() => handleLogoClick('friends')}
                isActive={activeLogo === 'friends'}
            >
                <FriendsIcon color={activeLogo === 'friends' ? 'red' : 'white'} />
            </MiddleLogo>
            <MiddleLogo
                to='/'
                onClick={() => handleLogoClick('watch')}
                isActive={activeLogo === 'watch'}
            >
                <WatchIcon color={activeLogo === 'watch' ? 'red' : 'white'} />
            </MiddleLogo>
            <MiddleLogo
                to='/'
                onClick={() => handleLogoClick('chat')}
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