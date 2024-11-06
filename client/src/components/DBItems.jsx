import React, { useEffect } from 'react';
import DataTable from './DataTable';
import { HiCurrencyRupee } from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";
import { deleteAProduct, getAllProducts } from '../api';
import { setAllProducts } from '../context/actions/productActions';
import {alertSuccess, alertNULL} from '../context/actions/alertActions';

const DBItems = () => {
  const products = useSelector((state) => state.products);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!products || products.length === 0) {
      getAllProducts().then((data) => {
        dispatch(setAllProducts(data));
      });
    }
  }, [products, dispatch]);
  

  return (
    <div className='flex items-center justify-self-center gap-4 pt-6 w-full'>
      <DataTable
        columns={[
          {
            title: "Image",
            field: "imageURL",
            render: (rowData) => (
              <img
                className='w-32 h-16 object-contain rounded-md'
                src={rowData.imageURL}
                alt={rowData.product_name}
              />
            ),
          },
          {
            title: "Name",
            field: "product_name",
          },
          {
            title: "Category",
            field: "product_category",
          },
          {
            title: "Price",
            field: "product_price",
            render: (rowData) => (
              <p className='text-xl font-semibold text-textColor flex items-center'>
                <HiCurrencyRupee className='text-red-400 mr-1' />
                {parseFloat(rowData.product_price).toFixed(2)}
              </p>
            ),
          },
        ]}
        data={products ||[]}
        title="List of Products"
        actions={[
          /*{
            icon: "edit",
            tooltip: "Edit data",
            onClick: (event, rowData) => {
              alert("Edit " + rowData.productId);
            },
          },*/
          {
            icon: "delete",
            tooltip: "Delete data",
            onClick: (event, rowData) => {
              if (window.confirm("Are you sure, do you want to delete this data?"))
              {
                deleteAProduct(rowData.productId).then(res => {
                  dispatch(alertSuccess('Product Deleted successfully'));
                  setInterval(() => {
                    dispatch(alertNULL());
                  },3000);
                  getAllProducts().then((data) =>{
                    dispatch(setAllProducts(data));
                  })
                })                
              }
            },
          },
        ]}
        
      />
    </div>
  );
};

export default DBItems;
