import React, { useEffect, useState } from 'react';
import {Swiper, SwiperSlide} from "swiper/react";
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import "../assets/css/swiperStyles.css";
import "swiper/css/bundle";
import { useSelector } from 'react-redux';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import SliderCard from './SliderCard';
const Slider = () => {
    const products = useSelector((state) => state.products);
    const [fruits, setFruits] = useState(null);
    useEffect(() => {
        setFruits(products?.filter((data) => data.product_category === "Fruits"));
    }, [products]);
  return (
    <div className='w-full pt-10'>
      <Swiper
      slidesPerView={3}
        spaceBetween={30}
        centeredSlides={false}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        
        navigation={false}
        loop={true}
        breakpoints={{
            640: { // for small tablets
                slidesPerView: 1,
                spaceBetween: 20,
            },
            768: { // for tablets
                slidesPerView: 3,
                spaceBetween: 30,
            },
            1024: { // for desktop
                slidesPerView: 3,
                spaceBetween: 30,
            },
        }}
        modules={[Autoplay, Pagination, Navigation]}
        className="mySwiper"
      >
        {fruits && fruits.map((data,i) => 
        <SwiperSlide key={i}>
            <SliderCard key={i} data={data} index={i}/>
        </SwiperSlide>
        )}
      </Swiper>
    </div>
  )
}

export default Slider
