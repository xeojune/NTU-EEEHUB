import styled from 'styled-components'

export const ContainerSm = styled.div`
    max-width: 640px;
    margin: 0 auto;
    padding: 0 16px;
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 16px;
`

export const EmptyStateContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 40px 16px;
    text-align: center;
    gap: 24px;
`

export const EmptyStateMessage = styled.p`
    font-size: 1.25rem;
    color: #4A5568;
    margin-bottom: 16px;
`

export const ButtonContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 16px;
    width: 100%;
    max-width: 300px;
`

export const ActionButton = styled.button`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    width: 100%;
    padding: 12px 24px;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease-in-out;
    border: none;
    
    &.primary {
        background-color: #3182ce;
        color: white;
        
        &:hover {
            background-color: #2b6cb0;
        }
    }
    
    &.secondary {
        background-color: #319795;
        color: white;
        
        &:hover {
            background-color: #2c7a7b;
        }
    }
`

export const NoPostsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin: 2rem auto;
  max-width: 600px;
`;

export const NoPostsTitle = styled.h2`
  color: #1a73e8;
  font-size: 1.5rem;
  margin-bottom: 1rem;
  font-weight: 600;
`;

export const NoPostsText = styled.p`
  color: #5f6368;
  font-size: 1rem;
  margin-bottom: 2rem;
  line-height: 1.5;
`;

export const NoPostsButton = styled.button`
  background-color: #1a73e8;
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: #1557b0;
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
`;
