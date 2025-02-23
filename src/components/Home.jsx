import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaCommentDots, FaWarehouse, FaClipboardList, FaChartLine, FaTachometerAlt } from 'react-icons/fa';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';

const Home = () => {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();

  // Redirect to '/' if not authenticated and tries to access Dashboard
  React.useEffect(() => {
    if (!user && window.location.pathname === '/dashboard') {
      navigate('/');
    }
  }, [user, navigate]);

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-purple-200 via-pink-100 to-blue-200">
      <div className="p-8 bg-white rounded-2xl shadow-2xl text-center">
        <h1 className="text-4xl font-bold mb-6 text-gray-800">OfficeHub</h1>

        {/* Feature Icons */}
        <div className="flex justify-center space-x-8 mb-6">
          <div className="flex flex-col items-center">
            <FaWarehouse className="text-5xl text-blue-500 mb-2" />
            <p className="text-gray-700">Inventory Management</p>
          </div>
          <div className="flex flex-col items-center">
            <FaClipboardList className="text-5xl text-green-500 mb-2" />
            <p className="text-gray-700">Task Management</p>
          </div>
          <div className="flex flex-col items-center">
            <FaChartLine className="text-5xl text-purple-500 mb-2" />
            <p className="text-gray-700">Analytics Dashboard</p>
          </div>
        </div>

        <p className="text-gray-600 mb-4">
          Welcome to OfficeHub, your one-stop solution for managing office inventory and tasks seamlessly.
        </p>
        <p className="text-gray-600 mb-8">
          With AI assistance, streamline your workflows, track inventory, and stay ahead of your office needs effortlessly.
        </p>
        <div className="flex space-x-4 justify-center">
          <Link
            to="/chat"
            className="flex items-center justify-center px-6 py-3 bg-purple-500 text-white rounded-lg shadow-md hover:bg-purple-600 transition duration-300"
          >
            <FaCommentDots className="mr-2" /> Chatbot
          </Link>

          {/* Dashboard Button (only visible if authenticated) */}
          {user && (
            <Link
              to="/dashboard"
              className="flex items-center justify-center px-6 py-3 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition duration-300"
            >
              <FaTachometerAlt className="mr-2" /> Dashboard
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
