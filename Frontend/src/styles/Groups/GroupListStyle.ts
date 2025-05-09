import styled from 'styled-components';

export const PageContainer = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

export const Title = styled.h1`
  font-size: 2rem;
  color: #1a73e8;
  margin: 0;
`;

export const CreateButton = styled.button`
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

export const GroupList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  padding: 1rem;
`;

export const GroupCard = styled.div`
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  cursor: pointer;
  padding: 1.5rem;

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 20px rgba(0, 0, 0, 0.15);
  }
`;

export const GroupName = styled.h3`
  margin: 0 0 0.75rem;
  color: #1a73e8;
  font-size: 1.4rem;
  font-weight: 600;
  line-height: 1.3;
`;

export const GroupDescription = styled.p`
  color: #5f6368;
  margin: 0 0 1rem;
  font-size: 0.95rem;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const MemberCount = styled.div`
  color: #5f6368;
  font-size: 0.9rem;
  margin-top: auto;
`;

export const NoGroupsContainer = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

export const NoGroupsTitle = styled.h2`
  color: #1a73e8;
  font-size: 1.5rem;
  margin-bottom: 1rem;
`;

export const NoGroupsText = styled.p`
  color: #5f6368;
  font-size: 1rem;
  margin-bottom: 2rem;
`;

// Modal Styles
export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

export const ModalContent = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 16px;
  width: 100%;
  max-width: 500px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
`;

export const ModalTitle = styled.h2`
  color: #1a73e8;
  margin: 0 0 1.5rem;
  font-size: 1.5rem;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const Label = styled.label`
  color: #202124;
  font-size: 0.9rem;
  font-weight: 500;
`;

export const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid #e8eaed;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.2s;

  &:focus {
    border-color: #1a73e8;
    outline: none;
  }
`;

export const TextArea = styled.textarea`
  padding: 0.75rem;
  border: 1px solid #e8eaed;
  border-radius: 8px;
  font-size: 1rem;
  min-height: 100px;
  resize: vertical;
  transition: border-color 0.2s;

  &:focus {
    border-color: #1a73e8;
    outline: none;
  }
`;

export const Select = styled.select`
  padding: 0.75rem;
  border: 1px solid #e8eaed;
  border-radius: 8px;
  font-size: 1rem;
  background-color: white;
  cursor: pointer;
  transition: border-color 0.2s;

  &:focus {
    border-color: #1a73e8;
    outline: none;
  }
`;

export const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
`;

export const Button = styled.button<{ variant?: 'primary' }>`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  ${props => props.variant === 'primary' ? `
    background-color: #1a73e8;
    color: white;

    &:hover {
      background-color: #1557b0;
    }
  ` : `
    background-color: #f1f3f4;
    color: #5f6368;

    &:hover {
      background-color: #e8eaed;
    }
  `}
`;

export const GroupImage = styled.div<{ url: string }>`
  height: 150px;
  background: ${props => `url(${props.url})`};
  background-size: cover;
  background-position: center;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.2) 100%);
  }
`;

export const GroupContent = styled.div`
  padding: 1.5rem;
  position: relative;
`;

export const GroupFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1rem;
  border-top: 1px solid #e8eaed;
`;

export const GroupPrivacy = styled.span<{ privacy: 'public' | 'private' }>`
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
  gap: 0.25rem;
  background: ${props => props.privacy === 'public' ? '#e8f0fe' : '#fce8e6'};
  color: ${props => props.privacy === 'public' ? '#1a73e8' : '#d93025'};

  svg {
    width: 14px;
    height: 14px;
  }
`;