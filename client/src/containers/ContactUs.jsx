import React, { useState } from 'react';
import emailjs from 'emailjs-com';
import { FaPhoneAlt, FaWhatsapp, FaLinkedin, FaGithub, FaTelegram } from 'react-icons/fa';
import { useDispatch } from 'react-redux'; 
import { Footer, Header } from '../components';
import { alertNULL, alertSuccess, alertWarning } from '../context/actions/alertActions';
import { IoMail } from 'react-icons/io5';
import { MdMail } from 'react-icons/md';

const ContactUs = () => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({ name: '', email: '', description: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.description) {
      dispatch(alertWarning('All Fields are mandatory'));
      setTimeout(() => {
        dispatch(alertNULL());
      }, 3000);
      return;
    }

    emailjs
      .send(
        'service_op3jspd', 
        'template_fk2x665', 
        formData, 
        'irIm0rPMGVVtUsMbn'
      )
      .then(() => {
        dispatch(alertSuccess('Email Sent'));
        setFormData({ name: '', email: '', description: '' });
        setTimeout(() => {
          dispatch(alertNULL());
        }, 3000);
      });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center pt-16 w-full bg-gray-100">
      <Header />
      <div className="flex flex-col md:flex-row bg-white rounded-2xl shadow-xl mt-28 w-full md:w-[50%] overflow-hidden">

        <div className="w-full md:w-[55%] py-10 px-6">
          <h2 className="text-4xl font-bold text-red-700 text-center mb-5">Get In Touch</h2>
          <form onSubmit={handleSubmit} className='pb-3 w-full'>
            <div className="mb-6 w-full">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-1 focus:ring-red-500 focus:outline-none"
                placeholder="Enter your name"
              />
            </div>

            <div className="mb-6 w-full">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-1 focus:ring-red-500 focus:outline-none"
                placeholder="Enter your email"
              />
            </div>

            <div className="mb-8 w-full">
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-1 focus:ring-red-500 focus:outline-none"
                placeholder="Your message"
                rows="5"
              ></textarea>
            </div>

            <div className="flex justify-center">
              <button
                type="submit"
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105"
              >
                Send Message
              </button>
            </div>
          </form>
        </div>

        <div
          className="w-full md:w-[45%] flex flex-col justify-start items-start p-10 text-white rounded-r-xl"
          style={{
            background: 'linear-gradient(to right, #FF4B2B, #FF416C)',
          }}
        >
          <h2 className="text-3xl text-primary font-bold mb-8">Contact Us!</h2>
          <div className="flex items-center mb-6">
            <FaPhoneAlt className="mr-4 text-xl" />
            <p className="text-lg">+91 8220694842</p>
          </div>

          <div className="flex items-center mb-6">
            <IoMail className="mr-4 text-xl text-primary" />
            <p className="text-md">nirmalkumarofllll@gmail.com</p>
          </div>
          <div className="flex space-x-6">
          <a href="https://wa.me/8220694842" target="_blank" rel="noopener noreferrer" className='text-primary hover:text-green-400 transition duration-300'>
             <FaWhatsapp className='text-2xl' />
          </a>

    <a href="https://www.linkedin.com/in/nirmalkumarp-ofllll/" target="_blank" rel="noopener noreferrer" className='text-primary hover:text-blue-400 transition duration-300'>
      <FaLinkedin className='text-2xl' />
    </a>
    <a href="https://github.com/Nirmalkumarofllll" target="_blank" rel="noopener noreferrer" className='text-primary hover:text-gray-300 transition duration-300'>
      <FaGithub className='text-2xl' />
    </a>
    <a href="https://t.me/Nirmal_offl" target="_blank" rel="noopener noreferrer" className='text-primary hover:text-blue-500 transition duration-300'>
      <FaTelegram className='text-2xl' />
    </a>
          </div>
        </div>
      </div>
      <div className='w-full mt-40 z-50'>
        <Footer />
      </div>
    </div>
  );
};

export default ContactUs;
