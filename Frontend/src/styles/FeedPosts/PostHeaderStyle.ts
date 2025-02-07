import styled from 'styled-components'

// Main Container (Similar to Flex with space-between)
export const PostHeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-bottom: 8px; 
  margin-top: 8px;
  padding: 8px 16px;
`

// Flex Container for Avatar and Text
export const FlexContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`

// Avatar (Similar to <Avatar>)
export const AvatarImage = styled.img<{ width?: string; height?: string }>`
  width: ${(props) => props.width || '32px'};
  height: ${(props) => props.height || '32px'};
  border-radius: 50%;
  object-fit: cover;
`

export const PostInformation = styled.div`
    display: flex;
    flex-direction: column;
    gap: 4px;
`

// Username Text
export const TextBox = styled.span`
  font-size: 12px;
  font-weight: bold;
  color: white;
`
export const SubTextBox = styled.div`
    display: flex;
    gap: 8px;
`
// Subtext (Light gray text)
export const SubText = styled.span<{ color?: string }>`
  color: ${(props) => props.color || 'gray'};
  font-size: 12px;
`

// Options Button (three dots icon)
export const OptionsButton = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  color: white;

  &:hover {
    color: black;
  }

  svg {
    vertical-align: middle;
  }
`
