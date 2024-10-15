import React from 'react';
import { Footer, Header } from '../components';
import { motion } from 'framer-motion';
import { staggerFadeInOut, staggersFadeInOut } from '../animations'; // Make sure this exists and works with the index

const Services = () => {
  const services = [
    { id: 1, title: "Fast Delivery", description: "Get your food delivered to your doorstep in minutes. Our delivery network is optimized for speed to ensure your food stays fresh and warm. We are committed to providing you the fastest service possible." },
    { id: 2, title: "Fresh Ingredients", description: "Only fresh and locally sourced ingredients are used in all our meals. We partner with trusted suppliers to bring you the best quality food. Your health and taste are our top priorities." },
    { id: 3, title: "Custom Orders", description: "Whether you have special dietary needs or specific preferences, we customize your order exactly the way you like it. Our menu is flexible, allowing you to tailor your meals just as you prefer." },
    { id: 4, title: "Exciting Discounts", description: "Get amazing deals and discounts every day! Enjoy exclusive offers and save more with every order. Keep an eye out for our special promotions to make your experience even better." },
    { id: 5, title: "RazorPay Payment", description: "We offer secure and hassle-free payment options through RazorPay. Whether you prefer using credit cards, UPI, or wallets, we ensure all your payments are processed securely and seamlessly." },
    { id: 6, title: "Order Tracking", description: "Track your food in real-time from the moment it leaves our kitchen to your doorstep. Our tracking system allows you to stay updated on the status of your order." },
  ];

  return (
    <div className="bg-gray-100 flex flex-col justify-center pt-16 w-full md:w-full">
      <Header />
      <div className="text-center mb-12 mt-12 w-[80%] ml-[10%]">
        <h2 className="text-4xl font-bold text-red-500">Our Services</h2>
        <p className="mt-4 text-gray-600">We provide the best services to ensure a great experience.</p>
      </div>

      <div className="grid w-[80%] ml-[10%] grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service, i) => (
          <motion.div
            key={service.id}
            variants={staggersFadeInOut(i)}  
            initial="initial"
            animate="animate"
            exit="exit"
            className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-transform duration-300 hover:scale-105"
          >
            <h3 className="text-2xl font-semibold text-red-500 text-center">{service.title}</h3>
            <p className="mt-4 text-gray-600">{service.description}</p>
          </motion.div>
        ))}
      </div>
      <div className='w-[100%] left-0 mt-44 z-50'>

      <Footer />
      </div>
    </div>
  );
};

export default Services;
