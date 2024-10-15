import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrder } from "../api";
import { Footer, Header, OrderData } from "../components";
import { setOrders } from "../context/actions/ordersAction";
import { OrderNow } from "../assets";
import { Link } from "react-router-dom";

const UsersOrder = () => {
    const user = useSelector((state) => state.user); // Currently logged-in user
    const orders = useSelector((state) => state.orders); // All orders from Redux store
    const dispatch = useDispatch();
  
    const [userOrders, setUserOrders] = useState([]); // Initialize with an empty array
  
    useEffect(() => {
      // Fetch orders if they are not already loaded
      if (!orders) {
        getAllOrder().then((data) => {
          dispatch(setOrders(data));
          // Filter orders based on the user_id from the order's customer data
          setUserOrders(data.filter((order) => order.customer?.user_id === user?.user_id));
        });
      } else {
        // If orders are already in Redux, filter them
        setUserOrders(orders.filter((order) => order.customer?.user_id === user?.user_id));
      }
    }, [orders, dispatch, user?.user_id]); 

  return (
    <main className="w-screen min-h-screen flex items-center justify-start flex-col bg-primary">
      <div className="min-h-screen w-full">
      <Header />
      <div className="w-full flex flex-col items-start justify-center mt-40 px-6 md:px-24 2xl:px-96 gap-12 pb-24">
        {userOrders?.length > 0 ? (
          <>
            {userOrders
            .slice() 
            .reverse()
            .map((item, i) => (
              <OrderData key={i} index={i} data={item} admin={false} />
            ))}
          </>
        ) : (
<>
  <div className="flex flex-col items-center justify-center w-full h-full p-6 text-center md:text-left md:flex-row md:space-x-6">
    <img src={OrderNow} className="w-full max-w-[300px] md:max-w-[400px] h-auto" alt="Order Now" />
    
    <div className="flex flex-col items-center md:items-start justify-center space-y-4">
      <h1 className="text-[36px] md:text-[72px] text-headingColor font-bold">
        Try Our Products
      </h1>
      
      <p className="text-lg md:text-xl text-textColor max-w-md">
        Discover our wide range of delicious products. Place your order now and experience the freshness delivered straight to your doorstep!
      </p>
      
      <Link to={"/"} className="px-8 py-3 bg-red-500 text-white font-semibold rounded-md shadow-md hover:bg-red-600 transition-all">
        Order Now
      </Link>
    </div>
  </div>
</>

        )}
      </div>
      </div>
      <Footer/>
    </main>
  );
};

export default UsersOrder;
