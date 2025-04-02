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
