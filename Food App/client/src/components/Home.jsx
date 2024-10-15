import { motion } from 'framer-motion'
import React from 'react'
import { Delivery, HeroBg } from '../assets'
import { randomData } from '../utils/styles'
import { staggerFadeInOut } from '../animations'
import { useDispatch } from 'react-redux'
import { setCartOn } from '../context/actions/displaycartAction'

const Home = () => {
  const dispatch = useDispatch();

  return (
    <div className='h-[80vh] overflow-x-hidden'>
        <motion.div className='w-full grid grid-cols-1 md:grid-cols-2 gap-4 p-0'> 
            <div className='flex flex-col items-start justify-start gap-6'>
                <div className='px-4 py-1 flex items-center justify-center gap-2 bg-orange-100 rounded-full'>
                    <p className='text-lg font-semibold text-orange-500'>Free Delivery</p>
                    <img src={Delivery} className='w-12 h-12 object-contain' />
                </div>
                <p className='text-[40px] text-headingColor md:text-[72px]  font-sans font-extrabold tracking-wider'>The Fastest Delivery in <span className='text-[40px] text-orange-600 md:text-[72px] font-sans font-extrabold tracking-wider'>Pudukkottai</span>
                </p>
                <p className='text-textColor text-lg'>
                Indulge in a symphony of taste and speed. Our gourmet cuisine, crafted with precision and passion, is delivered with lightning-fast efficiency. Every bite is a culinary masterpiece, designed to tantalize your taste buds and leave you craving more. Experience the future of fine dining, delivered right to your door.                </p>
                <motion.button onClick={() => dispatch(setCartOn())}  whileTap={{scale : 0.99}} className='bg-gradient-to-bl from-orange-400 to-orange-600 px-4 py-2 rounded-xl text-black text-base font font-semibold'>Order Now</motion.button>
            </div>
            <div className='py-2 flex-1 items-center justify-end relative hidden md:flex'>
  <img className='absolute top-0 right-0 w-full h-600 md:w-auto md:h-650' src={HeroBg} />
  <div className='w-full md:w-460 ml-0 grid grid-cols-2 mt-12 items-center justify-center gap-4 gap-y-14'>
    {randomData &&
      randomData.map((data, i) => (
        <motion.div
          key={i}
          {...staggerFadeInOut(i)}
          className='w-32 h-36 md:w-[212px] p-4 bg-lightOverlay backdrop-blur-md rounded-3xl flex flex-col items-center justify-center drop-shadow-lg'
        >
          <img
            src={data.imageURL}
            className='w-12 h-12 md:h-[110px] md:w-[100px] md:-mt-16 object-contain'
            alt=''
          />
          <p className='text-sm lg:text-xl items-center font-semibold text-textColor'>
            {data.product_name.slice(0, 20)}
          </p>
          <p className='text-[12px] text-center md:text-base text-darkOverlay font-semibold capitalize'>
            {data.product_category}
          </p>
          <p className='text-sm font-semibold text-headingColor'>
            <span className='text-xs text-red-500'>₹</span>
            {data.product_price}
          </p>
        </motion.div>
      ))}
  </div>
</div>

        </motion.div>  
        <div id='HomeSlider'></div> 
    </div>
  )
}

export default Home
