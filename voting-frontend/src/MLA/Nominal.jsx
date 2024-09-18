import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../pages/Header';
import 'animate.css'; // Make sure you have animate.css installed

const Nominal = () => {
  const [error, setError] = useState('');
  const { mlaId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/auth/check', { withCredentials: true });
        if (response.status !== 200) {
          navigate('/signin'); // Redirect to login if not authenticated
        }
      } catch (err) {
        console.error('Authentication check failed:', err);
        navigate('/error'); // Redirect to error page if authentication check fails
      }
    };

    checkAuthentication();
  }, [navigate]);

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

        <section className="bg-white shadow-lg rounded-3xl p-8 md:p-12 w-full max-w-4xl mx-auto space-y-6 border border-gray-200 animate__animated animate__fadeIn animate__delay-1s animate__bounceIn">
          <h2 className="text-2xl md:text-3xl font-bold text-blue-800 border-b-2 border-blue-600 pb-2 mb-4">
            Application Form Fill-Up Guidelines
          </h2>
          <div className="space-y-4">
            <p className="text-lg"><strong>1. Register a New Nominee:</strong> Ensure all required details are filled in accurately.</p>
            <p className="text-lg"><strong>2. Upload Required Documents:</strong> Prepare and upload necessary documents as part of the application.</p>
            <p className="text-lg"><strong>3. Submit the Form:</strong> Once the form is completed and documents are uploaded, submit the form for review.</p>
            <p className="text-lg"><strong>4. Payment:</strong> A processing fee of 1000 INR is required. You will be redirected to the payment page after form submission.</p>
            <p className="text-lg"><strong>5. Confirmation:</strong> You will receive a confirmation email upon successful submission and payment.</p>
            <p className="text-lg"><strong>6. Contact Us:</strong> For any queries or assistance, please contact our support team.</p>
          </div>
        </section>

        <section className="bg-white shadow-lg rounded-3xl p-8 md:p-12 w-full max-w-4xl mx-auto space-y-6 border border-gray-200 animate__animated animate__fadeIn animate__delay-2s animate__slideInUp">
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
