import React, { useEffect, useState } from 'react'
import { ButtonWrap, ContentWrap, CreateAccountLink, CreateAccountWrap, ErrorMessageWrap, InputTitle, InputWrap, LoginContainer, LoginInput, LoginPage, LogoWrap, StyledLoginBox, SubLogoWrap, TitleWrap } from '../../styles/Auth/LoginStyle'
import { Button } from '../../components/Buttons'
import { useNavigate } from 'react-router'

const Login: React.FC = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('');

  const [userValid, setUserValid] = useState(false);
  const [pwValid, setPwValid] = useState(false);
  const [notAllow, setNotAllow] = useState(true); 
  
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

  const onClickConfirmButton = () => {
    const testUsername = "testuser@gmail.com";
    const testPassword = "Test@1234";
  
    // Validate the hardcoded credentials
    if (username === testUsername && password === testPassword) {
      const dummyToken = "dummy_access_token_123"; // Mock token
      localStorage.setItem('accessToken', dummyToken);
  
      console.log('Login successful!');
      alert("Login Successful!");
      navigate('/'); // Replace this with actual routing logic
    } else {
      console.error('Login error: Invalid credentials');
      alert("Invalid username or password. Please try again.");
    }
  
    console.log("Entered Credentials:", username, password);
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