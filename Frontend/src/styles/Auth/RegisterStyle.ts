import styled from "styled-components";

interface RegisterBoxProps {
    width?: string;
    height?: string;
}

export const RegisterPage = styled.div`
  display: flex;
  width: 100%;
  height: 100vh;
  background-color: #fff;
`;

export const RegisterContainer = styled.div`
  display: flex;
  width: 60%;
  padding: 40px;
  flex-direction: column;
  justify-content: center;
  position: relative;
  z-index: 1;
`;

export const BackgroundContainer = styled.div`
  position: absolute;
  right: 0;
  top: 0;
  width: 37%;
  height: 100%;
  background-color: #1B1464;
  border-top-left-radius: 50px;
  border-bottom-left-radius: 50px;
  z-index: 0;
`;

export const IllustrationContainer = styled.div`
  position: absolute;
  left: 45%;
  top: 50%;
  transform: translateY(-50%) translateX(-5%);
  width: 40%;
  z-index: 2;
`;

export const RegisterImage = styled.img`
  width: 120%;
  height: auto;
`;

export const LogoWrap = styled.div`
  margin-bottom: 20px;
`;

export const NTULogo = styled.div`
  position: absolute;
  bottom: 10px;
  left: 40px;
  
  img {
    height: 150px;
    width: auto;
  }
`;

export const TitleWrap = styled.div`
  font-size: 32px;
  font-weight: 700;
  color: #E31837;
  margin-bottom: 10px;
`;

export const SubLogoWrap = styled.div`
  font-size: 52px;
  font-weight: 600;
  color: #1B1464;
  margin-bottom: 40px;
`;

export const ContentWrap = styled.div`
  margin: 0 auto;
  width: 460px;
`;

export const InputWrap = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
`;

export const InputTitle = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #262626;
  margin-bottom: 8px;
`;

export const RegisterInput = styled.input`
  width: 100%;
  height: 48px;
  padding: 0 16px;
  border: 1px solid #e5e5e5;
  border-radius: 6px;
  outline: none;
  font-size: 14px;

  &:focus {
    border: 1px solid #1B1464;
  }

  &::placeholder {
    color: #dadada;
  }
`;

export const ErrorMessageWrap = styled.div`
  margin: 8px 0 16px;
  color: #ef0000;
  font-size: 12px;
`;

export const ButtonWrap = styled.div`
  margin: 20px auto;
  width: 460px;
  display: flex;
  justify-content: center;
`;

export const RegisterButton = styled.button`
  width: 30%;
  padding: 14px;
  background-color: #D71541;
  color: white;
  border: none;
  border-radius: 16px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #B31234;
  }

  &:disabled {
    background-color: #E0E0E0;
    cursor: not-allowed;
  }

interface RegisterBoxProps {
    width?: string;
    height?: string;
}
`
export const StyledRegisterBox = styled.div<RegisterBoxProps>`
  width: 100%;
  max-width: 450px;
  margin: 0 auto;
  padding: 20px;
  transform: translateX(-15%);
`;