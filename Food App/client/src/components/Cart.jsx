import React, { useEffect, useState } from 'react'
import { buttonClcik, slideIn, staggerFadeInOut } from "../animations";
import { motion } from 'framer-motion';
import { BiChevronsRight } from "react-icons/bi";
import { setCartOff } from '../context/actions/displaycartAction';
import { useDispatch, useSelector } from 'react-redux';
import { FcClearFilters } from "react-icons/fc";
import { TbShoppingCartCancel } from "react-icons/tb";
import { HiCurrencyRupee } from "react-icons/hi";
import { URL, baseURL, getAllCartItems, increaseItemQuantity } from "../api";

import { alertNULL, alertSuccess } from "../context/actions/alertActions";
import { setCartItems } from "../context/actions/cartAction";
import axios from 'axios';


const Cart = () => {
  const user = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const cart = useSelector((state) => state.cart);
    const [total, setTotal] =useState(0);
    useEffect(() => {
      let tot = 0;
      if (cart) {
        cart.map((data) => {
          tot = tot + data.product_price * data.quantity;
          setTotal(tot);
        });
      }
    }, [cart]);

    const handleCheckOut = () => {
      const data = {
        user: user,
        cart: cart,
        total: total,
      };
    
      axios
        .post(`${baseURL}/api/products/create-checkout-session`, { data })
        .then((res) => {
          if (res.data.orderId) {
            const options = {
              key: process.env.RAZORPAY_KEY_ID, // Your Razorpay Key ID
              amount: res.data.amount, // Amount to be paid
              currency: "INR",
              name: "NightKite",
              description: "hi there",
              order_id: res.data.orderId, // This is the order ID generated by Razorpay
              handler: function (response) {
                // Handle success
                console.log(response);
                // Optionally redirect to success URL
                window.location.href = `${URL}/checkout-success`;
              },
              prefill: {
                name: user.name,
                email: user.email,
              },
              notes: {
                address: "Your address",
              },
              theme: {
                color: "#F37254",
              },
            };
    
            const razorpay = new window.Razorpay(options);
            razorpay.open();
          }
        })
        .catch((err) => console.log(err));
    };
    

  return (<motion.div
    {...slideIn}
    className="fixed z-50 top-0 right-0 w-full md:w-508  bg-lightOverlay backdrop-blur-md shadow-md h-screen"
  >
    <div className="w-full flex items-center justify-between py-4 pb-6 px-6">
      <motion.i
        {...buttonClcik}
        className="cursor-pointer"
        onClick={() => dispatch(setCartOff())}
      >
        <BiChevronsRight className="text-[50px] text-darkOverlay" />
      </motion.i>
      <p className="text-2xl text-headingColor font-semibold">Your Cart</p>
      <motion.i {...buttonClcik} className="cursor-pointer">
        <FcClearFilters className="text-[30px] text-textColor" />
      </motion.i>
    </div>
  
    <div className="flex-1 flex flex-col items-start justify-start rounded-t-3xl bg-zinc-900 h-full py-0 mt-0 gap-3 relative">
      {cart && cart.length > 0 ? (
        <>
          <div className="flex flex-col w-full items-start justify-start gap-3 h-[65%] mt-0 pt-0 overflow-y-scroll scrollbar-none px-4">
            {cart.map((item, i) => (
              <CartItemCard key={i} index={i} data={item} />
            ))}
          </div>
          <div className="bg-zinc-800 rounded-t-[60px] w-full h-[35%] flex flex-col items-center pt-10  mt-0 gap-10">
              <div className="w-full flex items-center justify-evenly">
                <p className="text-3xl text-zinc-500 font-semibold">Total</p>
                <p className="text-3xl text-orange-500 font-semibold flex items-center justify-center gap-1">
                  <HiCurrencyRupee className="text-primary" />      
                  {total}
                </p>
              </div>

              <motion.button
                {...buttonClcik}
                className="bg-orange-400 w-[70%] px-4 py-3 text-xl text-headingColor font-semibold hover:bg-orange-500 drop-shadow-md rounded-2xl"
                onClick={handleCheckOut}
              >
                Check Out
              </motion.button>
            </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center h-full w-full  rounded-lg shadow-lg p-6">
            <TbShoppingCartCancel className="text-6xl text-red-400 mb-4 transition-transform transform hover:scale-110" />
             <h1 className="text-4xl text-primary font-bold mb-2">Your Cart is Empty</h1>
             <p className="text-gray-600 text-lg mb-4">Looks like you haven't added anything yet!</p>
        </div>

      )}
    </div>
    
  </motion.div>
  
  )
}


export const CartItemCard = ({ index, data }) => {
  const cart = useSelector((state) => state.cart);
  const user = useSelector((state) => state.user);
  const [itemTotal, setItemTotal] = useState(0);
  const dispatch = useDispatch();

  const decrementCart = (productId) => {
    dispatch(alertSuccess(`${data.product_name} Removed`));
    increaseItemQuantity(user?.user_id, productId, "decrement").then((data) => {
      getAllCartItems(user?.user_id).then((items) => {
        dispatch(setCartItems(items));
        dispatch(alertNULL());
      });
    });
  }
  const incrementCart = (productId) => {
    dispatch(alertSuccess(`${data.product_name} Added`));
    increaseItemQuantity(user?.user_id, productId, "increment").then((data) => {
      getAllCartItems(user?.user_id).then((items) => {
        dispatch(setCartItems(items));
        dispatch(alertNULL());
      });
    });
  }

  useEffect(() => {
    setItemTotal(data.product_price * data.quantity);
  },[itemTotal, cart])
    return (
        <motion.div key={index} {...staggerFadeInOut(index)}  className="w-full flex items-center mt-5 justify-start bg-zinc-800 rounded-md drop-shadow-md px-4 gap-4">
      <img
        src={data?.imageURL}
        className=" w-20 h-20 md:w-24 md:min-w-[94px] md:h-24 object-contain"
        alt=""
      />
      <div className="flex items-center justify-start gap-1 w-full">
        <p className="text-lg text-primary font-semibold">
          {data?.product_name}
          <span className="text-sm block capitalize text-gray-400">
            {data?.product_category}
          </span>
        </p>
        <p className="text-sm flex items-center justify-center gap-1 font-semibold text-red-400 ml-auto">
          <HiCurrencyRupee className="text-red-400" /> {itemTotal}
        </p>
      </div>
      <div className="ml-auto flex items-center justify-center gap-3">
        <motion.div
          {...buttonClcik}
          onClick={() => decrementCart(data?.productId)}
          className="w-8 h-8 flex items-center justify-center rounded-md drop-shadow-md bg-zinc-900 cursor-pointer"
        >
          <p className="text-xl font-semibold text-primary">--</p>
        </motion.div>
        <p className="text-lg text-primary font-semibold">{data?.quantity}</p>
        <motion.div
          {...buttonClcik}
          className="w-8 h-8 flex items-center justify-center rounded-md drop-shadow-md bg-zinc-900 cursor-pointer"
          onClick={() => incrementCart(data?.productId)}
        >
          <p className="text-xl font-semibold text-primary">+</p>
        </motion.div>
      </div>

</motion.div>
    )
}
export default Cart