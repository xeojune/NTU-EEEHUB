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
  ForgotPasswordLink,
  LoginImage,
  BackgroundContainer
} from '../../styles/Auth/LoginStyle';
import { useNavigate } from 'react-router';
import { LoginData, loginUserApi } from '../../apis/loginApi';
import LoginIllustration from '../../assets/loginImg/LoginLogo.png';
import NTUImage from '../../assets/loginImg/NTU.png';

const Login: React.FC = () => {
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
    setEmail(e.target.value);
    const regex = 
    /^(([^<>()\[\].,;:\s@"]+(\.[^<>()\[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i;
    if(regex.test(email)) {
        setEmailValid(true);
    } else {
        setEmailValid(false);
    }
  }

  const handlePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    
    // Check each requirement separately
    const hasMinLength = newPassword.length >= 8;
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
    try {
      const loginData: LoginData = {
        email,
        password,
      };
      
      const response = await loginUserApi(loginData);
      
      localStorage.setItem('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);
      localStorage.setItem('userId', response.userId);
      localStorage.setItem('username', response.username);
      
      alert('Logged in Successfully');
      navigate('/');
    } catch (error: any) {
      setErrorMessage(error.message || 'Login failed. Please try again.');
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
            <SubLogoWrap>LOGIN</SubLogoWrap>
          </TitleWrap>
          
          <ContentWrap>
            <div>
              <InputTitle>Email</InputTitle>
              <InputWrap>
                <LoginInput
                  type="email"
                  value={email}
                  onChange={handleEmail}
                  placeholder="Enter your email"
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
                  placeholder="Enter your password"
                />
              </InputWrap>
              {!pwValid && password && (
                <ErrorMessageWrap>
                    {pwErrors.length && <div>*Password must be more than 8 characters.</div>}
                    {pwErrors.number && <div>*Password must contain at least one numerical character.</div>}
                    {pwErrors.special && <div>*Password must contain at least one special character.</div>}
                </ErrorMessageWrap>
              )}
            </div>

            {errorMessage && (
              <ErrorMessageWrap>{errorMessage}</ErrorMessageWrap>
            )}

            <ForgotPasswordLink href="/register">Do not have an account?</ForgotPasswordLink>

            <ButtonWrap>
              <LoginButton
                onClick={onClickLogin}
                disabled={notAllow}
              >
                Login
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

export default Login;