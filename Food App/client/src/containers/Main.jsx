import React, { useEffect } from 'react'
import { Cart, FilterSection, Footer, Header, Home, HomeSlider } from '../components';
import { useDispatch, useSelector } from 'react-redux';
import { getAllProducts } from '../api';
import { setAllProducts } from '../context/actions/productActions';
import { useNavigate } from 'react-router-dom';


const Main = () => {
  const products = useSelector((state) => state.products);
  const isCart = useSelector((state) => state.isCart)
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();
  

    if (!user) {
      navigate('/login'); 
    }
  
  useEffect(() => {
    if (!user) {
      navigate('/login'); 
    }

    if(!products){
      getAllProducts().then((data) => {
        dispatch(setAllProducts(data))
      })
    }
  },[])

  return (
    <main className='w-screen min-h-screen flex items-center justify-start flex-col bg-primary overflow-x-hidden'>
      <Header/>
      <div className='w-full flex flex-col items-start justify-center mt-40  px-6 md:px-24  gap-12 pb-24'>
      <Home />
      <HomeSlider />
      <FilterSection/>
      </div>
      <Footer />

      {isCart && <Cart/>}
    </main>
  )
}

export default Main
