import styled from "styled-components";

export const FeedPostContainer = styled.div`
    background: #1f1f27;
    border-radius: 8px;
`
export const ImageContainer = styled.div`
  width: 100%;
  overflow: hidden; /* Hide any overflow content */
  position: relative; /* Ensures absolute positioning inside if needed */
  padding-top: 100%;

  @media (max-width: 768px) {
    /* Optional: Adjust for smaller screens */
    padding-top: 100%; /* Keeps the 1:1 ratio */
  }
`

export const PostImage = styled.img<{ centerX?: number; centerY?: number }>`
  width: auto;
  height: auto;
  min-width: 100%;
  min-height: 100%;
  position: absolute;
  display: block;
  max-width: 100%;
  object-fit: cover;

  ${({ centerX = 50, centerY = 0 }) => `
    top: ${centerY}%;
    left: ${centerX}%;
    transform: translate(-${centerX}%, -${centerY}%);
  `}
`

