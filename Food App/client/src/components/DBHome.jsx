import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllProducts, getAllUsers } from '../api'; // Fetch both users and products
import { setAllProducts } from '../context/actions/productActions';
import { setAllUserDetails } from '../context/actions/allUserAction';
import { CChart } from "@coreui/react-chartjs";
import { FaUser } from "react-icons/fa";
import { BsBoxes, BsFillBoxSeamFill } from 'react-icons/bs';
import { IoFastFoodSharp } from "react-icons/io5";
import { MdMarkEmailRead } from 'react-icons/md';
import { getAllOrder } from "../api";
import { setOrders } from "../context/actions/ordersAction";

const DBHome = () => {
  const products = useSelector((state) => state.products);
  const allUsers = useSelector((state) => state.allUsers);
  const orders = useSelector((state) => state.orders); 
  const dispatch = useDispatch();

  // Filter categories for products
  const drinks = products?.filter((item) => item.product_category === 'Drinks');
  const deserts = products?.filter((item) => item.product_category === 'Deserts');
  const fruits = products?.filter((item) => item.product_category === 'Fruits');
  const rice = products?.filter((item) => item.product_category === 'Rice');
  const curry = products?.filter((item) => item.product_category === 'Curry');
  const chinese = products?.filter((item) => item.product_category === 'Chinese');
  const bread = products?.filter((item) => item.product_category === 'Bread');

  // Count verified emails
  const verifiedEmailsCount = allUsers?.filter((user) => user.emailVerified).length || 0;
  const totalUsersCount = allUsers?.length || 0;

  useEffect(() => {
    // Fetch products and users data if not available
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
  }, [products, allUsers, dispatch]);

  useEffect(() => {
    // Fetch products and users data if not available
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
    // Fetch orders data if not available
    if (!orders) {
      getAllOrder().then((data) => {
        dispatch(setOrders(data));
      });
    }
  }, [products, allUsers, orders, dispatch]);

  // Calculate order statistics
  const totalOrders = orders?.length || 0;
  const deliveredOrders = orders?.filter(order => order.sts === 'delivered').length || 0;
  const cancelledOrders = orders?.filter(order => order.sts === 'cancelled').length || 0;
  const paidOrders = orders?.filter(order => order.status).length || 0; // Assuming isPaid is a boolean
  const notPaidOrders = totalOrders - paidOrders; // Calculate not paid from total


  return (
    <div className='flex items-center justify-center flex-col pt-6 w-full h-full'>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full px-6\\ mt-6">
        {/* Emails Count Card */}
        <div className="bg-lightOverlay p-6 rounded-lg shadow-md flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-darkOverlay flex items-center justify-center">
          <IoFastFoodSharp className="text-gray-300 text-3xl"/> {/* Icon */}
          </div>
          <div>
            <h2 className="text-2xl font-bold">{totalOrders}</h2>
            <p className="text-md text-red-500">Orders</p>
          </div>
        </div>

        {/* Products Count Card */}
        <div className="bg-lightOverlay p-6 rounded-lg shadow-md flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-darkOverlay  flex items-center justify-center">
          <BsFillBoxSeamFill  className="text-gray-300 text-3xl" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">{products?.length || 0}</h2> 
            <p className="text-md text-red-500">Products</p>
          </div>
        </div>

        {/* Total Users Count Card */}
        <div className="bg-lightOverlay p-6 rounded-lg shadow-md flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-darkOverlay flex items-center justify-center">
          <FaUser className=" text-gray-300 text-3xl"/>
          </div>
          <div>
            <h2 className="text-2xl font-bold">{totalUsersCount}</h2>
            <p className="text-md text-red-500">Total Users</p>
          </div>
        </div>
      </div>

      <div className='grid w-full grid-cols-1 md:grid-cols-2 gap-4 h-full p-0'>
        {/* Bar Chart for Product Categories */}
        <div className='flex items-start justify-start pt-10'>
          <div className='w-full p-0'>
            <div className='bg-lightOverlay cursor-pointer justify-center items-center h-[370px] shadow-md w-full p-5 rounded-lg'>
            <CChart
              type="bar"
              data={{
                labels: ['Drinks', 'Deserts', 'Fruits', 'Rice', 'Curry', 'Chinese', 'Bread'],
                datasets: [
                  {
                    label: 'Category',
                    backgroundColor: '#f87979',
                    data: [drinks?.length, deserts?.length, fruits?.length, rice?.length, curry?.length, chinese?.length, bread?.length],
                  },
                ],
              }}
              options={{
                plugins: {
                  legend: {
                    labels: {
                      color: 'rgba(37, 43, 54, .95)',
                    }
                  }
                },
                scales: {
                  x: {
                    grid: {
                      color: "rgba(8, 10, 12, .175)",
                    },
                    ticks: {
                      color: "rgba(37, 43, 54, .95)",
                    },
                  },
                  y: {
                    grid: {
                      color: "rgba(8, 10, 12, .175)",
                    },
                    ticks: {
                      color: "rgba(37, 43, 54, .95)",
                    },
                  },
                },
              }}
            />
            </div>
          </div>
        </div>

        {/* Doughnut Chart */}
        <div className='w-full h-full flex items-start justify-start pt-10'>
          <div className='w-full'>
            <div className='bg-lightOverlay relative justify-center shadow-md min-w-full h-[370px] px-20 rounded-lg'>
              <CChart 
                type="doughnut"
                data={{
                  labels: ['Orders', 'Delivered', 'Cancelled', 'Paid', 'Not Paid'],
                  datasets: [
                    {
                      backgroundColor: ['#3F9F9F', '#A2C3DB', '#8AAF22', '#DD1B16', '#DCB12D'],
                      borderColor: 'transparent',
                      data: [totalOrders, deliveredOrders, cancelledOrders, paidOrders, notPaidOrders],
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  plugins: {
                    tooltip: {
                      callbacks: {
                        label: function (context) {
                          const label = context.label || '';
                          const value = context.raw || 0;
                          return `${label}: ${value}`; // Ensures values appear in the tooltip
                        },
                      },
                    },
                    legend: {
                      position: 'left',
                      labels: {
                        color: 'rgba(37, 43, 54, .95)', // Keeps the label color for good contrast
                        font: {
                          size: 16, // Increases the font size of the labels
                        },
                      },
                    },
                  },
                }}
              />
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default DBHome;