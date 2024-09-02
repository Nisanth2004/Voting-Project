import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../pages/Header';

const Nominal = () => {
  const [mlaDetails, setMlaDetails] = useState(null);
  const [error, setError] = useState('');
  const { mlaId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMlaDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/mla/details/${mlaId}`, { withCredentials: true });
        if (response.data) {
          setMlaDetails(response.data);
        } else {
          setError('No MLA details found.');
        }
      } catch (err) {
        setError('Failed to fetch details');
        console.error('Error fetching details:', err);
        // Handle unauthorized access
        if (err.response && err.response.status === 401) {
          navigate('/signin'); // Redirect to login if unauthorized
        }
      }
    };

    checkAuthentication();
    fetchMlaDetails();

  }, [mlaId, navigate]);

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
  const handleLogout = async () => {
    try {
      const response = await axios.post('http://localhost:8080/api/auth/logout', null, { withCredentials: true });
  
      if (response.status === 200) {
        console.log("Logged out successfully");
        // Redirect to sign-in page after logout
        navigate('/signin'); 
      } else {
        console.log("Logout failed");
        console.error("Logout error:", response.statusText);
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };
  

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-r from-teal-200 via-green-200 to-blue-200 p-6">
      
      <header className="w-full bg-blue-600 p-4 text-white text-center flex justify-between items-center animate__animated animate__fadeIn">
        <h1 className="text-4xl md:text-5xl font-extrabold">Dashboard</h1>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-transform transform hover:scale-105 duration-300"
        >
          Logout
        </button>
      </header>

      <main className="w-full max-w-5xl mx-auto my-8 flex flex-col items-center space-y-8">
        {error && <p className="text-red-500 text-center mb-4 animate__animated animate__fadeIn">{error}</p>}

        {mlaDetails && (
          <section className="bg-white shadow-lg rounded-3xl p-8 md:p-12 w-full max-w-4xl mx-auto space-y-6 border border-gray-200 animate__animated animate__fadeIn">
            <h2 className="text-2xl md:text-3xl font-bold text-blue-800 border-b-2 border-blue-600 pb-2 mb-4">
              MLA Details
            </h2>
            <div className="flex flex-col space-y-4">
              <p className="text-lg"><strong className="text-blue-600">Name:</strong> {mlaDetails.name || 'N/A'}</p>
              <p className="text-lg"><strong className="text-blue-600">Email:</strong> {mlaDetails.email || 'N/A'}</p>
            </div>
          </section>
        )}

        <section className="bg-white shadow-lg rounded-3xl p-8 md:p-12 w-full max-w-4xl mx-auto space-y-6 border border-gray-200 animate__animated animate__fadeIn">
          <h2 className="text-2xl md:text-3xl font-bold text-blue-800 border-b-2 border-blue-600 pb-2 mb-4">
            Election Rules for Panchayat Election
          </h2>
          <ul className="list-disc pl-5 space-y-4">
            <li><strong className="text-blue-600">Do:</strong> Ensure that all campaign materials are approved by the election commission.</li>
            <li><strong className="text-blue-600">Do:</strong> Follow all guidelines for public meetings and rallies.</li>
            <li><strong className="text-blue-600">Don't:</strong> Engage in any form of bribery or inducement.</li>
            <li><strong className="text-blue-600">Don't:</strong> Use abusive language or spread false information about opponents.</li>
          </ul>
        </section>

        <section className="bg-white shadow-lg rounded-3xl p-8 md:p-12 w-full max-w-4xl mx-auto space-y-6 border border-gray-200 animate__animated animate__fadeIn">
          <h2 className="text-2xl md:text-3xl font-bold text-blue-800 border-b-2 border-blue-600 pb-2 mb-4">
            Important Resources
          </h2>
          <ul className="list-disc pl-5 space-y-4">
            <li><a href="https://eci.gov.in/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Election Commission of India</a></li>
            <li><a href="https://www.mygov.in/citizen-services/elections/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">MyGov - Election Services</a></li>
            <li><a href="https://eci.gov.in/eci_main1/Forms/Disclosures/ModelCode.pdf" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Model Code of Conduct</a></li>
            <li><a href="https://eci.gov.in/eci_main1/Forms/Disclosures/ElectionGuidelines.pdf" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Election Guidelines</a></li>
          </ul>
        </section>

        <div className="text-center mt-12 animate__animated animate__fadeIn">
          <button
            onClick={() => navigate('/nominate', { state: { mlaId } })}
            className="px-6 py-3 bg-blue-500 text-white text-lg rounded-full shadow-lg hover:bg-blue-600 transition-transform transform hover:scale-105 duration-300"
          >
            Nominate New Candidate
          </button>
        </div>
      </main>
    </div>
  );
};

export default Nominal;
