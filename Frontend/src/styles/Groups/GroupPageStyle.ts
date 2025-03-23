import styled from 'styled-components';

export const Banner = styled.div`
  height: 350px;
  width: 100%;
  background-image: linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.2)), url('/path-to-banner-image.jpg');
  background-size: cover;
  background-position: center;
  position: relative;
  transition: all 0.4s ease;
  
  &:after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 120px;
    background: linear-gradient(to bottom, transparent, rgba(255, 255, 255, 0.9) 70%, rgba(255, 255, 255, 1));
  }
`;

export const ProfileSection = styled.div`
  max-width: 1200px;
  margin: -80px auto 0;
  padding: 0 32px;
  position: relative;
  z-index: 2;
`;

export const Avatar = styled.img`
  width: 180px;
  height: 180px;
  border-radius: 50%;
  border: 8px solid white;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  margin-bottom: 28px;
  object-fit: cover;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  
  &:hover {
    transform: scale(1.05) rotate(2deg);
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15);
  }
`;

export const ProfileInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 32px;
  gap: 24px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

export const GroupInfo = styled.div`
  flex: 1;
  
  h1 {
    margin: 0;
    font-size: 2.75rem;
    font-weight: 800;
    color: #1a1a1a;
    line-height: 1.2;
    letter-spacing: -0.02em;
    background: linear-gradient(120deg, #2b2b2b, #4a4a4a);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  
  p {
    color: #555;
    margin: 12px 0;
    font-size: 1.2rem;
    line-height: 1.6;
    font-weight: 400;
  }
`;

export const Grid = styled.div`
  display: block;

  margin: 32px auto;
  width: 100%;
  padding: 0 24px;
  
  @media (max-width: 968px) {
    max-width: 600px;
  }
`;

export const Card = styled.div`
  background: white;
  border-radius: 20px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
  padding: 36px;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(0, 0, 0, 0.04);
  
  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.1);
    border-color: rgba(0, 0, 0, 0.08);
  }
`;

export const InfoItem = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  padding: 12px;
  border-radius: 12px;
  background: rgba(0, 0, 0, 0.02);
  transition: all 0.3s ease;

  &:hover {
    background: rgba(0, 0, 0, 0.04);
    transform: translateX(4px);
  }

  svg {
    margin-right: 12px;
    font-size: 1.2rem;
    color: #4285f4;
  }
`;

export const Link = styled.a`
  color: #4285f4;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s ease;
  
  &:hover {
    color: #2b6cd4;
    text-decoration: underline;
  }
`;

export const TabList = styled.div`
  display: flex;
  border-bottom: 2px solid #e0e0e0;
  margin: 0 -24px 32px;
  padding: 0 24px;
  overflow-x: auto;
  scrollbar-width: none;
  
  &::-webkit-scrollbar {
    display: none;
  }
`;

export const Tab = styled.button<{ active?: boolean }>`
  padding: 16px 24px;
  border: none;
  background: none;
  font-size: 1.1rem;
  font-weight: ${props => props.active ? '600' : '400'};
  color: ${props => props.active ? '#1a73e8' : '#666'};
  border-bottom: 3px solid ${props => props.active ? '#1a73e8' : 'transparent'};
  transition: all 0.2s ease;
  white-space: nowrap;
  
  &:hover {
    color: #1a73e8;
    background-color: #f5f7fa;
  }
`;

export const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 20px;
  margin-top: 24px;
  padding: 20px;
  background: rgba(66, 133, 244, 0.04);
  border-radius: 16px;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(66, 133, 244, 0.08);
  }
`;

export const SectionTitle = styled.h2`
  font-size: 1.75rem;
  font-weight: 700;
  color: #2b2b2b;
  margin-bottom: 24px;
  position: relative;
  padding-bottom: 12px;

  &:after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 60px;
    height: 4px;
    background: #4285f4;
    border-radius: 2px;
  }
`;

export const ContentContainer = styled.div`
  padding: 24px;
  background: white;
  border-radius: 16px;
  margin-top: 24px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 6px 24px rgba(0, 0, 0, 0.1);
  }
`;

export const EventCard = styled.div`
  background: white;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }

  .event-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 12px;

    h3 {
      margin: 0;
      font-size: 1.2rem;
      color: #333;
    }

    .date {
      font-size: 0.9rem;
      color: #666;
    }
  }

  .description {
    color: #555;
    margin: 12px 0;
    line-height: 1.5;
  }

  .event-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 16px;
    font-size: 0.9rem;
    color: #666;

    .location {
      display: flex;
      align-items: center;
      gap: 6px;

      svg {
        color: #1a73e8;
      }
    }

    .created-by {
      font-style: italic;
    }
  }
`;