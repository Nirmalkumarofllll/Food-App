import React from 'react';
import "../assets/css/Loader.css";

const MainLoader = () => {
  return (
    <div className='flex items-center justify-center container'>
        <div class="pan-loader">
  <div class="loader"></div>
  <div class="pan-container">
    <div class="pan"></div>
    <div class="handle"></div>
  </div>
</div>           
    </div>
  )
}

export default MainLoader
