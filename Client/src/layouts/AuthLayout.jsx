import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/navbar/Navbar';

const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full h-full">
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
