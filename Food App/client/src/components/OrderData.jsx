import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { HiCurrencyRupee } from "react-icons/hi";
import { buttonClcik, staggerFadeInOut } from "../animations";
import { getAllOrder, updateOrderSts } from "../api";
import { setOrders } from "../context/actions/ordersAction";
import { useDispatch, useSelector } from "react-redux";
import { Avatar } from "../assets";
import { BiSolidCheckShield } from "react-icons/bi";

const OrderData = ({ index, data, admin }) => {
    const user = useSelector((state) => state.user);
    const dispatch = useDispatch();

    const handleClick = (orderId, sts) => {
        updateOrderSts(orderId, sts).then((response) => {
            getAllOrder().then((data) => {
                dispatch(setOrders(data));
            });
        });
    };

    const formatDate = (timestamp) => {
        if (!timestamp) return "N/A";
        const isMilliseconds = timestamp.toString().length === 13;
        const date = new Date(isMilliseconds ? timestamp : timestamp * 1000);
        if (isNaN(date)) return "Invalid date";
        return date.toLocaleString();
    };

    const [isLaptop, setIsLaptop] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            setIsLaptop(window.innerWidth >= 1024); // Adjust the breakpoint as needed
        };

        window.addEventListener('resize', handleResize);
        handleResize(); // Call it initially to set the state

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <motion.div
            {...staggerFadeInOut(index)}
            className={`w-full flex flex-col items-start justify-start px-10 py-2 border relative border-gray-300 bg-lightOverlay drop-shadow-md rounded-md gap-4 ${isLaptop ? 'h-36' : ''}`}
        >
            {isLaptop ? (
                <>
                    <div className="w-full flex items-start justify-between">
                        <h1 className="text-xl text-headingColor font-semibold">Order ID: {data.orderId}</h1>
                        <div className="flex items-start gap-4">
                            <p className="flex items-center gap-1 text-textColor">
                                Total: <HiCurrencyRupee className="text-lg text-red-500" />{" "}
                                <span className="text-headingColor font-semibold text-lg">{data?.total}</span>
                            </p>
                            <p className="px-2 flex py-[4px] text-sm text-headingColor font-semibold capitalize items-center rounded-full bg-emerald-400 drop-shadow-md">
                                <BiSolidCheckShield />
                                {data?.status}
                            </p>
                            <p
                                className={`text-base font-semibold mr-[100px] capitalize border border-gray-300 px-2 py-[2px] rounded-full ${
                                    (data.sts === "preparing" && "text-orange-500 bg-orange-100") ||
                                    (data.sts === "cancelled" && "text-red-500 bg-red-100") ||
                                    (data.sts === "delivered" && "text-emerald-500 bg-emerald-100")
                                }`}
                            >
                                {data?.sts}
                            </p>
                            {admin && (
                                <div className="flex flex-col items-start h-32 justify-center gap-2">
                                    <motion.p
                                        {...buttonClcik}
                                        onClick={() => handleClick(data.orderId, "preparing")}
                                        className="text-orange-500 w-20 justify-center items-center flex bg-darkOverlay z-50 text-base font-semibold capitalize border border-gray-300 px-2 py-[2px] rounded-md cursor-pointer"
                                    >
                                        Prepare
                                    </motion.p>
                                    <motion.p
                                        {...buttonClcik}
                                        onClick={() => handleClick(data.orderId, "cancelled")}
                                        className="text-red-500 z-50 w-20 justify-center items-center flex bg-darkOverlay text-base font-semibold capitalize border border-gray-300 px-2 py-[2px] rounded-md cursor-pointer"
                                    >
                                        Cancel
                                    </motion.p>
                                    <motion.p
                                        {...buttonClcik}
                                        onClick={() => handleClick(data.orderId, "delivered")}
                                        className="text-emerald-500 z-50 w-20 justify-center items-center flex bg-darkOverlay text-base font-semibold capitalize border border-gray-300 px-2 py-1 rounded-lg cursor-pointer"
                                    >
                                        Deliver
                                    </motion.p>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="flex absolute items-center justify-start flex-wrap w-full">
                        <div className="flex items-center justify-center gap-4">
                            {data?.items &&
                                data.items.map((item, j) => (
                                    <motion.div
                                        {...staggerFadeInOut(j)}
                                        key={j}
                                        className="flex items-center mt-12 justify-center gap-1"
                                    >
                                        <img
                                            src={item.imageURL}
                                            className="w-16 h-16 object-contain"
                                            alt=""
                                        />
                                        <div className="flex items-start flex-col">
                                            <p className="text-base font-semibold text-headingColor">
                                                {item.product_name}
                                            </p>
                                            <div className="flex items-start gap-2">
                                                <p className="text-sm text-textColor">Qty: {item.quantity}</p>
                                                <p className="flex items-center gap-1 text-textColor">
                                                    <HiCurrencyRupee className="text-base text-red-500" />
                                                    {parseFloat(item.product_price).toFixed(2)}
                                                </p>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                        </div>
                        <div className="flex items-center justify-start mt-12 absolute px-6 ml-[50%] w-full md:w-460">
                            <motion.img
                                className="w-10 h-10 object-contain rounded-full"
                                src={data.customer?.picture ? data.customer.picture : Avatar}
                                whileHover={{ scale: 1.15 }}
                                referrerPolicy="no-referrer"
                            />
                            <div className="flex flex-col ml-4">
                                <h1 className="text-lg text-headingColor font-semibold">{data.customer?.name || data.customer?.email.split('@')[0]}</h1>
                                <p className="text-base text-headingColor">{data.customer?.email}</p>
                                <p className="text-sm text-headingColor">Order Date: {formatDate(data.created)}</p>
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                <div className="flex flex-col w-full gap-2">
                    <h1 className="text-lg text-headingColor font-semibold">Order ID: {data.orderId}</h1>
                    <p className="flex items-center gap-1 text-textColor">
                        Total: <HiCurrencyRupee className="text-lg text-red-500" />{" "}
                        <span className="text-headingColor font-semibold text-lg">{data?.total}</span>
                    </p>
                  <div className="flex items-center gap-2">
                  <p className="px-2 flex py-[4px] text-sm text-headingColor font-semibold capitalize items-center rounded-full bg-emerald-400 drop-shadow-md">
                     <BiSolidCheckShield />
                     {data?.status}
                   </p>
                  <p
                    className={`text-base font-semibold border border-gray-300 px-2 py-[2px] rounded-full flex items-center ${
                    (data.sts === "preparing" && "text-orange-500 bg-orange-100") ||
                    (data.sts === "cancelled" && "text-red-500 bg-red-100") ||
                    (data.sts === "delivered" && "text-emerald-500 bg-emerald-100")
                   }`}
                  >
                       {data?.sts}
                   </p>
                </div>

                    <h2 className="text-md font-semibold">Items:</h2>
                    {data?.items && data.items.map((item, j) => (
                        <div key={j} className="flex items-center justify-start gap-2 mb-2">
                            <img src={item.imageURL} className="w-12 h-12 object-contain" alt="" />
                            <div className="flex flex-col">
                                <p className="text-base font-semibold text-headingColor">{item.product_name}</p>
                                <p className="text-sm text-textColor">Qty: {item.quantity}</p>
                                <p className="flex items-center gap-1 text-textColor">
                                    <HiCurrencyRupee className="text-base text-red-500" />
                                    {parseFloat(item.product_price).toFixed(2)}
                                </p>
                            </div>
                        </div>
                    ))}
                    <div className="flex items-center justify-start mt-4">
                        <motion.img
                            className="w-10 h-10 object-contain rounded-full"
                            src={data.customer?.picture ? data.customer.picture : Avatar}
                            whileHover={{ scale: 1.15 }}
                            referrerPolicy="no-referrer"
                        />
                        <div className="flex flex-col ml-4">
                            <h1 className="text-lg text-headingColor font-semibold">{data.customer?.name || data.customer?.email.split('@')[0]}</h1>
                            <p className="text-base text-headingColor">{data.customer?.email}</p>
                            <p className="text-sm text-headingColor">Order Date: {formatDate(data.created)}</p>
                        </div>
                    </div>
                </div>
            )}
        </motion.div>
    );
};

export default OrderData;
