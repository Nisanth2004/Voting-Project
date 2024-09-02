import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const NominateForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    email: '',
    aadhar: '',
    photo: null,
    nativityCertificate: null,
  });

  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const mlaId = location.state?.mlaId; // Get mlaId from state

  useEffect(() => {
    // Check if the user is authenticated
    const checkAuthentication = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/auth/check', { withCredentials: true });
        if (response.status !== 200) {
          navigate('/signin'); // Redirect to login if not authenticated
        }
      } catch (err) {
        console.error('Authentication check failed:', err);
        navigate('/error'); // Redirect to login if authentication check fails
      }
    };

    checkAuthentication();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name || !formData.age || !formData.email || !formData.aadhar || !formData.photo || !formData.nativityCertificate) {
      setError('Please fill all fields and upload all required documents.');
      return;
    }

    try {
      const formDataObject = new FormData();
      formDataObject.append('name', formData.name);
      formDataObject.append('age', formData.age);
      formDataObject.append('email', formData.email);
      formDataObject.append('aadharNumber', formData.aadhar);
      formDataObject.append('photo', formData.photo);
      formDataObject.append('nativityCertificate', formData.nativityCertificate);

      const response = await axios.post('http://localhost:8080/api/nominator/nominate', formDataObject, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const nominatorId = response.data;

      // Navigate to payment page with the nomination ID
      navigate('/payment', { state: { nominatorId } });
    } catch (error) {
      setError('Failed to submit nomination. Please try again later.');
    }
  };

  const handleBack = () => {
    navigate(`/mlapage/${mlaId}`); // Pass the mlaId in the URL
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-r from-green-200 to-blue-200 p-6">
      <h1 className="text-4xl font-extrabold text-gray-800 mb-8">Nominate New Candidate</h1>

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl shadow-lg max-w-3xl mx-auto space-y-6">
        <div className="space-y-4">
          <div>
            <label className="block text-lg font-medium text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-lg font-medium text-gray-700">Age</label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-lg font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-lg font-medium text-gray-700">Aadhar Number</label>
            <input
              type="text"
              name="aadhar"
              value={formData.aadhar}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-lg font-medium text-gray-700">Upload Photo</label>
            <input
              type="file"
              name="photo"
              onChange={handleChange}
              className="mt-1 block w-full"
              required
            />
          </div>

          <div>
            <label className="block text-lg font-medium text-gray-700">Upload Nativity Certificate</label>
            <input
              type="file"
              name="nativityCertificate"
              onChange={handleChange}
              className="mt-1 block w-full"
              required
            />
          </div>
        </div>

        {error && <p className="text-red-500 text-center">{error}</p>}

        <div className="text-center space-x-4">
          <button type="button" onClick={handleBack} className="px-8 py-3 bg-gray-500 text-white text-lg rounded-full shadow-lg hover:bg-gray-600 transition-transform transform hover:scale-105 duration-300">
            Back
          </button>
          <button type="submit" className="px-8 py-3 bg-blue-500 text-white text-lg rounded-full shadow-lg hover:bg-blue-600 transition-transform transform hover:scale-105 duration-300">
            Next
          </button>
        </div>
      </form>
    </div>
  );
};

export default NominateForm;
