import React from 'react'
import { Link, NavLink, replace, useNavigate } from 'react-router-dom';
import { Avatar, FoodLogo } from '../assets';
import { isActiveStyles, isNotActiveStyles } from '../utils/styles';
import {motion} from "framer-motion";
import { MdLogout, MdShoppingCart } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import { getAuth } from 'firebase/auth';
import { app } from '../config/firebase.config';
import { setUserNull } from '../context/actions/userActions';
import {setCartOn} from "../context/actions/displaycartAction"

const Header = () => {
  const user = useSelector(state => state.user);
  const cart = useSelector((state) => state.cart);
  const [isMenu, setIsMenu] = useState(false);
  const firebaseAuth = getAuth(app);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const signOut = () => {
    firebaseAuth.signOut().then(() =>{
      dispatch(setUserNull());
      navigate("/login", {replace: true}); 
    })
    .catch((err) => console.log(err));
  }
  return (
   <header className='fixed backdrop-blur-md z-50 inset-x-0 top-0 flex items-center justify-between px-12 pt-0 pb-0 md:px-20 py-6 h-28'>
     <NavLink to={"/"} className="flex items-center justify-center gap-4">
            <img src={FoodLogo} className='w-28' alt='' />
            <p className="font-semibold text-xl"></p>
     </NavLink>
     <nav className='flex items-center justify-center gap-8'>
      <ul className='hidden md:flex items-center justify-center gap-16'>
        <NavLink className={({isActive}) => isActive ? isActiveStyles : isNotActiveStyles} to={"/"}>Home</NavLink>
        <NavLink className={({isActive}) => isActive ? isActiveStyles : isNotActiveStyles} to={"/services"}>Services</NavLink>
        <NavLink className={({isActive}) => isActive ? isActiveStyles : isNotActiveStyles} to={"/contactus"}>Contact Us</NavLink>
      </ul>

      <motion.div whileTap={{ scale: 0.9, opacity: 0.8 }} onClick={() => dispatch(setCartOn())} className='relative cursor-pointer' >
        <MdShoppingCart className='text-3xl text-textColor'/>                
        {cart?.length > 0 && (
          <div className='w-6 h-6 rounded-full bg-red-500 flex items-center justify-center absolute -top-4 -right-1'>
          <p className='text-primary text-base font-semibold'>{cart?.length}</p>
        </div>
        )}
      </motion.div>

      {user ? <>
      <div className='relative cursor-pointer' onMouseEnter={() => setIsMenu(true)} onMouseLeave={() => setIsMenu(false)}>
        <div className='w-12 h-12 rounded-full shadow-md cursor-pointer overflow-hidden flex items-center justify-center'>
          <motion.img className='w-full h-full object-cover' src={user?.picture ? user?.picture : Avatar} whileHover={{scale : 1.15}} referrerPolicy='no-referrer'/>
        </div>
        {isMenu && (
          
        <motion.div   initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5, ease: 'easeOut' }} className='px-6 py-4 w-48 bg-overlay backdrop-blur-md rounded-md shadow-md absolute top-12 right-0 flex flex-col gap-4'>
          {user && process.env.REACT_APP_ADMIN_IDS.split(",").includes(user.user_id) && (
  <Link
    className="hover:text-red-500 text-xl text-primary"
    to={"/dashboard/home"}
  >
    Dashboard
  </Link>
)}

        <Link className='hover:text-red-500 text-xl text-primary' to={"/myprofile"}>
          My Profile
        </Link>
        <Link className='hover:text-red-500 text-xl text-primary' to={"/user-orders"}>
        Orders
        </Link>
        <Link className='hover:text-red-500 text-xl text-primary block md:hidden' to={"/services"}>
    Service
</Link>
<Link className='hover:text-red-500 text-xl text-primary block md:hidden' to={"/contactus"}>
    Contact Us
</Link>
        <hr />
        <motion.div whileTap={{scale : 0.99}} onClick={signOut} className='h-12 group flex items-center justify-center px-3 py-2 rounded-md shadow-md bg-gray-100 hover:bg-gray-200 gap-3'>
          <MdLogout className='text-2xl text-textColor group-hover::text-headingColor' />
          <p className='text-textColor text-xl group-hover:text-headingColor'>Sign Out</p>
        </motion.div>

      </motion.div>
        )}
      </div>
      </> : <>
        <NavLink to={"/Login"}>
         <motion.button className='px-4 py-2 rounded-md shadow-md bg-lightOverlay border border-red-300 cursor-pointer'>
          Login
         </motion.button>
        </NavLink>
      </>}
     </nav>
   </header>
  )
}

export default Header;
