import styled from "styled-components";
import { Link } from "react-router";

interface LoginBoxProps {
    width?: string;
    height?: string;
  }

//Login Page Setting
export const LoginPage = styled.div`
  display: flex;
  width: 100%;
  height: 100vh;
  background-color: #fff;
`;

//Container for Title + Logo + Input Containers
export const LoginContainer = styled.div`
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
  transform: translateY(-45%) translateX(-10%);
  width: 40%;
  z-index: 2;
`;

export const LoginImage = styled.img`
  width: 120%;
  height: auto;
  filter: drop-shadow(0 4px 20px rgba(0, 0, 0, 0.1));
`;

export const StyledLoginBox = styled.div<LoginBoxProps>`
  width: 100%;
  max-width: 450px;
  margin: 0 auto;
  padding: 20px;
  transform: translateX(-15%);
`;

//Form Title
export const TitleWrap = styled.div`
  margin-bottom: 40px;
`;

//Form Logo
export const LogoWrap = styled.div`
  font-size: 32px;
  color: #D71541;
  font-weight: 700;
  margin-bottom: 8px;
`;

export const SubLogoWrap = styled.div`
  font-size: 52px;
  color: #1B1464;
  font-weight: 800;
  font-family: 'Poppins', sans-serif;
`;

export const ContentWrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

//Input Title for id, pw
export const InputTitle = styled.div`
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
  font-weight: 500;
`;

//Input Container for id, pw
export const InputWrap = styled.div`
  width: 100%;
  margin-bottom: 8px;
`;

export const LoginInput = styled.input`
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #E0E0E0;
  border-radius: 8px;
  font-size: 16px;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #1B1464;
    box-shadow: 0 0 0 2px rgba(27, 20, 100, 0.1);
  }

  &::placeholder {
    color: #999;
  }
`;

export const ErrorMessageWrap = styled.div`
  color: #D71541;
  font-size: 12px;
  margin-top: 4px;
`;

export const ButtonWrap = styled.div`
  margin-top: 16px;
  display: flex;
  justify-content: center;
`;

export const LoginButton = styled.button`
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

export const ForgotPasswordLink = styled.a`
  color: #666;
  font-size: 14px;
  text-decoration: none;
  text-align: right;
  display: block;

  &:hover {
    color: #1B1464;
  }
`;

export const CreateAccountWrap = styled.div`
  text-align: center;
  margin-top: 20px;
`;

export const CreateAccountLink = styled(Link)`
  color: blue;
  text-decoration: none;
  font-weight: bold;

  &:hover {
    text-decoration: underline;
  }
`;
