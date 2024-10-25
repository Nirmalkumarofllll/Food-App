import React, { useEffect } from 'react'
import { DBLeftSection, DBRightSection } from '../components'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');  
    }
    
},[])
  return (
    <div className='w-screen h-screen flex items-center bg-primary'>
      <DBLeftSection />
      <DBRightSection />
      
    </div>
  )
}

export default Dashboard
