import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setAllUserDetails } from '../context/actions/allUserAction';
import { getAllUsers } from '../api';
import DataTable from './DataTable';
import { HiCurrencyRupee } from "react-icons/hi";
import { Avatar } from "../assets";

const DBUsers = () => {
  const allUsers = useSelector((state) => state.allUsers);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!allUsers || allUsers.length === 0) {
      getAllUsers().then((data) => {
        dispatch(setAllUserDetails(data));
      });
    }
  }, [allUsers, dispatch]);

  return (
    <div className='flex items-center justify-self-center gap-4 pt-6 w-full'>
      <DataTable
        columns={[
          {
            title: "Image",
            field: "photoURL",
            render: (rowData) => (
              <img
                className='w-16 h-16 object-contain rounded-full'
                src={rowData.photoURL ? rowData.photoURL : Avatar} // Display user's photo or default avatar
                alt={rowData.displayName || "User Avatar"} // Use displayName as alt text
                onError={(e) => { e.target.src = Avatar; }} // Fallback to default avatar on error
              />
            ),
          },
          {
            title: "Name",
            field: "displayName",
            render: (rowData) => {
              return rowData.displayName || rowData.email.split('@')[0];
            },
          },
          {
            title: "Email",
            field: "email",
          },
          {
            title: "Verified",
            field: "emailVerified",
            render: (rowData) => (
              <p className={`px-2 py-1 w-32 text-center text-primary rounded-md ${rowData.emailVerified ? "bg-emerald-500" : "bg-red-500"}`}>
                {rowData.emailVerified ? "Verified" : "Not Verified"}
              </p>
            )
          },
        ]}
        data={allUsers || []}
        title="List of Users"
        // actions={[
        //   {
        //     icon: "edit",
        //     tooltip: "Edit data",
        //     onClick: (event, rowData) => {
        //       alert("Edit " + rowData.productId);
        //     },
        //   },
        //   {
        //     icon: "delete",
        //     tooltip: "Delete data",
        //     onClick: (event, rowData) => {
        //       if (window.confirm("Are you sure, do you want to delete this data?"))
        //       {
        //         deleteAProduct(rowData.productId).then(res => {
        //           dispatch(alertSuccess('Product Deleted successfully'));
        //           setInterval(() => {
        //             dispatch(alertNULL());
        //           }, 3000);
        //           getAllProducts().then((data) => {
        //             dispatch(setAllProducts(data));
        //           })
        //         })                
        //       }
        //     },
        //   },
        // ]}
      />
    </div>
  );
}

export default DBUsers;
