import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const NominateForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    email: '',
    aadhar: '',
    photo: null,
    nativityCertificate: null,
  });
  const [mlaDetails, setMlaDetails] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const mlaId = location.state?.mlaId;

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/auth/check', { withCredentials: true });
        if (response.status !== 200) {
          navigate('/signin');
        }
      } catch (err) {
        console.error('Authentication check failed:', err);
        navigate('/error');
      }
    };

    const fetchMlaDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/mla/details/${mlaId}`, { withCredentials: true });
        if (response.data) {
          setMlaDetails(response.data);
          setFormData(prevState => ({
            ...prevState,
            name: response.data.name || '',
            email: response.data.email || '',
          }));
        } else {
          setError('No MLA details found.');
        }
      } catch (err) {
        setError('Failed to fetch MLA details');
        console.error('Error fetching MLA details:', err);
      }
    };

    checkAuthentication();
    if (mlaId) fetchMlaDetails();
  }, [mlaId, navigate]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!formData.name || !formData.age || !formData.email || !formData.aadhar || !formData.photo || !formData.nativityCertificate) {
      toast.error('Please fill all fields and upload all required documents.');
      setLoading(false);
      return;
    }

    if (!/^\d{12}$/.test(formData.aadhar)) {
      toast.error('Aadhar Number must be a 12-digit number.');
      setLoading(false);
      return;
    }

    if (parseInt(formData.age, 10) <= 21) {
      toast.error('Age must be greater than 21.');
      setLoading(false);
      return;
    }

    try {
      // Check for email and Aadhar uniqueness before submitting
      const emailCheck = await axios.get(`http://localhost:8080/api/nominator/check-email?email=${formData.email}`, { withCredentials: true });
      const aadharCheck = await axios.get(`http://localhost:8080/api/nominator/check-aadhar?aadhar=${formData.aadhar}`, { withCredentials: true });

      if (emailCheck.data.exists) {
        toast.error('This email is already in use. Please use a different email.');
        setLoading(false);
        return;
      }

      if (aadharCheck.data.exists) {
        toast.error('This Aadhar number is already in use. Please use a different Aadhar number.');
        setLoading(false);
        return;
      }

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
      navigate('/payment', { state: { nominatorId } });
    } catch (error) {
      console.error('Nomination submission error:', error);
      toast.error('Failed to submit nomination. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate(`/mlapage/${mlaId}`);
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-r from-green-200 to-blue-200 p-6">
      <ToastContainer />
      <h1 className="text-4xl font-extrabold text-gray-800 mb-8">Nominate New Candidate</h1>

      {loading ? (
        <div className="flex flex-col items-center justify-center h-full">
          <p className="text-xl font-semibold text-gray-700 mb-4">Submitting your nomination...This will redirect to Payment page!!</p>
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent border-solid rounded-full animate-spin"></div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl shadow-lg max-w-3xl mx-auto space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-lg font-medium text-gray-700">Name</label>
              <input
                type="text"
                name="name"
                placeholder='Enter your name'
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
                placeholder='Enter your age'
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
                placeholder='Enter your email'
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
                placeholder='Enter your Aadhar Number'
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
      )}
    </div>
  );
};

export default NominateForm;
