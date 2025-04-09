import styled from "styled-components";

export const ProfileContainer = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    height: calc(100vh - 60px);
    background-color: white;
`

export const BackgroundImageWrapper = styled.div`
    position: relative;
    width: 100%;
    height: 300px;
    border-radius: 0 12px;
    overflow: hidden;
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
    left: 50%;
    transform: translateX(-50%);
    z-index: 2;
    transition: filter 0.3s;
`

export const RankFrame = styled.img`
    position: absolute;
    width: 300px;
    height: 300px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 3;
`

export const ProfileImageContainer = styled.div`
    position: absolute;
    top: -100px;
    left: 50%;
    transform: translateX(-50%);
    width: 200px;
    height: 200px;
    cursor: pointer;
    border-radius: 50%;

    .camera-icon {
        display: none;
        position: absolute;
        width: 70px;
        height: 70px;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 24px;
        background-color: rgba(255, 255, 255, 0);
        padding: 8px;
        border-radius: 50%;
        z-index: 3;
        color: white;
    }

    &:hover {
        .camera-icon {
            display: block;
        }

        ${ProfileImage} {
            filter: brightness(0.5);
        }
    }
`

export const HiddenFileInput = styled.input`
    display: none;
`

export const RankingBar = styled.div`
    display: flex;
    width: 150%;
    margin-left: -25%;
    height: 40px;
    margin-top: 15px;
    margin-bottom: 15px;
    border-radius: 6px;
    overflow: visible;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    position: relative;
    bottom: 1rem;
`

export const RankingSection = styled.div<{ color: string; width: string; text: string; points: string; isCurrentRank: boolean }>`
    position: relative;
    background-color: ${props => props.color};
    width: ${props => props.width};
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    color: white;
    cursor: pointer;
    transition: all 0.3s ease;
    gap: 4px;
    transform: ${props => props.isCurrentRank ? 'scaleY(1.5)' : 'scaleY(1)'};
    z-index: ${props => props.isCurrentRank ? 2 : 1};
    box-shadow: ${props => props.isCurrentRank ? '0 0 10px rgba(255, 255, 255, 0.5)' : 'none'};
    border: ${props => props.isCurrentRank ? '2px solid white' : 'none'};

    .rank-icon {
        font-size: ${props => props.isCurrentRank ? '22px' : '18px'};
        transition: all 0.3s ease;
        filter: ${props => props.isCurrentRank ? 'drop-shadow(0 0 5px rgba(255, 255, 255, 0.7))' : 'none'};
    }

    &:hover {
        transform: ${props => props.isCurrentRank ? 'scaleY(1.2)' : 'scaleY(1.1)'};
    }

    &:hover::before {
        content: '';
        position: absolute;
        left: 50%;
        transform: translateX(-50%) rotate(45deg);
        width: 8px;
        height: 8px;
        background: rgba(0, 0, 0, 0.85);
        top: -31px;
        z-index: 100;
    }

    &:hover::after {
        content: "${props => props.text} (${props => props.points})";
        position: absolute;
        top: -45px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(0, 0, 0, 0.85);
        color: white;
        padding: 6px 12px;
        border-radius: 6px;
        font-size: 13px;
        font-weight: 500;
        white-space: nowrap;
        z-index: 100;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    }
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
    border: 1px solid #E3E3E3;
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
    border: 1px solid #E3E3E3;
    margin-top: 11rem;
    margin-bottom: 2rem;

    h2 {
        margin-bottom: 1.5rem;
        font-size: 1.2rem;
    }
`

export const PostOverlay = styled.div`
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 0.75rem;
    background: linear-gradient(to top, rgba(0,0,0,0.8), transparent);
    opacity: 0;
    transition: opacity 0.2s ease;
    
    .stats {
        display: flex;
        justify-content: center;
        gap: 1rem;
        color: white;
    }

    .stat-item {
        display: flex;
        align-items: center;
        gap: 0.3rem;
        
        svg {
            color: white;
            font-size: 16px;
        }
        
        span {
            font-size: 0.8rem;
            font-weight: 500;
        }
    }
`

export const PostGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
    max-width: 500px;
    margin: 0 auto;
    
    .post {
        position: relative;
        aspect-ratio: 1;
        overflow: hidden;
        border-radius: 8px;
        cursor: pointer;
        transition: transform 0.2s ease;
        
        &:hover {
            transform: scale(1.02);
            
            ${PostOverlay} {
                opacity: 1;
            }
        }
        
        img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            border-radius: 8px;
        }
    }
`

export const StatsText = styled.p`
    display: inline-block;
    margin: 0 15px;
    padding: 8px 16px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 20px;
    backdrop-filter: blur(10px);
    transition: all 0.3s ease;
    cursor: pointer;

    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    span {
        font-weight: 600;
        color: #333;
        margin-left: 4px;
    }
`

export const RankText = styled.p<{ rankColor: string }>`
    display: inline-block;
    margin: 10px 15px;
    padding: 8px 16px;
    border: 2px solid ${props => props.rankColor};
    border-radius: 20px;
    color: white;
    font-weight: 600;
    transition: all 0.3s ease;

    .rank-icon {
        margin-right: 8px;
        vertical-align: middle;
    }

    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px ${props => props.rankColor}50;
    }
`

export const PointsText = styled.p<{ rankColor: string }>`
    display: inline-block;
    margin: 10px 15px;
    padding: 8px 16px;
    background: ${props => props.rankColor};
    border-radius: 20px;
    color: white;
    font-weight: 500;
    transition: all 0.3s ease;

    .points-icon {
        margin-right: 8px;
        vertical-align: middle;
    }

    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px ${props => props.rankColor}50;
    }
`

export const DetailContainer = styled.div`
    margin: 20px 0;
    position: relative;
    width: 100%;
    max-width: 600px;
    
    textarea {
        width: 100%;
        min-height: 80px;
        padding: 12px;
        border: 1px solid #ddd;
        border-radius: 8px;
        font-size: 14px;
        resize: vertical;
        background-color: #f8f9fa;
        
        &:focus {
            outline: none;
            border-color: #0066cc;
        }
    }
`;

export const DetailText = styled.p`
    font-size: 14px;
    color: #666;
    line-height: 1.5;
    margin: 0;
    padding: 12px;
    background-color: #f8f9fa;
    border-radius: 8px;
    min-height: 80px;
`;

export const EditButton = styled.button`
    position: absolute;
    top: 8px;
    right: 8px;
    background-color: transparent;
    border: none;
    color: #0066cc;
    cursor: pointer;
    font-size: 12px;
    padding: 4px 8px;
    border-radius: 4px;
    
    &:hover {
        background-color: rgba(0, 102, 204, 0.1);
    }
`;
