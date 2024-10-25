import React, { useEffect } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import { Failed } from "../assets";
import { Header } from ".";
import { motion } from "framer-motion";
import { buttonClcik } from "../animations";

const CheckoutSuccess = () => {
  return (
    <main className=" w-screen min-h-screen flex items-center justify-start flex-col">
      <Header />
      <div className="w-full flex flex-col items-center justify-center md:mt-20 mt-40 px-6 md:px-24 2xl:px-96 gap-12 pb-24">
        <img src={Failed} className="w-full md:w-460" alt="" />

        <h1 className="text-[50px] text-headingColor font-bold">
          Transaction Failed
        </h1>

        <motion.div {...buttonClcik}>
          <NavLink
            to={"/"}
            className="flex items-center justify-center gap-4 cursor-pointer text-2xl text-textColor font-semibold px-4 py-2 rounded-md border border-gray-300 hover:shadow-md"
          >
            <FaArrowLeft className="text-3xl text-textColor " /> Get back to
            Home
          </NavLink>
        </motion.div>
      </div>
    </main>
  );
};

export default CheckoutSuccess;
