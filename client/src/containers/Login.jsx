import React, { useEffect, useState } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { getAuth, signInWithPopup, GoogleAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { app } from '../config/firebase.config';
import { validateUserJWTToken } from '../api';
import { FoodLogo, Logo } from "../assets";
import '../assets/css/logins.css'; 
import { useNavigate } from "react-router-dom";
import { setUserDetails } from '../context/actions/userActions';
import { useDispatch, useSelector } from 'react-redux';
import { alertInfo, alertNULL, alertWarning } from '../context/actions/alertActions';
import { motion } from 'framer-motion';
import { FaArrowLeft } from "react-icons/fa";



const Login = () => {
  const [rightPanelActive, setRightPanelActive] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isMobile, setIsMobile] = useState(false);

  const firebaseAuth = getAuth(app);
  const provider = new GoogleAuthProvider();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector(state => state.user);
  const alert = useSelector(state => state.alert);
  
  const [showSignInForm, setShowSignInForm] = useState(false);
  const [showSignUpForm, setShowSignUpForm] = useState(false);

  const mobileSignIn = () => {
    setShowSignUpForm(false); // Ensure the Sign Up form is hidden
    setShowSignInForm(true);  // Show the Sign In form
  };

  const mobileSignUp = () => {
    setShowSignInForm(false); // Ensure the Sign In form is hidden
    setShowSignUpForm(true);  // Show the Sign Up form
  };

  useEffect(() => {
    if (user) {
      navigate("/", { replace: true });
    }

    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    handleResize(); 

    return () => window.removeEventListener('resize', handleResize);
  }, [user]);

  const loginWithGoogle = async () => {
    await signInWithPopup(firebaseAuth, provider).then(userCred => {
      firebaseAuth.onAuthStateChanged(cred => {
        if (cred) {
          cred.getIdToken().then(token => {
            validateUserJWTToken(token).then(data => {
              dispatch(setUserDetails(data));
            });
            navigate("/", { replace: true });
          });
        }
      });
    });
  };

  const signUpWithEmailPass = async () => {
    if (userEmail === '' || password === '' || confirmPassword === '') {
      dispatch(alertInfo('Required fields should not be empty'));
      setTimeout(() => {
        dispatch(alertNULL());
      }, 3000);
    } else {
      if (password === confirmPassword) {
        await createUserWithEmailAndPassword(firebaseAuth, userEmail, password)
          .then(userCred => {
            firebaseAuth.onAuthStateChanged(cred => {
              if (cred) {
                cred.getIdToken().then(token => {
                  validateUserJWTToken(token).then(data => {
                    dispatch(setUserDetails(data));
                  });
                  navigate("/", { replace: true });
                });
              }
            });
          })
          .catch(error => {
            handleError(error);
          });
      } else {
        dispatch(alertWarning("Passwords don't match"));
        setTimeout(() => {
          dispatch(alertNULL());
        }, 3000);
      }
    }
  };

  const signInWithEmailpass = async () => {
    if (userEmail !== "" && password !== "") {
      await signInWithEmailAndPassword(firebaseAuth, userEmail, password)
        .then(userCred => {
          firebaseAuth.onAuthStateChanged(cred => {
            if (cred) {
              cred.getIdToken().then(token => {
                validateUserJWTToken(token).then(data => {
                  dispatch(setUserDetails(data));
                });
                navigate("/", { replace: true });
              });
            }
          });
        })
        .catch(error => {
          handleError(error);
        });
    } else {
      dispatch(alertWarning("Please enter both email and password"));
      setTimeout(() => {
        dispatch(alertNULL());
      }, 3000);
    }
  };

  const handleSignUpClick = () => {
    setRightPanelActive(true);
  };

  const handleSignInClick = () => {
    setRightPanelActive(false);
  };

  const handleError = (error) => {
    if (error.code === "auth/invalid-email") {
      dispatch(alertWarning("Enter a valid email"));
    } else if (error.code === "auth/email-already-in-use") {
      dispatch(alertWarning("Email already in use, please sign in"));
    } else if (error.code === "auth/weak-password") {
      dispatch(alertWarning("Password should be more than 6 characters"));
    } else {
      dispatch(alertWarning("An error occurred. Please try again."));
    }
    setTimeout(() => {
      dispatch(alertNULL());
    }, 3000);
  };

  // Mobile design for smaller screens
  const mobileDesign = (
    <div className="mobile-container">
      <h1 className="mobile-header">Welcome to Food Party!</h1>
      <div className="mobile-social-container">
        <button type='button' onClick={loginWithGoogle} className="social-google">
          <FcGoogle /> Sign In With Google
        </button>
      </div>
      <span>or use your email to continue</span>
      <input
        className="mobile-input"
        value={userEmail}
        onChange={(e) => setUserEmail(e.target.value)}
        type="email"
        placeholder="Email"
      />
      <input
        className="mobile-input"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        type="password"
        placeholder="Password"
      />
      <button onClick={signInWithEmailpass} className="mobile-button">Sign In</button>
    </div>
  );

  return (
    <>
{isMobile ? (
  <div className="fixed top-0 w-screen bg-zinc-900 backdrop-blur-md shadow-md h-screen gap-0 flex flex-col items-center justify-start">
        <img src={FoodLogo} alt="Logo" className='h-[200px] w-[200px] animate-pulse -m-2' />
        <p className='text-primary text-xl'>Unleash Your Inner <span className='text-red-500 text-xl'>Foodie</span></p>

    <div className="bg-zinc-800 rounded-t-[60px] w-full h-[95%] flex flex-col mt-[5%] pt-10">
      <div className="h-[60%] items-center w-full justify-center gap-10 flex flex-col">
        
        {/* Conditional Rendering of Forms */}
        {!showSignInForm && !showSignUpForm && (
          <>
          <div className='mt-[40%]'></div>
            <button
              onClick={mobileSignUp}
              className="pt-5 pb-5 border-2 pl-20 pr-20 bg-lightOverlay rounded-full border-darkOverlay text-primary"
              type="button"
            >
              Sign Up
            </button>
            <p className="text-primary">OR</p>
            <button
              onClick={mobileSignIn}
              className="pt-5 pb-5 border-2 pl-20 pr-20 bg-lightOverlay rounded-full border-darkOverlay text-primary"
              type="button"
            >
              Sign In
            </button>

          </>
        )}

        {/* Sign In Form */}
        {showSignInForm && (
          <form action="#" className='bg-transparent justify-start gap-5 w-full'>
            <h1 className='login-h1 text-primary'>Access account</h1>
            <div className="social-container">
              <button type='button' onClick={loginWithGoogle} className="social-google p-5 text-primary bg-lightOverlay rounded-full"><FcGoogle /> Sign In With Google</button>
            </div>
            <span className='text-primary'>or use your account</span>
            <input
              className="login-input bg-lightOverlay rounded-2xl border-2 text-primary border-darkOverlay hover:border-[rgb(255, 130, 130)]"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              type="email"
              placeholder="Email"
              required
            />
            <input
              className="login-input bg-lightOverlay rounded-2xl border-2 text-primary border-darkOverlay hover:border-[rgb(255, 130, 130)]"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="Password"
              required
            />
            <button onClick={signInWithEmailpass}   className="sign flex items-center justify-center p-3" type="button">Sign In</button>
            
            {/* Back Button */}
            <button
              className="pt-3 pb-3 mt-5 pl-10 pr-10 text-primary flex gap-3 justify-center items-center"
              onClick={() => { setShowSignInForm(false); setShowSignUpForm(false); }}
              type="button"
            >
             <FaArrowLeft />
             Back
            </button>
          </form>
        )}

        {/* Sign Up Form */}
        {showSignUpForm && (
          <form action="#" className='bg-transparent justify-start gap-5 w-full'>
            <h1 className='login-h1 text-primary'>Create Account</h1>
            <div className="social-container m-2">
            <button type='button' onClick={loginWithGoogle} className="social-google p-3 text-primary bg-lightOverlay rounded-full m-0"><FcGoogle /> Sign Up With Google</button>
            </div>
            <span className='text-primary'>or use your email for registration</span>
            <input
              className="login-input bg-lightOverlay rounded-2xl border-2 border-darkOverlay text-primary hover:border-[rgb(255, 130, 130)]"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              type="email"
              placeholder="Email"
              required
            />
            <input
              className="login-input bg-lightOverlay rounded-2xl border-2 border-darkOverlay text-primary hover:border-[rgb(255, 130, 130)]"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="Password"
              required
            />
            <input
              className="login-input bg-lightOverlay rounded-2xl border-2 border-darkOverlay text-primary hover:border-[rgb(255, 130, 130)]"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              type="password"
              placeholder="Confirm Password"
              required
            />
            <button onClick={signInWithEmailpass}   className="sign flex items-center justify-center p-3" type="button">Sign In</button>            
            {/* Back Button */}
            <button
              className="pt-3 pb-3 mt-5 pl-10 pr-10 text-primary flex gap-3 justify-center items-center"
              onClick={() => { setShowSignInForm(false); setShowSignUpForm(false); }}
              type="button"
            >
             <FaArrowLeft />
             Back
            </button>
          </form>
        )}
      </div>
    </div>
  </div>
): (
        <div className={`container ${rightPanelActive ? 'right-panel-active' : ''}`} id="login-container">
          <div className="form-container sign-up-container">
            <form action="#">
              <h1 className='login-h1'>Create Account</h1>
              <div className="social-container">
                <button type='button' onClick={loginWithGoogle} className="social-google rounded-full"><FcGoogle /> Sign Up With Google</button>
              </div>
              <span>or use your email for registration</span>
              <input
                className="login-input border-none"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                type="email"
                placeholder="Email"
                required
              />
              <input
                className="login-input border-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                placeholder="Password"
                required
              />
              <input
                className="login-input border-none"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                type="password"
                placeholder="Confirm Password"
                required
              />
              <button onClick={signUpWithEmailPass} className="sign rounded-full" type="button">Sign Up</button>
            </form>
          </div>

          <div className="form-container sign-in-container">
            <form action="#">
              <h1 className='login-h1'>Access account</h1>
              <div className="social-container">
                <button type='button' onClick={loginWithGoogle} className="social-google rounded-full"><FcGoogle /> Sign In With Google</button>
              </div>
              <span>or use your account</span>
              <input
                className="login-input border-none"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                type="email"
                placeholder="Email"
                required
              />
              <input
                className="login-input border-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                placeholder="Password"
                required
              />
              <a href="#">Forgot your password?</a>
              <button onClick={signInWithEmailpass} className="sign rounded-full" type="button">Sign In</button>
            </form>
          </div>

          <div className="overlay-container">
            <div className="overlay">
              <div className="overlay-panel overlay-left">
                <img className="Overlay-panel-Logo" src={FoodLogo} alt="Logo" />
                <h1 className="overlay-panel-header">Welcome Back!</h1>
                <p className='login-p'>Unleash your inner foodie. Sign in to explore.</p>
                <button className="change-side" onClick={handleSignInClick}>Sign In</button>
              </div>
              <div className="overlay-panel overlay-right">
                <img className="Overlay-panel-Logo" src={FoodLogo} alt="Logo" />
                <h1 className="overlay-panel-header">Welcomes You!</h1>
                <p className='login-p'>Your taste buds will thank you. Join the food party now.</p>
                <button className="change-side" onClick={handleSignUpClick}>Sign Up</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Login;
