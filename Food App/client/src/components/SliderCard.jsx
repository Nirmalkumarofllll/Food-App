import { motion } from 'framer-motion';
import React from 'react';
import { IoMdBasket } from 'react-icons/io';
import { addNewItemToCart, getAllCartItems } from '../api';
import { useDispatch, useSelector } from 'react-redux';
import { alertNULL, alertSuccess } from '../context/actions/alertActions';
import { setCartItems } from '../context/actions/cartAction';
import { BiCart } from 'react-icons/bi';

const SliderCard = ({ data, index }) => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const sendToCart = () => {
    dispatch(alertSuccess("Added to the cart"));
    addNewItemToCart(user?.user_id, data).then((res) => {
      getAllCartItems(user?.user_id).then((items) => {
        dispatch(setCartItems(items));
      });
      setInterval(() => {
        dispatch(alertNULL());
      }, 3000);
    });
  };
  return (
    <div className='bg-lightOverlay hover:drop-shadow-lg backdrop-blur-md rounded-xl flex items-center justify-between relative px-4 py-2 w-full md:w-340 md:min-w-350 gap-3'>
      <img src={data.imageURL} className='w-40 h-40 object-contain' alt={data.product_name} />
      <div className='relative pt-12'>
        <p className='text-xl text-headingColor font-semibold'>
          {data.product_name}
        </p>
        <p className='text-lg font-semibold text-red-500'>
          ₹ {parseFloat(data.product_price).toFixed(2)}
        </p>
        
        <motion.div 
          whileTap={{ scale: 0.99 }} 
          onClick={sendToCart}
          className='w-32 pl-2 h-8 bg-red-500 flex flex-row text-primary pr-2 shadow-2xl items-center justify-center absolute -top-4 -right-4 gap-2 cursor-pointer rounded-l-full'
          >
          <BiCart className='text-2xl text-primary flex flex-row' /> Add to cart
        </motion.div>
      </div>
    </div>
  );
}

export default SliderCard;
