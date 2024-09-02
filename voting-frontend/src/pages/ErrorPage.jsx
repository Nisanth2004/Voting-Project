import React from 'react';
import { Link } from 'react-router-dom';

const ErrorPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-r from-red-200 to-yellow-200 p-6">
      <h1 className="text-4xl font-extrabold text-gray-800 mb-8">Access Denied</h1>
      <p className="text-lg mb-4">You need to be logged in to access this page.</p>
      <p className="text-lg mb-4">Please log in   to continue.</p>

      <Link to="/signin">
        <button className="px-6 py-3 bg-gradient-to-r from-blue-400 to-blue-600 text-white text-lg rounded-full shadow-lg hover:from-blue-500 hover:to-blue-700 transition-transform transform hover:scale-105 duration-300 mt-6">
          Go to Login
        </button>
      </Link>
    </div>
  );
};

export default ErrorPage;
