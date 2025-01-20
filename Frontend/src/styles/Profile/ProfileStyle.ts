import styled from "styled-components";

export const ProfileContainer = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    min-height: 100vh;
    background-color: white;
`

export const BackgroundImageWrapper = styled.div`
    position: relative;
    width: 100%;
    height: 300px;
`

export const BackgroundImage = styled.img`
    width: 100%;
    height: 100%;
    object-fit: cover;
`

export const ProfileInfoContainer = styled.div`
    display: grid;
    grid-template-columns: 1fr 2fr 1fr;
    gap: 2rem;
    padding: 0 2rem;
    margin-top: -150px;
    position: relative;
    z-index: 1;
`

export const ProfileWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    background: white;
    padding: 2rem;
    padding-top: 4rem;
    border-radius: 12px 12px 0 0;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    margin-top: 75px;
    position: relative;
`

export const ProfileImage = styled.img`
    width: 200px;
    height: 200px;
    border-radius: 50%;
    object-fit: cover;
    border: 4px solid transparent;
    position: absolute;
    top: -100px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 2;
`

export const ProfileInfo = styled.div`
    text-align: center;
    margin-top: 5rem;
    
    h1 {
        font-size: 1.5rem;
        margin-bottom: 0.5rem;
    }
    
    p {
        color: #666;
        margin-bottom: 1rem;
    }
`

export const LikesInterestWrapper = styled.div`
    background: white;
    padding: 1.5rem;
    border-radius: 12px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    margin-top: 11rem;
    margin-bottom: 2rem;
    h2 {
        margin-bottom: 1rem;
        font-size: 1.2rem;
    }
`

export const InterestGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
    
    img {
        width: 100%;
        height: 100px;
        object-fit: cover;
        border-radius: 8px;
    }
`

export const PostWrapper = styled.div`
    background: white;
    padding: 1.5rem;
    border-radius: 12px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    margin-top: 11rem;
    margin-bottom: 2rem;

    h2 {
        margin-bottom: 1rem;
        font-size: 1.2rem;
    }
`

export const PostGrid = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
    
    .post {
        background: #f8f8f8;
        padding: 1rem;
        border-radius: 8px;
        
        img {
            width: 100%;
            height: 200px;
            object-fit: cover;
            border-radius: 8px;
            margin-bottom: 0.5rem;
        }
        
        p {
            color: #666;
        }
    }
`
