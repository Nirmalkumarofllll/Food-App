import React from 'react'
import { NavLink } from 'react-router-dom'
import { FoodLogo } from '../assets'
import { isActiveStyles, isNotActiveStyles } from '../utils/styles'

const DBLeftSection = () => {
  return (
    <div className='h-full py-12 flex flex-col bg-slate-50 backdrop-blur-md pt-0 pb-0 shadow-md min-w-210 w-300'>
        <NavLink to={"/"} className="flex items-center justify-start gap-4">
            <img src={FoodLogo} className='w-40' alt='' />
            <p className="font-semibold text-xl"></p>
     </NavLink>
     <hr/>
     <ul className='flex flex-col gap-4'>
        <NavLink to={"/dashboard/home"} className={({isActive}) => isActive ? `${isActiveStyles}  px-4 py-2 border-l-8 border-red-500 text-lg mt-1 mb-0 text-red-500`   : `${isNotActiveStyles} px-4 py-2 mt-1 mb-0  text-lg ml-2 hover:text-red-500`} >
            Home
        </NavLink>
        <NavLink to={"/dashboard/orders"} className={({isActive}) => isActive ? `${isActiveStyles} px-4 py-2 border-l-8 border-red-500 text-lg mt-1 mb-0 text-red-500` :`${isNotActiveStyles} px-4 py-2 mt-1 mb-0 text-lg ml-2 hover:text-red-500`} >
            Orders
        </NavLink>
        <NavLink to={"/dashboard/items"} className={({isActive}) => isActive ? `${isActiveStyles} px-4 py-2 border-l-8 border-red-500 text-lg mt-1 mb-0 text-red-500` :`${isNotActiveStyles} px-4 py-2 mt-1 mb-0 text-lg ml-2 hover:text-red-500`} >
            Items
        </NavLink>
        <NavLink to={"/dashboard/newItem"} className={({isActive}) => isActive ? `${isActiveStyles} px-4 py-2 border-l-8 border-red-500 text-lg mt-1 mb-0 text-red-500` :`${isNotActiveStyles} px-4 py-2 mt-1 mb-0 text-lg ml-2 hover:text-red-500`} >
            Add New Items
        </NavLink>
        <NavLink to={"/dashboard/Users"} className={({isActive}) => isActive ? `${isActiveStyles} px-4 py-2 border-l-8 border-red-500 text-lg mt-1 mb-0 text-red-500` :`${isNotActiveStyles} px-4 py-2 mt-1 mb-0 text-lg ml-2 hover:text-red-500`} >
            Users
        </NavLink>
        
     </ul>
    </div>
  )
}

export default DBLeftSection
