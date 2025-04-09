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
  color: white;
`;

export const CreateButton = styled.button`
  background-color: #1a73e8;
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #1557b0;
  }
`;

export const GroupList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
`;

export const GroupCard = styled.div`
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 1rem;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  background: white;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;

export const GroupImage = styled.img`
  height: 150px;
  background-size: cover;
  background-position: center;
  border-radius: 4px;
  margin-bottom: 1rem;
`;

export const GroupName = styled.h3`
  margin: 0 0 0.5rem;
  color: #333;
  font-size: 1.25rem;
`;

export const GroupDescription = styled.p`
  color: #666;
  margin: 0 0 1rem;
  font-size: 0.9rem;
  line-height: 1.4;
`;

export const MemberCount = styled.span`
  color: #888;
  font-size: 0.85rem;
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
  border-radius: 8px;
  width: 100%;
  max-width: 500px;
  position: relative;
`;

export const ModalTitle = styled.h2`
  margin: 0 0 1.5rem;
  color: #333;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const Label = styled.label`
  color: #555;
  font-size: 0.9rem;
`;

export const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: #1a73e8;
  }
`;

export const TextArea = styled.textarea`
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  min-height: 100px;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: #1a73e8;
  }
`;

export const Select = styled.select`
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  background: white;

  &:focus {
    outline: none;
    border-color: #1a73e8;
  }
`;

export const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
`;

export const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;

  ${props => props.variant === 'primary' ? `
    background-color: #1a73e8;
    color: white;
    &:hover {
      background-color: #1557b0;
    }
  ` : `
    background-color: #f5f5f5;
    color: #333;
    &:hover {
      background-color: #e0e0e0;
    }
  `}
`;

export const NoGroupsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  text-align: center;
  background: #f8f9fa;
  border-radius: 8px;
  margin: 2rem 0;
`;

export const NoGroupsTitle = styled.h3`
  color: #343a40;
  margin-bottom: 1rem;
  font-size: 1.5rem;
`;

export const NoGroupsText = styled.p`
  color: #6c757d;
  margin-bottom: 1.5rem;
  font-size: 1rem;
  line-height: 1.5;
`;