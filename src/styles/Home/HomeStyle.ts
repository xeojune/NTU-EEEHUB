import styled from "styled-components"

export const MainContent = styled.main`
  margin-top: 56px; /* Height of the Header */
  margin-left: 250px; /* Width of the SideBar */
  padding: 20px;
  background: #181820;
  min-height: calc(100vh - 56px);
`

export const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
`

export const Flex = styled.div`
  display: flex;
  gap: 20px;
`

export const Box = styled.div<{ 
  flex?: number; 
  padding?: string; 
  marginRight?: string; 
  maxWidth?: string; 
  border?: string; 
  radius?: string;
  display?: { base: string; lg: string };
}>`
  flex: ${(props) => props.flex || 1};
  padding: ${(props) => props.padding || '0'};
  margin-right: ${(props) => props.marginRight || '0'};
  max-width: ${(props) => props.maxWidth || 'none'};
  border: ${(props) => props.border || 'none'};
  border-radius: ${(props) => props.radius || 'none'};
  width: 100%;
  display: ${(props) => (props.display ? props.display.lg : 'block')};

  @media (max-width: 1000px) {
    display: ${(props) => (props.display ? props.display.base : 'block')};
  }
`