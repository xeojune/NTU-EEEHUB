import { Link } from "react-router";
import styled from "styled-components";

export const SuggestedHeaderWrapper = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
`

export const SuggestedHeaderContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
`

export const UserProfileContainer = styled.div`
    font-size: 14px;
    font-weight: 500;
    color: white;
`

export const LogOutContainer = styled(Link)`
    font-weight: medium;
    color: red;
    cursor: pointer;
    font-size: 14px;
    text-decoration: none;

    &:hover {
        transition: 0.2s;
        color: white;
    }
`