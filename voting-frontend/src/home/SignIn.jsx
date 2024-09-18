import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function SignIn() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // Add loading state
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading state to true

    try {
      const response = await axios.post('http://localhost:8080/api/auth/login', formData, { withCredentials: true });

      if (response.status === 200) {
        const { role, mlaId } = response.data;
        console.log('Role:', role);
        console.log('MLA ID:', mlaId);
        if (role === 'ROLE_MLA') {
          navigate(`/mlapage/${mlaId}`);
        } else if (role === 'ROLE_USER') {
          navigate('/userpage');
        } else {
          navigate('/');
        }
        
      }
    } catch (err) {
      if (err.response) {
        setError(`Login failed: ${err.response.data.message}`);
      } else if (err.request) {
        setError('No response received from the server. Please try again later.');
      } else {
        setError(`An unexpected error occurred: ${err.message}`);
      }
      console.error('Error:', err);
    } finally {
      setLoading(false); // Set loading state to false after request
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Sign In</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {loading ? (
          <p className="text-blue-500">Signing in...</p> // Display loading text or spinner
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
                placeholder="Enter your email"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
                placeholder="Enter your password"
                required
              />
            </div>
            <div className="mb-6">
              <button
                type="submit"
                className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              >
                Sign In
              </button>
            </div>
          </form>
        )}
        <div className="text-center">
          <p className="text-gray-600">
            Don't have an account?{' '}
            <Link to="/signup" className="text-blue-500 hover:underline">
              Sign Up
            </Link>
          </p>
          <p className="text-gray-600 mt-2">
            <Link to="/" className="text-blue-500 hover:underline">
              Back to Home
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
