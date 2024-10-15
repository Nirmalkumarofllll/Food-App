import React, { useEffect, useState } from 'react';
import { BsArrowRight, BsBell, BsGithub, BsLinkedin } from 'react-icons/bs';
import { useDispatch, useSelector } from 'react-redux';
import { Link, NavLink } from 'react-router-dom';
import emailjs from 'emailjs-com';
import "../assets/css/footer.css";
import { FaFacebook, FaGithub, FaLinkedin, FaTelegram, FaWhatsapp } from 'react-icons/fa';
import { MdMail } from 'react-icons/md';
import { IoIosSend } from "react-icons/io";
import { bgcolor } from '@mui/system';
import { motion } from 'framer-motion';
import { FoodLogo } from '../assets';
import { getAllOrder, getAllProducts, getAllUsers } from '../api';
import { setAllProducts } from '../context/actions/productActions';
import { setAllUserDetails } from '../context/actions/allUserAction';
import { setOrders } from '../context/actions/ordersAction';

const Footer = () => {
  const products = useSelector((state) => state.products);
  const allUsers = useSelector((state) => state.allUsers);
  const orders = useSelector((state) => state.orders); 
  const dispatch = useDispatch();
  const [subscribed, setSubscribed] = useState(false);
  const [formData, setFormData] = useState({ email: '' });

  useEffect(() => {
    if (!products) {
      getAllProducts().then((data) => {
        dispatch(setAllProducts(data));
      });
    }
    if (!allUsers || allUsers.length === 0) {
      getAllUsers().then((data) => {
        dispatch(setAllUserDetails(data));
      });
    }
    if (!orders) {
      getAllOrder().then((data) => {
        dispatch(setOrders(data));
      });
    }
  }, [products, allUsers, orders, dispatch]);

  const totalOrders = orders?.length || 0;
  const totalUsersCount = allUsers?.length || 0;


  const sendMail = (event) => {
    event.preventDefault();
  
    const email = event.target.email.value;
  
    const templateParams = {
      email: email,
      name: email, 
      description: `${email} has been subscribed to NightKite`, 
    };
  
    emailjs.send('service_op3jspd', 'template_fk2x665', templateParams, 'irIm0rPMGVVtUsMbn')
      .then((result) => {
        console.log(result.text);
        setSubscribed(true); // Show subscribed message
        setFormData({ email: '' }); // Reset form
  
        // Optionally hide the message after a delay
        setTimeout(() => {
          setSubscribed(false); // Hide message after 5 seconds
        }, 5000);
      }, (error) => {
        console.log(error.text);
      });
  };

  const user = useSelector((state) => state.user);

  return (
    <div className="bg-[#171717] text-white w-full pt-16 min-h-screen flex flex-col  z-50 gap-2 h-[100%] ">
      <div className='px-6 pb-10 md:px-24 pt-5 flex-grow'>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 justify-center">
        {/* Company Info */}
        <div className="flex flex-col">
          <h2 className="text-lg text-red-500 font-bold mb-4">About Us</h2>
          <p className="text-gray-400">
            NightKite Services Private Limited - We are here to serve you with the assured quality services which are essential to grow.
          </p>
          <p className="text-lg text-left text-gray-400 italic">
            "We'll love to serve you 
            {user?.name ? (
              <span className="text-lg text-red-500"> {user.name.toUpperCase()}</span>
            ) : (
            user?.email && (
              <span className="text-base text-red-500"> {user.email.split('@')[0].toUpperCase()}</span>
              )
            )}
            "
          </p>
        </div>

        {/* quick Links */}
        <div className="flex flex-col items-start sm:items-center">
          <h2 className="text-lg text-red-500 font-bold mb-4">Quick Links</h2>
          <ul className="space-y-2 text-gray-400 gap-28">
            <li>
              <a className="hover:text-red-500 text-xl text-text-color" href="#">
                Home
              </a>
            </li>
            <li>
              <Link className="hover:text-red-500 text-xl text-text-color" to="/dashboard/home">
                Dashboard
              </Link>
            </li>
            <li>
              <Link className="hover:text-red-500 text-xl text-text-color" to="/myprofile">
                My Profile
              </Link>
            </li>
            <li>
              <Link className="hover:text-red-500 text-xl text-text-color" to="/user-orders">
                Orders
              </Link>
            </li>
            <li>
            <NavLink  className="hover:text-red-500 text-xl text-text-color"  to="/"   onClick={() => document.getElementById('HomeSlider').scrollIntoView({ behavior: 'smooth' })} >  Menu </NavLink>        
            </li>
            <li>
              <Link className="hover:text-red-500 text-xl text-text-color" to="/services">
                Services
              </Link>
            </li>
            <li>
              <Link className="hover:text-red-500 text-xl text-text-color" to="/contactus">
                Contact Us
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact Us */}
        <div className="flex flex-col items-start sm:items-center">
        <h2 className="text-lg text-red-500 font-bold mb-4 items-start md:-ml-16">My Projects</h2>
        <div className='flex flex-col gap-4'>
        <ul className="space-y-2 text-gray-400 gap-28">
            <li>
              <a className="hover:text-red-500 text-xl text-text-color" target='blank' href="https://nirmalkumarofllll.github.io/Portfolio/index.html">
                Portfolio
              </a>
            </li>
            <li>
              <a className="hover:text-red-500 text-xl text-text-color" target='blank' href="https://nk-codepen-clone.web.app/home/projects">
                Codepen
              </a>
            </li>
            <li>
              <a className="hover:text-red-500 text-xl text-text-color" target='blank' href="https://nk-image-ai-analyzer.vercel.app/">
                Image AI Analayzer
              </a>
            </li>
            <li>
              <a className="hover:text-red-500 text-xl text-text-color" target='blank' href="https://nirmalkumarofllll.github.io/Portfolio/IDS.html">
                IDS
              </a>
            </li>
            <li>
              <a className="hover:text-red-500 text-xl text-text-color" target='blank' href="https://nirmalkumarofllll.github.io/Portfolio/Chatbot.html">
                Chatbot
              </a>
            </li>    
            <li>
              <a className="hover:text-red-500 text-xl text-text-color" target='blank' href="https://nirmalkumarofllll.github.io/Portfolio/CRS.html">
                CRS
              </a>
            </li>           
    </ul>
    {/* Email Icon 
    <div className="relative group">
      <a href='#'>
        <MdMail className='text-red-600 hover:text-red-500 text-2xl cursor-pointer' />
      </a>
      <div className="absolute bottom-[-30px] left-1/2 transform -translate-x-1/2 w-max text-white text-xs rounded-lg py-1 px-2 opacity-0 group-hover:opacity-100 transition-all duration-300 ease-out translate-y-[-10px] group-hover:translate-y-0">
        Email
      </div>
    </div>*/}

    {/* GitHub Icon 
    <div className="relative group">
      <a href='#'>
        <BsGithub className='text-[#fff] hover:text-red-500 text-2xl cursor-pointer' />
      </a>
      <div className="absolute bottom-[-30px] left-1/2 transform -translate-x-1/2 w-max text-white text-xs rounded-lg py-1 px-2 opacity-0 group-hover:opacity-100 transition-all duration-300 ease-out translate-y-[-10px] group-hover:translate-y-0">
        GitHub
      </div>
    </div>*/}

    {/* LinkedIn Icon 
    <div className="relative group">
      <a href='#'>
        <BsLinkedin className='text-[#0077B5] hover:text-red-500 text-2xl cursor-pointer' />
      </a>
      <div className="absolute bottom-[-30px] left-1/2 transform -translate-x-1/2 w-max text-white text-xs rounded-lg py-1 px-2 opacity-0 group-hover:opacity-100 transition-all duration-300 ease-out translate-y-[-10px] group-hover:translate-y-0">
        LinkedIn
      </div>
    </div>*/}

    {/* WhatsApp Icon 
    <div className="relative group">
      <a href='#'>
        <FaWhatsapp className='text-green-500 hover:text-red-500 text-2xl cursor-pointer' />
      </a>
      <div className="absolute bottom-[-30px] left-1/2 transform -translate-x-1/2 w-max text-white text-xs rounded-lg py-1 px-2 opacity-0 group-hover:opacity-100 transition-all duration-300 ease-out translate-y-[-10px] group-hover:translate-y-0">
        WhatsApp
      </div>
    </div>*/}

    {/* Telegram Icon 
    <div className="relative group">
      <a href='#'>
        <FaTelegram className='text-[#0088cc] hover:text-red-500 text-2xl cursor-pointer' />
      </a>
      <div className="absolute bottom-[-30px] left-1/2 transform -translate-x-1/2 w-max text-white text-sm rounded-lg py-1 px-2 opacity-0 group-hover:opacity-100 transition-all duration-300 ease-out translate-y-[-10px] group-hover:translate-y-0">
        Telegram
      </div>
    </div>*/}
  </div>
</div>



        {/* Newsletter */}
        <div className="flex flex-col">
  <h2 className="text-lg text-red-500 font-bold mb-4">Our Newsletter</h2>
  <p className="text-gray-400 mb-2">Subscribe to get the latest updates</p>

  <form className="footer-form flex flex-col justify-start items-start bg-transparent" onSubmit={sendMail}>
    <div className="flex flex-row justify-start items-start w-full">
      <input
        type="email"
        name="email" // important for EmailJS
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        className="newsletter-input bg-transparent min-w-[70%] max-w-[70%] text-primary"
        placeholder="Email"
        required
      />
      <motion.button
        type="submit"
        whileTap={{background: '#F56565' }}
        whileHover={{background: '#E57373'}}
        className="newsletter-send justify-center flex items-center -ml-5 min-w-[15%] bg-red-500 text-white p-2 rounded-r-md"
      >
        <IoIosSend />
      </motion.button>
    </div>

    {/* Subscribed message with animation */}
    <p
      id="#subscribed-message"
      className={`mt-3 text-red-500 flex flex-row transition-all duration-500 ${
        subscribed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
      }`}
    >
      Subscribed <BsBell className="ml-1 mt-1" />
    </p>
  </form>
</div>

      </div>
    <div className="grid grid-cols-4 py-10 md:gap-8 gap-2 justify-center items-center pt-14">
        {/* Company Info */}
        <div className="flex flex-col items-center justify-center">
        <img src={FoodLogo} className='md:h-56 md:w-56' />
      </div>

        {/* Total Orders */}
      <div className="flex flex-col items-center justify-center">
        <p className='md:text-3xl text-md'>{totalOrders} <sup>+</sup></p><br/>
        <p className='text-red-500 text-sm md:text-xl'>Orders</p>
      </div>

      {/* Total Products */}
      <div className="flex flex-col items-center justify-center">
        <p className='md:text-3xl text-md'>{products?.length || 0} <sup>+</sup></p><br/>
        <p className='text-red-500 text-sm md:text-xl'>Products</p>
      </div>

      {/* Total Users */}
     <div className="flex flex-col items-center justify-center">
        <p className='md:text-3xl text-md'>{totalUsersCount} <sup>+</sup></p><br/>
        <p className='text-red-500 text-sm md:text-xl'>Users</p>
      </div>
    </div>
    </div>
    <div className='bg-[#1d1d1d] w-full px-6 py-2 md:px-24 flex flex-col items-center'>
    <div className='flex gap-8 mb-2'>
      <a href="https://wa.me/8220694842" target="_blank" rel="noopener noreferrer" className='text-gray-400 hover:text-green-400 transition duration-300'>
        <FaWhatsapp className='text-2xl' />
      </a>
      <a href="https://mail.google.com/mail/?view=cm&fs=1&to=nirmalkumarofllll@gmail.com" target="_blank" rel="noopener noreferrer" className='text-gray-400 hover:text-red-400 transition duration-300'>
        <MdMail className='text-2xl' />
      </a>
      <a href="https://www.linkedin.com/in/nirmalkumarp-ofllll/" target="_blank" rel="noopener noreferrer" className='text-gray-400 hover:text-blue-400 transition duration-300'>
        <FaLinkedin className='text-2xl' />
      </a>
      <a href="https://github.com/Nirmalkumarofllll" target="_blank" rel="noopener noreferrer" className='text-gray-400 hover:text-gray-300 transition duration-300'>
        <FaGithub className='text-2xl' />
      </a>
      <a href="https://t.me/Nirmal_offl" target="_blank" rel="noopener noreferrer" className='text-gray-400 hover:text-blue-500 transition duration-300'>
        <FaTelegram className='text-2xl' />
      </a>
    </div>
    <p className='text-primary text-center font-semibold text-lg'>
      © <span className='text-red-500 font-semibold text-lg'>NIGHTKITE</span> 
    </p>
  </div>
    </div>
  );
};

export default Footer;
