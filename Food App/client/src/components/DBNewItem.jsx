import React, { useState } from 'react'
import { statuses } from '../utils/styles';
import Spinner from './Spinner';
import { FaCloudUploadAlt } from 'react-icons/fa';
import {deleteObject, getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import {useDispatch, useSelector} from "react-redux";
import {alertDanger, alertNULL, alertSuccess} from "../context/actions/alertActions";
import { storage } from '../config/firebase.config';
import {motion} from "framer-motion";
import { MdDelete } from "react-icons/md";
import { addNewProduct, getAllProducts } from '../api';
import {setAllProducts} from "../context/actions/productActions";

const DBNewItem = () => {
  const [itemName, setItemName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const [progress, setProgress] = useState(null);
  const [imageDownloadURL, setImageDownloadURL] = useState(null);
  const alert = useSelector((state) => state.alert);
  const dispatch = useDispatch();
  const uploadImage = (e) => {
    setLoading(true);
    const imageFile = e.target.files[0];
    const storageRef = ref(storage, `Images/${Date.now()}__${imageFile.name}`);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);
    uploadTask.on('state_changed', (snapshot) => {
      setProgress((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
    }, (error) => {
      dispatch(alertDanger(`Error : ${error}`));
      setTimeout(() => {
        dispatch(alertNULL());
      }, 3000);
    }, () => {
      getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
        setImageDownloadURL(downloadURL);
        setLoading(false);
        setProgress(null);
        dispatch(alertSuccess ("Image Uploaded Successfully"));
        setTimeout(() => {
          dispatch(alertNULL());
      }, 3000);
      });
    } );
  };

  const deleteImageFromFirebase = () => {
    setLoading(true);
    const deleteRef = ref(storage, imageDownloadURL)
    deleteObject(deleteRef).then(() => {
      setImageDownloadURL(null);
      setLoading(false)
      dispatch(alertSuccess ("Image Removed Successfully"));
        setTimeout(() => {
          dispatch(alertNULL());
      }, 3000);
    });
    getAllProducts().then((data) =>{
      dispatch(setAllProducts(data));
    })
  }

  const submitNewData = () => {
    const data = {
      product_name : itemName,
      product_category : category,
      product_price : price,
      imageURL : imageDownloadURL,
    };
    addNewProduct(data).then(res => {
      console.log(res);
      dispatch(alertSuccess('Items Added'));
      setTimeout(() => {
        dispatch(alertNULL());
      }, 3000);
      setImageDownloadURL(null);
      setItemName("");
      setPrice("");
      setCategory(null);
    })
  }
  return (
    <div className='flex items-center flex-col pt-6  w-full'>
        <div className='border border-gray-300 rounded-md p-4 w-full flex flex-col items-center justify-center gap-4'>
          <InputValueField
            type="text"
            placeholder={"Item Name"}
            stateFunc={setItemName}
            stateValue={itemName}
          />
          <div className='w-full flex items-center justify-around gap-3 flex-wrap'>
          {statuses && statuses?.map (data => (
            <p 
            key={data.id} 
            onClick={() => setCategory(data.category)}
            className={`px-4 py-3 rounded-md text-xl text-textColor font-semibold cursor-pointer hover:shadow-md border border-gray-200 backdrop-blur-md ${data.category === category ? 'bg-red-400 text-white' : 'bg-transparent'}`}>
            {data.title}
          </p>
          ))}
        </div>   
        <InputValueField
            type="number"
            placeholder={"Item Price"}
            stateFunc={setPrice}
            stateValue={price}
          />
          <div className='w-full bg-card backdrop-blur-md h-370 rounded-md border-2 border-dotted border-gray-300 cursor-pointer' >
            {isLoading ? <div className='w-full h-full flex flex-col items-center justify-evenly px-24'>
              <Spinner />
              {Math.round(progress >= 0) && (
                <div className='w-full flex flex-col items-center justify-center gap-2'>
                  <div className='flex justify-between w-full'>
                    <span className='text-base font-medium text-textColor'>Uploading</span>
                    <span className='text-sm font-medium text-textColor'>
                      {Math.round(progress) > 0 && (
                        <>{`${Math.round(progress)}%`}</>
                      )}
                    </span>
                  </div>

                  <div className='w-full bg-gray-200 rounded-full h-2.5'>
                      <div className='bg-red-600 h-2.5 rounded-full transition-all duration-300 ease-in-out'
                      style={ {width: `${Math.round(progress)}%`,}}> </div>
                  </div>
                </div>
              )}
            </div> : <>
              {!imageDownloadURL ? <>
              <label><div className='flex flex-col items-center justify-center h-full w-full cursor-pointer'>
                <div className='flex flex-col justify-center items-center cursor-pointer'>
                  <p className='font-bold text-4xl mt-auto'>
                    <FaCloudUploadAlt className='-rotate-0 '/>
                  </p>
                  <p className='text-lg text-textColor mt-0'>
                    Click to Upload an image
                  </p>
                </div>
                </div>
                <input
                type='file'
                name='upload-image'
                accept='image/*'
                onChange={uploadImage}
                className='w-0 h-0'
                />
                </label>
              </> : <>
              <div className='relative w-full h-full overflow-hidden rounded-md'>
                <motion.img whileHover={{scale : 1.10}} src={imageDownloadURL} className='w-[100%] h-[100%] mt-[0%] ml-[0%] object-contain' />

                <motion.button type="button" className='absolute top-3 right-3 p-3 rounded-full bg-red-500 text-xl cursor-pointer outline-none hover:shadow-md duration-500 transition-all ease-out'
                whileTap={{ scale: 0.95 }}
                onClick={() => deleteImageFromFirebase(imageDownloadURL) }>
                  <MdDelete className='-rotate-0' />
                </motion.button>

              </div>
              </> }
            </> }
          </div>

          <motion.button onClick={submitNewData} whileTap={{scale : 0.95}} className='w-9/12 py-2 rounded-md bg-red-400 text-primary hover:bg-red-500 cursor-pointer'>
                Save
          </motion.button>
        </div>   
        
    </div>
  )
}

export const InputValueField = ({type, placeholder, stateValue, stateFunc}) => {
  return(
    <> 
    <input type={type}
    placeholder={placeholder}
    className='w-full px-4 py-3 bg-gray-100 shadow-md outline-none rounded-md border text-gray-400 border-gray-200 focus:border-red-200'
    value={stateValue}
    onChange={(e) => stateFunc(e.target.value)}
    />
    </>
  )
}

export default DBNewItem
