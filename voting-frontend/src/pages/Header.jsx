
import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="bg-gradient-to-r from-blue-500 via-teal-500 to-indigo-500 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          <Link to="/" className="hover:underline hover:text-yellow-300 transition duration-300">Home</Link>
        </h1>
        <nav className="space-x-4">
          <Link 
            to="/signup" 
            className="hover:underline hover:text-yellow-300 transition duration-300"
          >
            Sign Up
          </Link>
          <Link 
            to="/signin" 
            className="hover:underline hover:text-yellow-300 transition duration-300"
          >
            Sign In
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
