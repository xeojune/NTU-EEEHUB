import styled from "styled-components";
import { Link } from "react-router";

interface LoginBoxProps {
    width?: string;
    height?: string;
  }

//Login Page Setting
export const LoginPage = styled.div`
    position: absolute;
    top: 0;
    bottom: 0;
    width: 100%;
    height: 100vh;
`;

//Container for Title + Logo + Input Containers
export const LoginContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

export const StyledLoginBox = styled.div<LoginBoxProps>`
  width: ${props => props.width ? props.width : '100%'};
  height: ${props => props.height ? props.height : '500px'};
  padding: 20px;
  display: flex;
  max-width: 400px;
  flex-direction: column;
  background-color: #f7f7f7;
  border-radius: 10px;
  font-family: 'Poppins', sans-serif;
`;

//Form Title
export const TitleWrap = styled.div`
    display: flex;
    flex-direction: column;
`;

//Form Logo
export const LogoWrap = styled.div`
    font-size: 28px;
    color: #D71541;
    font-weight: bold;
    display: flex;
    width: 100%;
`;

export const SubLogoWrap = styled.div`
    font-size: 48px;
    color: #1B1C62;
    font-weight: bold;
    margin-bottom: 3rem;
    display: flex;
    width: 100%;
    margin-top: 10px;
`;

export const ContentWrap = styled.div`
    display: flex;
    flex-direction: column;
    margin-bottom: 2rem;
`;


//Input Title for id, pw
export const InputTitle = styled.div`
    font-size: 12px;
    margin-left: 4px;
    margin-bottom: 8px;
    transition: color 0.3s ease;
    font-weight: 300;
`;

//Input Container for id, pw
export const InputWrap = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  border-radius: 8px;
  padding: 10px;
  background-color: #D9D9D9;
  border: 1px solid #e2e0e0;
  transition: border-color 0.3s ease;

  &:focus-within {
    border-color: #D71541;

    ${InputTitle} {
      color: #a1e0fa;
    }
  }
`;

//
export const LoginInput = styled.input`
    width: 100%;
    outline: none;
    border: none;
    height: 17px;
    font-size: 14px;
    font-weight: 400;
    background-color: transparent;
`;

export const ErrorMessageWrap = styled.div`
    margin-top: 8px;
  color: #ef0000;
  font-size: 12px;
  margin-left: 4px;
`;

export const ButtonWrap = styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
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

