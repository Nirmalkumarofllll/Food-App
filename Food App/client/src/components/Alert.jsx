import { motion } from 'framer-motion';
import React from 'react';
import { FaCheck } from "react-icons/fa";
import { IoIosWarning } from "react-icons/io";
import { MdDangerous } from "react-icons/md";
import { FaInfoCircle } from "react-icons/fa";

const Alert = ({ type, message }) => {
    // Animation properties
    const alertVariants = {
        hidden: { x: '100%', opacity: 0 },  // Start off-screen to the right
        visible: { x: 0, opacity: 1 },      // Move to the original position
        exit: { x: '100%', opacity: 0 },    // Move off-screen to the right
    };

    if (type === "warning") {
        return (
            <motion.div
                variants={alertVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.3 }}  // Adjust the duration as needed
                className='fixed h-12 z-50 top-32 right-12 px-4 py-2 rounded-md backdrop-blur-md bg-orange-300 shadow-md flex items-center gap-2'
            >
                <IoIosWarning className='h-6 w-6 text-xl text-orange-700' />
                <p className='text-xl text-orange-700'>{message}</p>
            </motion.div>
        )
    }
    if (type === "danger") {
        return (
            <motion.div
                variants={alertVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.3 }}
                className='fixed h-12 z-50 top-32 right-12 px-4 py-2 rounded-md backdrop-blur-md bg-red-300 shadow-md flex items-center gap-2'
            >
                <MdDangerous className='h-6 w-6 text-xl text-red-700' />
                <p className='text-xl text-red-700'>{message}</p>
            </motion.div>
        )
    }
    if (type === "info") {
        return (
            <motion.div
                variants={alertVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.3 }}
                className='fixed h-12 z-50 top-32 right-12 px-4 py-2 rounded-md backdrop-blur-md bg-blue-300 shadow-md flex items-center gap-2'
            >
                <FaInfoCircle className='h-6 w-6 text-xl text-blue-700' />
                <p className='text-xl text-blue-700'>{message}</p>
            </motion.div>
        )
    }
    if (type === "success") {
        return (
            <motion.div
                variants={alertVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.3 }}
                className='fixed h-12 z-50 top-32 right-12 px-4 py-2 rounded-md backdrop-blur-md bg-emerald-300 shadow-md flex items-center gap-2'
            >
                <FaCheck className='h-6 w-6 text-xl text-emerald-700' />
                <p className='text-xl text-emerald-700'>{message}</p>
            </motion.div>
        )
    }
};

export default Alert;
