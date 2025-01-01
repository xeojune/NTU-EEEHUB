import React, { useEffect, useState } from 'react';
import { ButtonWrap, ContentWrap, CreateAccountLink, CreateAccountWrap, ErrorMessageWrap, InputTitle, InputWrap, LoginContainer, LoginInput, LoginPage, LogoWrap, StyledLoginBox, SubLogoWrap, TitleWrap } from '../../styles/Auth/LoginStyle';
import { Button } from '../../components/Buttons';
import { useNavigate } from 'react-router';
import { registerUserApi } from '../../apis/registerApi';

const Register: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [emailValid, setEmailValid] = useState(false);
  const [pwValid, setPwValid] = useState(false);
  const [pwMatch, setPwMatch] = useState(false);
  const [notAllow, setNotAllow] = useState(true);

  const navigate = useNavigate();

  const handleEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    const regex =
      /^(([^<>()\[\].,;:\s@"]+(\.[^<>()\[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i;
    if (regex.test(email)) {
      setEmailValid(true);
    } else {
      setEmailValid(false);
    }
  };

  const handlePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    const regex =
      /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[$`~!@$!%*#^?&\\(\\)\-_=+])(?!.*[^a-zA-Z0-9$`~!@$!%*#^?&\\(\\)\-_=+]).{8,20}$/;
    if (regex.test(password)) {
      setPwValid(true);
    } else {
      setPwValid(false);
    }
  };

  const handleConfirmPassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
    setPwMatch(e.target.value === password);
  };

  const onClickRegisterButton = async () => {
    if (emailValid && pwValid && pwMatch && name) {
      try {
        const response = await registerUserApi({ name, email, password }); // Call the API service
        console.log('Registration successful:', response);
        alert('Registration Successful!');
        navigate('/login'); // Redirect to the login page
      } catch (error) {
        console.error('Registration failed:', error);
        alert('Registration failed. Please try again.');
      }
    }
  };

  useEffect(() => {
    if (emailValid && pwValid && pwMatch && name.length > 0) {
      setNotAllow(false);
      return;
    }
    setNotAllow(true);
  }, [emailValid, pwValid, pwMatch, name]);

  return (
    <LoginPage>
      <LoginContainer>
        <StyledLoginBox>
          <TitleWrap>
            <LogoWrap>EEEHub</LogoWrap>
            <SubLogoWrap>REGISTER</SubLogoWrap>
          </TitleWrap>
          <ContentWrap>
            <InputTitle>Name</InputTitle>
            <InputWrap>
              <LoginInput type='text' value={name} onChange={(e) => setName(e.target.value)} placeholder='Type your Name' />
            </InputWrap>

            <InputTitle>Email</InputTitle>
            <InputWrap>
              <LoginInput type='text' value={email} onChange={handleEmail} placeholder='Type your Email' />
            </InputWrap>
            <ErrorMessageWrap>
              {
                !emailValid && email.length > 0 && (
                  <div>Incorrect Email. Please Input Correct Email.</div>
                )
              }
            </ErrorMessageWrap>

            <InputTitle>Password</InputTitle>
            <InputWrap>
              <LoginInput type='password' value={password} onChange={handlePassword} placeholder='Type your Password' />
            </InputWrap>
            <ErrorMessageWrap>
              {
                !pwValid && password.length > 0 && (
                  <>
                    <div>*Password must be more than 8 characters.</div>
                    <div>*Password must contain at least one numerical character.</div>
                    <div>*Password must contain at least one special character.</div>
                  </>
                )
              }
            </ErrorMessageWrap>

            <InputTitle>Confirm Password</InputTitle>
            <InputWrap>
              <LoginInput type='password' value={confirmPassword} onChange={handleConfirmPassword} placeholder='Confirm your Password' />
            </InputWrap>
            <ErrorMessageWrap>
              {
                !pwMatch && confirmPassword.length > 0 && (
                  <div>*Passwords do not match.</div>
                )
              }
            </ErrorMessageWrap>
          </ContentWrap>

          <ButtonWrap>
            <Button onClick={onClickRegisterButton} disabled={notAllow} width='120px' height='35px' radius='2rem' background='#D71541'>REGISTER</Button>
          </ButtonWrap>

          <CreateAccountWrap>
            <span>Already have an Account?</span>
            <CreateAccountLink to="/login"> Login</CreateAccountLink>
          </CreateAccountWrap>

        </StyledLoginBox>
      </LoginContainer>
    </LoginPage>
  );
};

export default Register;
