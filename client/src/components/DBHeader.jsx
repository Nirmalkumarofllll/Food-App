import React, { useState } from 'react';
import { MdLogout, MdSearch } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { RxCross1 } from "react-icons/rx";
import { BsFillBellFill } from "react-icons/bs";
import {motion} from "framer-motion"
import { Avatar, Avatarsqaure } from '../assets';
import { NavLink, useNavigate } from 'react-router-dom';
import { app } from '../config/firebase.config';
import { getAuth } from 'firebase/auth';
import { setUserNull } from '../context/actions/userActions';


const DBHeader = () => {
    const user = useSelector((state) => state.user);
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
    const [searchText, setSearchText] = useState("");

    const handleInputChange = (e) => {
        setSearchText(e.target.value);
    };

    const clearInput = () => {
        setSearchText("");
    };

    return (
        <div className='w-full flex text-center justify-between gap-3'>
            <p className='text-2xl text-left text-headingColor'> 
                Welcome
                {user?.name ? (
        <span className='block text-left text-base justify-start text-red-500'>{user.name}</span>
    ) : (
        user?.email && (
            <span className='block text-left text-base justify-start text-red-500'>
                {user.email.split('@')[0]}
            </span>
        )
    )}
            </p>
            <div className='flex items-center  justify-center gap-4'>
                <div className='flex items-center w-225 max-w-225 justify-center gap-3 px-4 py-2 bg-gray-100 backdrop-blur-md shadow-md rounded-md'>
                    <MdSearch className='text-gray-400 text-2xl' />
                    <input 
                        type='text' 
                        placeholder='Search Here' 
                        className='border-none outline-none bg-transparent w-32 text-base font-semibold text-gray-400'
                        value={searchText}
                        onChange={handleInputChange}
                    />
                    <div 
                        className={`flex items-center justify-center transition-opacity duration-300 ${searchText ? 'opacity-100' : 'opacity-0'}`} 
                        style={{ width: '20px' }}
                    >
                        {searchText && (
                            <RxCross1 
                                className='text-gray-400 text-base cursor-pointer' 
                                onClick={clearInput}
                            />
                        )}
                    </div>
                </div>
                {/*<motion.div className='w-10 h-10 rounded-md cursor-pointer flex items-center justify-center'>
                        <BsFillBellFill className='text-gray-400 text-xl'/>
                    </motion.div> */}
                    <div className='flex items-center justify-center gap-2'>
                        <div className='w-10 h-10 rounded-md shadow-md cursor-pointer overflow-hidden'>
                            <NavLink to={"/myprofile"}>
                            <motion.img className='w-full h-full obejct-cover' src={user?.picture ? user.picture : Avatarsqaure} whileHover={{scale : 1.15}} referrerPolicy='no-referrer' />
                            </NavLink>
                        </div>
                        <motion.div onClick={signOut} className='w-10 h-10 rounded-md cursor-pointer bg-gray-100 backdrop-blur-md shadow-md flex items-center justify-center'>
                            <MdLogout className='text-gray-400 text-xl' />
                        </motion.div>

                    </div>
            </div>
        </div>
    );
};

export default DBHeader;
