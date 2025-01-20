import React from 'react';
import Header from '../components/Header/Header';
import SideBar from '../components/SideBar/SideBar';
import { MainContent } from '../styles/Home/HomeStyle';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div>
      <Header />
      <SideBar />
      <MainContent style={{ padding: '0' }}>{children}</MainContent>
    </div>
  );
};

export default Layout;
