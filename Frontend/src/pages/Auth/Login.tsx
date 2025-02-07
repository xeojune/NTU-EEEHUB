import React, { useEffect, useState } from 'react'
import { ButtonWrap, ContentWrap, CreateAccountLink, CreateAccountWrap, ErrorMessageWrap, InputTitle, InputWrap, LoginContainer, LoginInput, LoginPage, LogoWrap, StyledLoginBox, SubLogoWrap, TitleWrap } from '../../styles/Auth/LoginStyle'
import { Button } from '../../components/Buttons'
import { useNavigate } from 'react-router'
import { LoginData, loginUserApi } from '../../apis/loginApi'

const Login: React.FC = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('');
  const [userValid, setUserValid] = useState(false);
  const [pwValid, setPwValid] = useState(false);
  const [notAllow, setNotAllow] = useState(true); 
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
    const regex = 
    /^(([^<>()\[\].,;:\s@"]+(\.[^<>()\[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i;
    if(regex.test(username)) {
        setUserValid(true);
    } else {
        setUserValid(false);
    }
  }

  const handlePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    const regex = 
    /^(?=.*[a-zA-z])(?=.*[0-9])(?=.*[$`~!@$!%*#^?&\\(\\)\-_=+])(?!.*[^a-zA-z0-9$`~!@$!%*#^?&\\(\\)\-_=+]).{8,20}$/;
    if(regex.test(password)){
        setPwValid(true);
    } else {
        setPwValid(false);
    }
  }

  const onClickConfirmButton = async () => {
    setErrorMessage(''); // Clear previous errors
  
    const loginData: LoginData = {
      email: username,
      password: password,
    };
  
    try {
      const response = await loginUserApi(loginData);
      console.log('Login successful:', response);
  
      // Save tokens, userId, and username to localStorage
      localStorage.setItem('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);
      localStorage.setItem('userId', response.userId);
      localStorage.setItem('username', response.username); // Store username
  
      alert('Login Successful!');
      navigate('/'); // Navigate to the dashboard or desired route
    } catch (error: any) {
      console.error('Login error:', error.message);
      setErrorMessage(error.message || 'An unexpected error occurred.');
    }
  };
  

  useEffect(() => {
    if(userValid && pwValid){
        setNotAllow(false);
        return;
    }
    setNotAllow(true);
  }, [userValid, pwValid]);

  return (
    <LoginPage>
        <LoginContainer>
            <StyledLoginBox>
                <TitleWrap>
                    <LogoWrap>EEEHub</LogoWrap>
                    <SubLogoWrap>LOGIN</SubLogoWrap>
                </TitleWrap>
                <ContentWrap>
                    <InputTitle>Email</InputTitle>
                    <InputWrap>
                        <LoginInput type='text' value={username} onChange={handleLogin} placeholder='Type your Email'/>
                    </InputWrap>
                    <ErrorMessageWrap>
                        {
                            !userValid && username.length > 0 && (
                                <div>Incorrect Username. Please Input Correct Username.</div>
                            )
                        }
                    </ErrorMessageWrap>

                    <InputTitle>Password</InputTitle>
                    <InputWrap>
                        <LoginInput type='password' value={password} onChange={handlePassword} placeholder='Type your Password'/>
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
                </ContentWrap>

                <ButtonWrap>
                    <Button onClick={onClickConfirmButton} disabled={notAllow} width='120px' height='35px' radius='2rem' background='#D71541'>LOGIN</Button>
                </ButtonWrap>

                <CreateAccountWrap>
                    <span>Don't have Account?</span>
                    <CreateAccountLink to="/register"> Create an Account</CreateAccountLink>
                </CreateAccountWrap>

            </StyledLoginBox>
        </LoginContainer>
    </LoginPage>
  )
}

export default Login