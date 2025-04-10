import React, { useState, useEffect } from 'react';
import {
  ButtonWrap,
  ContentWrap,
  ErrorMessageWrap,
  InputTitle,
  InputWrap,
  RegisterContainer,
  RegisterInput,
  RegisterPage,
  SubLogoWrap,
  TitleWrap,
  IllustrationContainer,
  RegisterButton,
  RegisterImage,
  BackgroundContainer,
  StyledRegisterBox
} from '../../styles/Auth/RegisterStyle';
import { useNavigate, Link } from 'react-router';
import { adminApi } from '../../apis/adminApi';
import RegisterIllustration from '../../assets/loginImg/RegisterLogo.png';
import styled from 'styled-components';

interface AdminRegisterData {
  email: string;
  password: string;
  username: string;
}

const LoginLink = styled(Link)`
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

const AdminRegister: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [emailValid, setEmailValid] = useState(false);
  const [pwValid, setPwValid] = useState(false);
  const [pwConfirmValid, setPwConfirmValid] = useState(false);
  const [usernameValid, setUsernameValid] = useState(false);
  const [pwErrors, setPwErrors] = useState({
    length: false,
    number: false,
    special: false
  });
  const [notAllow, setNotAllow] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    const regex =
      /^(([^<>()\[\].,;:\s@"]+(\.[^<>()\[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i;
    if (regex.test(newEmail)) {
      setEmailValid(true);
      setErrorMessage('');
    } else {
      setEmailValid(false);
      if (!newEmail.includes('@')) {
        setErrorMessage('Please enter a valid email address');
      } else {
        setErrorMessage('');
      }
    }
  };

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
    const isValid = hasMinLength && hasNumber && hasSpecial;
    setPwValid(isValid);
    
    if (!isValid) {
      let errors = [];
      if (!hasMinLength) errors.push('Password must be at least 6 characters');
      if (!hasNumber) errors.push('Password must contain at least one number');
      if (!hasSpecial) errors.push('Password must contain at least one special character');
      setErrorMessage(errors.join('\n'));
    } else {
      setErrorMessage('');
    }
  };

  const handleConfirmPassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    const confirmPw = e.target.value;
    setConfirmPassword(confirmPw);
    const isValid = confirmPw === password;
    setPwConfirmValid(isValid);
    if (!isValid) {
      setErrorMessage('Passwords do not match');
    } else {
      setErrorMessage('');
    }
  };

  const handleUsername = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUsername = e.target.value;
    setUsername(newUsername);
    const isValid = newUsername.length >= 2;
    setUsernameValid(isValid);
    if (!isValid) {
      setErrorMessage('Username must be at least 2 characters long');
    } else {
      setErrorMessage('');
    }
  };

  useEffect(() => {
    setNotAllow(!(emailValid && pwValid && pwConfirmValid && usernameValid));
  }, [emailValid, pwValid, pwConfirmValid, usernameValid]);

  const onClickRegister = async () => {
    if (!emailValid || !pwValid || !pwConfirmValid || !usernameValid) {
      setErrorMessage('Please check all fields are valid');
      return;
    }

    try {
      const registerData: AdminRegisterData = {
        email,
        password,
        username,
      };
      
      console.log('Attempting to register admin with data:', {
        email: registerData.email,
        username: registerData.username,
        passwordLength: registerData.password.length
      });
      
      const response = await adminApi.register(registerData);
      console.log('Registration response:', response);
      
      if (response) {
        alert('Admin Registration Successful');
        navigate('/admin/login');
      }
    } catch (error: any) {
      console.error('Registration error details:', {
        error: error,
        response: error.response,
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      setErrorMessage(error.response?.data?.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <RegisterPage>
      <RegisterContainer>
        <StyledRegisterBox>
          <TitleWrap>
            EEEHUB
          </TitleWrap>
          <SubLogoWrap>
            Admin Sign Up
          </SubLogoWrap>
          <ContentWrap>
            <InputWrap>
              <InputTitle>Email</InputTitle>
              <RegisterInput
                type='text'
                value={email}
                onChange={handleEmail}
                placeholder="admin@eeehub.com"
              />
              {!emailValid && email.length > 0 && (
                <ErrorMessageWrap>Please enter a valid email address</ErrorMessageWrap>
              )}
            </InputWrap>
            <InputWrap>
              <InputTitle>Password</InputTitle>
              <RegisterInput
                type='password'
                value={password}
                onChange={handlePassword}
                placeholder="••••••••••••"
              />
              {password.length > 0 && (
                <ErrorMessageWrap>
                  {pwErrors.length && <div>• Password must be at least 6 characters</div>}
                  {pwErrors.number && <div>• Password must contain at least one number</div>}
                  {pwErrors.special && <div>• Password must contain at least one special character</div>}
                </ErrorMessageWrap>
              )}
            </InputWrap>
            <InputWrap>
              <InputTitle>Confirm Password</InputTitle>
              <RegisterInput
                type='password'
                value={confirmPassword}
                onChange={handleConfirmPassword}
                placeholder="••••••••••••"
              />
              {!pwConfirmValid && confirmPassword.length > 0 && (
                <ErrorMessageWrap>Passwords do not match</ErrorMessageWrap>
              )}
            </InputWrap>
            <InputWrap>
              <InputTitle>Username</InputTitle>
              <RegisterInput
                type='text'
                value={username}
                onChange={handleUsername}
                placeholder="Admin Username"
              />
              {!usernameValid && username.length > 0 && (
                <ErrorMessageWrap>Username must be at least 2 characters long</ErrorMessageWrap>
              )}
            </InputWrap>
            <LoginLink to="/admin/login">Already have an admin account?</LoginLink>
          </ContentWrap>
          <ButtonWrap>
            <RegisterButton onClick={onClickRegister} disabled={notAllow}>
              REGISTER AS ADMIN
            </RegisterButton>
          </ButtonWrap>
          {errorMessage && (
            <ErrorMessageWrap style={{ marginTop: '10px' }}>{errorMessage}</ErrorMessageWrap>
          )}
        </StyledRegisterBox>
      </RegisterContainer>

      <IllustrationContainer>
        <RegisterImage src={RegisterIllustration} alt="Register Illustration" />
      </IllustrationContainer>
      <BackgroundContainer />
    </RegisterPage>
  );
};

export default AdminRegister;