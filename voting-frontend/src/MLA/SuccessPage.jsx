import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaEdit } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const S3_BASE_URL = "https://bommanapdi.s3.eu-north-1.amazonaws.com/";

const SuccessPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [nominator, setNominator] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const { nominatorId } = location.state || {};

  useEffect(() => {
    if (nominatorId) {
      const fetchNominator = async () => {
        try {
          const response = await axios.get(`http://localhost:8080/api/nominator/${nominatorId}`);
          setNominator(response.data);
          setFormData(response.data);
        } catch (error) {
          console.error('Failed to fetch nominator:', error);
        }
      };

      fetchNominator();
    }
  }, [nominatorId]);

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const validateFormData = () => {
    const { age, aadharNumber } = formData;
    if (age && parseInt(age, 10) <= 21) {
      toast.error('Age must be greater than 21.');
      return false;
    }
    if (aadharNumber && aadharNumber.length !== 12) {
      toast.error('Aadhar Number must be 12 digits.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateFormData()) {
      return;
    }

    const updatedData = new FormData();
    updatedData.append("name", formData.name);
    updatedData.append("email", formData.email);
    updatedData.append("age", formData.age);
    updatedData.append("aadharNumber", formData.aadharNumber);

    if (formData.photo) {
      updatedData.append("photo", formData.photo);
    }

    try {
      await axios.put(`http://localhost:8080/api/nominator/${nominatorId}`, updatedData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      toast.success('Nominator details updated successfully');
      setNominator(prev => ({ ...prev, ...formData }));
      setEditMode(false);
    } catch (error) {
      toast.error('Failed to update nominator details.');
      console.error('Failed to update nominator details:', error);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setFormData(prevState => ({
        ...prevState,
        photo: e.target.files[0],
      }));
    }
  };

  const handleCancel = () => {
    setEditMode(false);
    setFormData(nominator); // Revert changes
  };

  if (!nominator) {
    return <div className="flex justify-center items-center h-screen text-lg">Loading...</div>;
  }

  const photoUrl = `${S3_BASE_URL}${nominator.photoImagePath}`;

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-r from-green-200 to-blue-200 p-6">
      <h1 className="text-4xl font-extrabold text-gray-800 mb-8">Nominator Details</h1>

      <div className="bg-white p-6 rounded-lg shadow-lg max-w-4xl w-full mx-auto flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-6">
        <div className="relative w-64 h-64">
          <img
            src={photoUrl}
            alt={`${nominator.name}'s photo`}
            className="w-full h-full object-cover rounded-full border-4 border-gray-300"
          />
          {editMode && (
            <label className="absolute bottom-0 right-0 bg-blue-500 p-2 rounded-full text-white cursor-pointer hover:bg-blue-600 transition-transform transform hover:scale-105 duration-300">
              <input
                type="file"
                name="photo"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <FaEdit size={22} />
            </label>
          )}
        </div>

        {editMode ? (
          <form onSubmit={handleSubmit} className="w-full space-y-4">
            <div className="flex flex-col space-y-4">
              {["name", "email", "age", "aadharNumber"].map(field => (
                <div key={field} className="flex flex-col">
                  <label className="block text-lg font-semibold mb-2 capitalize">{field}:</label>
                  <input
                    type={field === "email" ? "email" : "text"}
                    name={field}
                    value={formData[field] || ''}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                  />
                </div>
              ))}
            </div>

            <div className="flex justify-between mt-6">
              <button
                type="submit"
                className="px-6 py-3 bg-green-500 text-white text-lg rounded-full shadow-lg hover:bg-green-600 transition-transform transform hover:scale-105 duration-300"
              >
                Save Changes
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-3 bg-gray-500 text-white text-lg rounded-full shadow-lg hover:bg-gray-600 transition-transform transform hover:scale-105 duration-300"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="w-full space-y-4">
            <p className="text-xl font-semibold">Name: <span className="font-normal">{nominator.name}</span></p>
            <p className="text-xl font-semibold">Email: <span className="font-normal">{nominator.email}</span></p>
            <p className="text-xl font-semibold">Age: <span className="font-normal">{nominator.age}</span></p>
            <p className="text-xl font-semibold">Aadhar Number: <span className="font-normal">{nominator.aadharNumber}</span></p>
            <button
              onClick={handleEdit}
              className="px-6 py-3 bg-blue-500 text-white text-lg rounded-full shadow-lg hover:bg-blue-600 transition-transform transform hover:scale-105 duration-300 mt-4"
            >
              Edit
            </button>
          </div>
        )}
      </div>

      {/* ToastContainer for Toastify notifications */}
      <ToastContainer />
    </div>
  );
};

export default SuccessPage;
