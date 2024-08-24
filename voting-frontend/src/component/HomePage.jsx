import React ,{useState} from 'react';
import { Link } from 'react-router-dom';

function HomePage() {
  // Example rules array with details
  const rules = [
    { title: "Rule 1", details: "This is the detailed description of Rule 1." },
    { title: "Rule 2", details: "This is the detailed description of Rule 2." },
    { title: "Rule 3", details: "This is the detailed description of Rule 3." },
    { title: "Rule 4", details: "This is the detailed description of Rule 4." },
    { title: "Rule 5", details: "This is the detailed description of Rule 5." },
    { title: "Rule 6", details: "This is the detailed description of Rule 6." },
    { title: "Rule 7", details: "This is the detailed description of Rule 7." },
  ];

  // State to manage the popup visibility and content
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentRule, setCurrentRule] = useState(null);

  // Function to open the popup with the selected rule's details
  const openModal = (rule) => {
    setCurrentRule(rule);
    setIsModalOpen(true);
  };

  // Function to close the popup
  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentRule(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      {/* Application Name */}
      <h1 className="text-4xl font-bold text-gray-800 mb-4">
        Real-Time Voting Application
      </h1>

      {/* Tagline or Brief Description */}
      <p className="text-lg text-gray-600 mb-8">
        Participate in polls and see live results instantly!
      </p>

      {/* Call to Action Buttons */}
      <div className="flex space-x-4">
        {/* Link to Sign In Page */}
        <Link
          to="/signin"
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Sign In
        </Link>
        {/* Link to Sign Up Page */}
        <Link
          to="/signup"
          className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
        >
          Sign Up
        </Link>
      </div>

      {/* Featured Polls Section */}
      <div className="mt-10 w-full max-w-4xl">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          Featured Polls
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Example Poll 1 */}
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-2xl transition">
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              Which is your favorite programming language?
            </h3>
            <p className="text-gray-600">
              Vote now and see what others think in real-time!
            </p>
            <Link
              to="/polls/1"
              className="block mt-4 text-blue-500 hover:underline"
            >
              View Poll
            </Link>
          </div>
          {/* Example Poll 2 */}
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-2xl transition">
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              What's the best front-end framework?
            </h3>
            <p className="text-gray-600">
              Cast your vote and find out the winner instantly!
            </p>
            <Link
              to="/polls/2"
              className="block mt-4 text-blue-500 hover:underline"
            >
              View Poll
            </Link>
          </div>
        </div>
      </div>
      <div className="w-full max-w-5xl m-20 px-6">
      <div className="no-scrollbar grid grid-cols-7 gap-5 h-24 overflow-y-auto pl-44 transition-all duration-200 ">
        {rules.map((rule, index) => (
          <div
            key={index}
            className="col-span-3 w-[50%] m-5 bg-my-image bg-cover rounded-lg shadow-md hover:shadow-2xl cursor-pointer"
            onClick={() => openModal(rule)}
          >
            <h2 className="font-bold text-lg p-5">{rule.title}</h2>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center hover: bg-lime-50  ">
          <div className=" bg-my-image-2 bg-contain bg-no-repeat t p-6 rounded-lg shadow-lg w-[80%] max-w-6xl transition-all duration-1000">
            <h2 className="text-xl font-bold mb-4">{currentRule?.title}</h2>
            <p className="text-gray-700">{currentRule?.details}</p>
            <button
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              onClick={closeModal}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  

  </div>
  );
}

export default HomePage;