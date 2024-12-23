import { Link } from 'react-router'
import styled from 'styled-components'

export const SuggestedUserContainer = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
`

export const AvatarInfoContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
`

export const SuggestedUserProfileContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 5px;
`

export const SuggestedUserName = styled.p`
    font-size: 14px;
    color: white;
`
export const SuggestedUserFollowers = styled.p`
    font-size: 12px;
    color: gray;
`
export const FollowButton = styled.button`
    background-color: transparent;
    color: red;
    border: none;
    cursor: pointer;

    &:hover {
        transition: 0.1s;
        color: white;
    }
`