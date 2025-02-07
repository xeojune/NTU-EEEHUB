import React from 'react';
import Header from '../components/Header/Header';
import SideBar from '../components/SideBar/SideBar';
import { MainContent } from '../styles/Home/HomeStyle';

interface LayoutProps {
  children: React.ReactNode;
  refreshFeed?: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, refreshFeed }) => {
  return (
    <div>
      <Header />
      <SideBar refreshFeed={refreshFeed} />
      <MainContent style={{ padding: '0' }}>{children}</MainContent>
    </div>
  );
};

export default Layout;
