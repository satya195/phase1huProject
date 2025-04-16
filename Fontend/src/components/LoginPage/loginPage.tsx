import React, { useState ,useEffect } from 'react';
import "./loginPage.scss";
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { Bounce, ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
interface LandingPageProps {
    setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  }
const LoginPagePhase1: React.FC<LandingPageProps> = ({ setIsLoggedIn }) => {
  const navigate = useNavigate(); 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [signUpActive, setSignUpActive] = useState(false);
  const [signUpname, setSignUpName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [signUPconfirmPassword, setSignUpConfirmPassword] = useState('');

  const successToast = (message: string) => toast.success(message, {
    position: "bottom-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "dark",
    transition: Bounce,
  });

  const errorToast = (message: string) => toast.error(message, {
    position: "bottom-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "dark",
    transition: Bounce,
  });

  const handleBacktoLoginApp = () => {
    setSignUpActive(false);
  }

  const validateSignUp = () => {
    if (!signUpname || !signUpEmail || !signUpPassword || !signUPconfirmPassword) {
      errorToast('All fields are required.');
      return false;
    }
    
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(signUpEmail)) {
      errorToast('Please enter a valid email.');
      return false;
    }
    
    if (signUpPassword.length < 6) {
      errorToast('Password should be at least 6 characters long.');
      return false;
    }
    
    if (signUpPassword !== signUPconfirmPassword) {
      errorToast('Passwords do not match.');
      return false;
    }
    
    return true;
  }

  const handleSignUp = () => {
    if (!validateSignUp()) return;

    axios.post(`/api/createUser`, { userId: uuidv4(), userName: signUpname, email: signUpEmail, Password: signUpPassword })
      .then((response) => {
        if (response.status === 200) {
          console.log("create user response ", response);
          setSignUpName('');
          setSignUpEmail('');
          setSignUpPassword('');
          setSignUpConfirmPassword('');
          successToast(response.data.message);
        }
      }).catch((error) => {
        errorToast(error.response.data.message);
        console.log(error);
      });
  }

  const handleSignUpNameChange = (signUpname: any) => {
    setSignUpName(signUpname);
  }

  const handleSignUpEmailChange = (signUpEmail: any) => {
    setSignUpEmail(signUpEmail);
  }

  const handleSignUpPasswordChange = (signUpPassword: any) => {
    setSignUpPassword(signUpPassword);
  }

  const handleSignUpConfirmPasswordChange = (signUPconfirmPassword: any) => {
    setSignUpConfirmPassword(signUPconfirmPassword);
  }

  const handleLoginApp = () => {
    if (!email || !password) {
      errorToast('Both email and password are required.');
      return;
    }
  
    axios.post(`/api/loginUser`, { email: email, Password: password })
      .then((response) => {
        if (response.status === 200) {
          console.log("Login user response ", response);
          sessionStorage.setItem('userEmail', response.data.email);
          sessionStorage.setItem('userId', response.data.userId);
          sessionStorage.setItem('userName', response.data.userName);
          setIsLoggedIn(true);
          navigate('/todo');
          successToast(response.data.message);
        }
      }).catch((error) => {
        errorToast(error.response.data.message);
        console.log(error);
      });
  }
  

  const handleSignUpApp = () => {
    setSignUpActive(true);
  }

  const handleEmailChange = (email: any) => {
    setEmail(email);
  }

  const handlePasswordChange = (Password: any) => {
    setPassword(Password);
  }

  useEffect(() => {
    const container = document.querySelector('.content') as HTMLElement;

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;

      const offsetX = (clientX - centerX) / centerX;
      const offsetY = (clientY - centerY) / centerY;

      const rotateX = offsetY * 25; // Rotate effect on Y-axis
      const rotateY = -offsetX * 25; // Rotate effect on X-axis

      container.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    };

    const handleMouseLeave = () => {
      container.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);
    return (
      <>
        <div className="landingPage-container">
          <div className="background-animation"></div>
          <div className='content-box'>
            <div className="content">
              <h1 className="main-heading">Welcome to <span className='project-name'>stinger</span></h1>
              {signUpActive ? ( <>  <p className="quote">Sign up soon, as a world of creativity awaits you</p>
              <p className="quote">Be the change!!</p></>) : ( <><p className="quote">Semantic Hyper-Accurate Imagery via Neural Architecture</p>
                <p className="quote"></p></>)}
            </div>
            {signUpActive ? (
              <div className='btn-box'>
                <input 
                  type="text" 
                  className="input-field-name" 
                  placeholder="Please enter your name" 
                  value={signUpname} 
                  onChange={(e) => handleSignUpNameChange(e.target.value)}
                />
                <input 
                  type="text" 
                  className="input-field-email" 
                  placeholder="Please enter your Email" 
                  value={signUpEmail} 
                  onChange={(e) => handleSignUpEmailChange(e.target.value)}
                />
                <input 
                  type="password" 
                  className="input-field-password" 
                  placeholder="Please enter your Password" 
                  value={signUpPassword} 
                  onChange={(e) => handleSignUpPasswordChange(e.target.value)}
                />
                <input 
                  type="password" 
                  className="input-field-confirmPassword" 
                  placeholder="Please confirm your Password" 
                  value={signUPconfirmPassword} 
                  onChange={(e) => handleSignUpConfirmPasswordChange(e.target.value)}
                />
                <div className='login-signup-box'>
                  <button className='signUp-btn' onClick={handleSignUp}>Sign Up</button>
                  <button className='login-btn' onClick={handleBacktoLoginApp}>Back to Sign In</button>      
                </div>
              </div>
            ) : (
              <div className='btn-box'>
                <input 
                  type="text" 
                  className="input-field-email" 
                  placeholder="Please enter your Email" 
                  value={email} 
                  onChange={(e) => handleEmailChange(e.target.value)}
                />
                <input 
                  type="password" 
                  className="input-field-password" 
                  placeholder="Please enter your Password" 
                  value={password} 
                  onChange={(e) => handlePasswordChange(e.target.value)}
                />
                <div className='login-signup-box'>
                  <button className='login-btn' onClick={handleLoginApp}>Sign In</button>
                  <button className='signUp-btn' onClick={handleSignUpApp}>Sign Up</button>
                </div>
              </div>
            )}
          </div>
          <ToastContainer
            position="bottom-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
          />
        </div>
      </>
    );
};

export default LoginPagePhase1;
