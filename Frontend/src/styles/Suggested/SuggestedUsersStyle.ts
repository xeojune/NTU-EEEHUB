import styled from "styled-components";

export const SuggestedUsersContainer = styled.div<{ py?: number; px?: number; gap?: number }>`
  display: flex;
  flex-direction: column;
  width: 100%; /* Ensures it spans the full width */
  padding: ${(props) => `${props.py || 0}rem ${props.px || 0}rem`};
  gap: ${(props) => `${props.gap || 0}rem`};
  box-sizing: border-box; /* Includes padding in the width */
  background-color: #1f1f27;
`

export const SuggestedContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
`

export const SuggestedBox = styled.div`
    font-size: 14px;
    font-weight: 500;
    color: gray;
`

export const SeeAllButton = styled.button`
    font-size: 14px;
    font-weight: 500;
    color: white;
    background-color: transparent;
    border: none;
    cursor: pointer;

    &:hover {
        transition: 0.2s;
        color: gray;
    }
`

export const SuggestedFooter = styled.div`
    font-size: 12px;
    color: gray;
    margin-top: 5px;
`
