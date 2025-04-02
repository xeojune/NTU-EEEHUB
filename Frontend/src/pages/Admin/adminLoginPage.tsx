import React, { useEffect, useState } from 'react';
import {
  ButtonWrap,
  ContentWrap,
  ErrorMessageWrap,
  InputTitle,
  InputWrap,
  LoginContainer,
  LoginInput,
  LoginPage,
  LogoWrap,
  StyledLoginBox,
  SubLogoWrap,
  TitleWrap,
  IllustrationContainer,
  LoginButton,
  NTULogo,
  LoginImage,
  BackgroundContainer
} from '../../styles/Auth/LoginStyle';
import { useNavigate, Link } from 'react-router';
import { adminApi } from '../../apis/adminApi';
import LoginIllustration from '../../assets/loginImg/LoginLogo.png';
import NTUImage from '../../assets/loginImg/NTU.png';
import styled from 'styled-components';

const RegisterLink = styled(Link)`
  display: block;
  text-align: right;
  color: #888888;
  font-size: 14px;
  margin: 10px 0;
  text-decoration: none;
  &:hover {
    color: #666666;
  }
`;

const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailValid, setEmailValid] = useState(false);
  const [pwValid, setPwValid] = useState(false);
  const [pwErrors, setPwErrors] = useState({
    length: false,
    number: false,
    special: false
  });
  const [notAllow, setNotAllow] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    const regex = 
    /^(([^<>()\[\].,;:\s@"]+(\.[^<>()\[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i;
    if(regex.test(value)) {
        setEmailValid(true);
    } else {
        setEmailValid(false);
    }
  }

  const handlePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    
    // Check each requirement separately
    const hasMinLength = newPassword.length >= 6; 
    const hasNumber = /[0-9]/.test(newPassword);
    const hasSpecial = /[$`~!@$!%*#^?&\\(\\)\-_=+]/.test(newPassword);
    
    setPwErrors({
      length: !hasMinLength,
      number: !hasNumber,
      special: !hasSpecial
    });
    
    // Password is valid only if all requirements are met
    setPwValid(hasMinLength && hasNumber && hasSpecial);
  };

  const onClickLogin = async () => {
    if (!emailValid || !pwValid) {
      setErrorMessage('Please check all fields are valid');
      return;
    }

    try {
      console.log('Attempting login with:', { email, passwordLength: password.length });
      const response = await adminApi.login({ email, password });
      console.log('Login response:', response);
      
      if (response.access_token) {
        localStorage.setItem('accessToken', response.access_token);
        localStorage.setItem('isAdmin', 'true');
        
        alert('Admin logged in Successfully');
        navigate('/admin/dashboard');
      }
    } catch (error: any) {
      console.error('Login error:', error.response?.data);
      setErrorMessage(error.response?.data?.message || 'Login failed. Please try again.');
    }
  };

  useEffect(() => {
    setNotAllow(!(emailValid && pwValid));
  }, [emailValid, pwValid]);

  return (
    <LoginPage>
      <BackgroundContainer />
      <LoginContainer>
        <StyledLoginBox>
          <TitleWrap>
            <LogoWrap>EEEHUB</LogoWrap>
            <SubLogoWrap>ADMIN LOGIN</SubLogoWrap>
          </TitleWrap>
          
          <ContentWrap>
            <div>
              <InputTitle>Email</InputTitle>
              <InputWrap>
                <LoginInput
                  type="email"
                  value={email}
                  onChange={handleEmail}
                  placeholder="Enter admin email"
                />
              </InputWrap>
              {!emailValid && email && (
                <ErrorMessageWrap>Please enter a valid email address</ErrorMessageWrap>
              )}
            </div>

            <div>
              <InputTitle>Password</InputTitle>
              <InputWrap>
                <LoginInput
                  type="password"
                  value={password}
                  onChange={handlePassword}
                  placeholder="Enter admin password"
                />
              </InputWrap>
              {!pwValid && password && (
                <ErrorMessageWrap>
                    {pwErrors.length && <div>*Password must be more than 6 characters.</div>}
                    {pwErrors.number && <div>*Password must contain at least one numerical character.</div>}
                    {pwErrors.special && <div>*Password must contain at least one special character.</div>}
                </ErrorMessageWrap>
              )}
            </div>

            {errorMessage && (
              <ErrorMessageWrap>{errorMessage}</ErrorMessageWrap>
            )}

            <RegisterLink to="/admin/register">Register as New Admin</RegisterLink>

            <ButtonWrap>
              <LoginButton
                onClick={onClickLogin}
                disabled={notAllow}
              >
                Login as Admin
              </LoginButton>
            </ButtonWrap>
          </ContentWrap>
        </StyledLoginBox>
        
        <NTULogo>
          <img src={NTUImage} alt="NTU Logo" />
        </NTULogo>
      </LoginContainer>

      <IllustrationContainer>
        <LoginImage src={LoginIllustration} alt="Login Illustration" />
      </IllustrationContainer>
    </LoginPage>
  );
};

export default AdminLogin;