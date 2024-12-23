import styled from 'styled-components'

// Main container for the footer
export const PostFooterContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 10px 8px;
`

// Group for the icons
export const IconGroup = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  .bookmark {
    margin-left: auto; /* Push bookmark icon to the far right */
  }
`

// Individual icons styled as buttons
export const IconButton = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  margin-right: 8px;
  padding: 0;

  &:hover {
    opacity: 0.7;
  }
`

// Likes text
export const LikesText = styled.span`
  font-size: 14px;
  font-weight: bold;
  color: #fff;
  cursor: pointer;
`

// Username and Comment
export const CommentSection = styled.div`
  font-size: 14px;
  color: #fff;

  strong {
    font-weight: bold;
  }
`

export const CommentsButtonContainer = styled.div`
    display: flex;
    justify-content: flex-start;
`
// View all comments button
export const ViewCommentsButton = styled.button`
  background: none;
  border: none;
  color: #888;
  cursor: pointer;
  font-size: 14px;

  &:hover {
    text-decoration: underline;
  }
`

// Add a comment input
export const CommentInput = styled.input`
  border: none;
  border-top: 1px solid #e0e0e0;
  padding: 8px 0;
  font-size: 14px;
  background: transparent;
  outline: none;
  color: #fff;

  &::placeholder {
    color: #888;
  }
`
