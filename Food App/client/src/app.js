import React, { useEffect, useState } from 'react';
import { Route, Routes } from "react-router-dom";
import { Dashboard, Login, Main, MyProfile, Services, Servies } from './containers';
import { getAuth } from 'firebase/auth';
import { getAllCartItems, validateUserJWTToken } from './api';
import { useDispatch, useSelector } from 'react-redux';
import { setUserDetails} from "./context/actions/userActions";
import { motion } from 'framer-motion';
import { Alert, CheckOutFailed, CheckOutSuccess, MainLoader, UserOrder } from './components';
import { setCartItems } from './context/actions/cartAction';
import ContactUs from './containers/ContactUs';


const App = () => { 
  const firebaseAuth = getAuth();
  const [isLoading, setIsLoading] = useState(false);
  const alert = useSelector(state => state.alert);
 
  const dispatch = useDispatch();

  useEffect(() => {
    setIsLoading(true);
    firebaseAuth.onAuthStateChanged(cred => {
      if (cred) {
        cred.getIdToken().then((token) => {
          validateUserJWTToken(token).then((data) => {
            if (data) {
              getAllCartItems(data.user_id).then((items) => {
                dispatch(setCartItems(items));
              })
            }
            dispatch(setUserDetails(data));
          });
        });
      }
      setInterval(() => {
        setIsLoading(false);
      },3000);
    });
  }, [firebaseAuth]);

  return (
    <div className='w-screen min-h-screen h-auto flex flex-col items-center justify-center'>
    {isLoading&& (
      <motion.div className='fixed inset-0 bg-darkOverlay backdrop-blur-md flex items-center justify-center w-full' style={{ zIndex: 1000 }}>
      <MainLoader />
      </motion.div>
    )} 
      <Routes>
        <Route path="/*" element={<Main />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard/*" element={<Dashboard />} />
        <Route path="/myprofile/*" element={<MyProfile />} />
        <Route path='/checkout-success' element={<CheckOutSuccess />} />
        <Route path='/checkout-failed' element={<CheckOutFailed />} />
        <Route path='/user-orders' element={<UserOrder />} />
        <Route path='/services' element={< Services/>} />
        <Route path='/contactus' element={< ContactUs/>} />
        contactus
      </Routes>

      {alert?.type && <Alert type={alert?.type} message={alert.message}/> }
    </div>
  );
}

export default App; 
 