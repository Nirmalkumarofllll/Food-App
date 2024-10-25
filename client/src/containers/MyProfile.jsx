import React from 'react';
import { useSelector } from 'react-redux';
import { MdVerified } from 'react-icons/md';
import "../assets/css/myProfile.css";
import { Header } from "../components";
import { Avatar } from '../assets';

const MyProfile = () => {
  // Get user details from the Redux store
  const user = useSelector((state) => state.user);

  // Function to convert UNIX timestamp (auth_time) to readable date
  const convertAuthTime = (authTime) => {
    if (authTime) {
      const date = new Date(authTime * 1000); // Convert seconds to milliseconds
      return date.toLocaleDateString("en-US", {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
    return 'N/A';
  };

  // If user data is not available, return a loading message or a fallback
  if (!user) {
    return (
      <div className="my-profile-container flex flex-col items-center justify-center min-h-screen">
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="my-profile-container flex flex-col items-center justify-center min-h-screen">
      <Header />
      <div className="profile-card bg-white p-8 rounded-xl shadow-lg w-full max-w-4xl flex flex-col lg:flex-row items-center lg:items-start relative">
        
        {/* User Profile Picture on the Left */}
        <div className="avatar lg:mr-8 mb-6 lg:mb-0">
          {user?.picture ? (
            <img 
              src={user.picture} 
              alt={Avatar}
              className="rounded-full w-40 h-40 object-cover p-1 shadow-md"
            />
          ) : (
            <img 
            src={Avatar} 
            alt={Avatar}
            className="rounded-full w-40 h-40 object-cover shadow-md"
          />
          )}
        </div>

        {/* User Details on the Right */}
        <div className="flex-1 text-center lg:text-left">
          {/* User Name */}
          <div className="flex items-center justify-center lg:justify-start mb-2">
            <h2 className="text-3xl font-semibold text-gray-800 mr-2">
              {user?.name || (user?.email && user.email.split('@')[0])}
            </h2>
            {/* Verified Badge */}
            {user?.email_verified ? (
              <MdVerified className="text-blue-500 text-xl" title="Verified" />
            ) : (
              <span className="text-red-500">Not Verified</span>
            )}
          </div>

          {/* User Email */}
          <p className="text-lg text-gray-500 mb-4">
            {user?.email || "user@example.com"}
          </p>

          {/* Last Authentication Time */}
          <p className="text-md text-gray-400">
            Last authenticated on: {convertAuthTime(user?.auth_time)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
