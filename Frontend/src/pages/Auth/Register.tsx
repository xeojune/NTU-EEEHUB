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
import { useNavigate } from 'react-router';
import { registerUserApi } from '../../apis/registerApi';
import RegisterIllustration from '../../assets/loginImg/RegisterLogo.png';
import { ForgotPasswordLink } from '../../styles/Auth/LoginStyle';

interface RegisterData {
  email: string;
  password: string;
  name: string;
}

const Register: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [emailValid, setEmailValid] = useState(false);
  const [pwValid, setPwValid] = useState(false);
  const [pwConfirmValid, setPwConfirmValid] = useState(false);
  const [nameValid, setNameValid] = useState(false);
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
    const hasMinLength = newPassword.length >= 8;
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
      if (!hasMinLength) errors.push('Password must be at least 8 characters');
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

  const handleName = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setName(newName);
    const isValid = newName.length >= 2;
    setNameValid(isValid);
    if (!isValid) {
      setErrorMessage('Name must be at least 2 characters long');
    } else {
      setErrorMessage('');
    }
  };

  useEffect(() => {
    setNotAllow(!(emailValid && pwValid && pwConfirmValid && nameValid));
  }, [emailValid, pwValid, pwConfirmValid, nameValid]);

  const onClickRegister = async () => {
    if (!emailValid || !pwValid || !pwConfirmValid || !nameValid) {
      setErrorMessage('Please check all fields are valid');
      return;
    }

    try {
      const registerData: RegisterData = {
        email,
        password,
        name,
      };
      
      await registerUserApi(registerData);
      alert('Registration Successful');
      navigate('/login');
    } catch (error) {
      setErrorMessage('Registration failed. Please try again.');
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
            Sign Up
          </SubLogoWrap>
          <ContentWrap>
            <InputWrap>
              <InputTitle>Email</InputTitle>
              <RegisterInput
                type='text'
                value={email}
                onChange={handleEmail}
                placeholder="login@gmail.com"
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
                  {pwErrors.length && <div>• Password must be at least 8 characters</div>}
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
              <InputTitle>Name</InputTitle>
              <RegisterInput
                type='text'
                value={name}
                onChange={handleName}
                placeholder="Personal Name"
              />
              {!nameValid && name.length > 0 && (
                <ErrorMessageWrap>Name must be at least 2 characters long</ErrorMessageWrap>
              )}
            </InputWrap>
            <ForgotPasswordLink href="/login">Already have an account?</ForgotPasswordLink>
            {errorMessage && (
              <ErrorMessageWrap>{errorMessage}</ErrorMessageWrap>
            )}
          </ContentWrap>
          <ButtonWrap>
            <RegisterButton onClick={onClickRegister} disabled={notAllow}>
              REGISTER
            </RegisterButton>
          </ButtonWrap>
        </StyledRegisterBox>
      </RegisterContainer>

      <IllustrationContainer>
        <RegisterImage src={RegisterIllustration} alt="Register Illustration" />
      </IllustrationContainer>
      <BackgroundContainer />
    </RegisterPage>
  );
};

export default Register;
