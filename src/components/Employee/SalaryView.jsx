// components/Employee/SalaryView.jsx
import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../firebase';
import { 
  FaDollarSign, 
  FaUser, 
  FaEnvelope, 
  FaBriefcase, 
  FaCalendarAlt, 
  FaCheckCircle 
} from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function SalaryView() {
  const [user] = useAuthState(auth);
  const [salaryData, setSalaryData] = useState(null);

  useEffect(() => {
    if (user) {
      const q = query(
        collection(db, 'salaries'),
        where('employeeEmail', '==', user.email)
      );
      const unsubscribe = onSnapshot(q, (snapshot) => {
        if (!snapshot.empty) {
          setSalaryData(snapshot.docs[0].data());
          toast.success('Salary data loaded successfully!', {
            containerId: 'A',
            position: 'top-right',
            autoClose: true, // Disable auto-close for manual dismissal
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            closeButton: true,
            toastId: 'salarySuccessToast', // Unique toast id
          });
        } else {
          toast.info('No salary data found.', {
            containerId: 'A',
            position: 'top-right',
            autoClose: true, // Disable auto-close for manual dismissal
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            toastId: 'salaryInfoToast', // Unique toast id
          });
        }
      });
      return () => unsubscribe();
    }
  }, [user]);

  // Helper function to get month name
  const getMonthName = (month) => {
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return monthNames[month - 1] || 'N/A'; // month is 1-based
  };

  // Function to dismiss any active toast notifications
  const handleDismissToast = () => {
    toast.dismiss('salarySuccessToast');
    toast.dismiss('salaryInfoToast');
  };

  return (
    <div className="min-h-screen p-4 bg-gradient-to-r from-blue-50 to-purple-50">
      <ToastContainer containerId="A" />
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">My Salary Details</h2>
      {/* Dismiss Notification Button */}
      <div className="flex justify-center mb-4">
        <button
          onClick={handleDismissToast}
          className="bg-[white] hover:bg-[white] transition-all duration-300 text-white px-4 py-2 rounded"
        >
          
        </button>
      </div>
      {salaryData ? (
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-2xl p-6 transform transition-all duration-500 hover:scale-105">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <FaEnvelope className="text-blue-500" />
              <p><strong>Email:</strong> {salaryData.employeeEmail}</p>
            </div>
            <div className="flex items-center space-x-2">
              <FaUser className="text-green-500" />
              <p><strong>Name:</strong> {salaryData.employeeName}</p>
            </div>
            <div className="flex items-center space-x-2">
              <FaBriefcase className="text-purple-500" />
              <p><strong>Role:</strong> {salaryData.role}</p>
            </div>
            <div className="flex items-center space-x-2">
              <FaDollarSign className="text-yellow-500" />
              <p><strong>Salary:</strong> ${salaryData.salary}</p>
            </div>
            {salaryData.bonus1 && (
              <div className="flex items-center space-x-2">
                <FaDollarSign className="text-green-500" />
                <p><strong>Bonus 1:</strong> ${salaryData.bonus1}</p>
              </div>
            )}
            {salaryData.bonus2 && (
              <div className="flex items-center space-x-2">
                <FaDollarSign className="text-green-500" />
                <p><strong>Bonus 2:</strong> ${salaryData.bonus2}</p>
              </div>
            )}
            {salaryData.bonus3 && (
              <div className="flex items-center space-x-2">
                <FaDollarSign className="text-green-500" />
                <p><strong>Bonus 3:</strong> ${salaryData.bonus3}</p>
              </div>
            )}
            {salaryData.extraFacility && (
              <div className="flex items-center space-x-2">
                <FaCheckCircle className="text-blue-500" />
                <p><strong>Extra Facility:</strong> {salaryData.extraFacility}</p>
              </div>
            )}
            <div className="flex items-center space-x-2">
              <FaCheckCircle className="text-purple-500" />
              <p><strong>Status:</strong> {salaryData.status}</p>
            </div>
            <div className="flex items-center space-x-2">
              <FaCalendarAlt className="text-red-500" />
              <p>
                <strong>Paid Month:</strong> {salaryData.paidMonth ? getMonthName(salaryData.paidMonth) : 'N/A'}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <FaCalendarAlt className="text-red-500" />
              <p><strong>Paid Year:</strong> {salaryData.paidYear || 'N/A'}</p>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-center text-gray-600">No salary data found.</p>
      )}
    </div>
  );
}

export default SalaryView;
