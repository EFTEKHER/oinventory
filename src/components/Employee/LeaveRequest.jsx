import React, { useState, useEffect } from 'react';
import { db, auth } from '../../firebase';
import { addDoc, collection, query, where, onSnapshot } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { createNotification } from '../../utils/notificationUtils';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaPaperPlane, FaClock, FaCheck, FaTimes, FaCalendarAlt, FaInfoCircle } from 'react-icons/fa';

function LeaveRequest() {
  const [user] = useAuthState(auth);
  const [reason, setReason] = useState('');
  const [leaveRequests, setLeaveRequests] = useState([]);

  useEffect(() => {
    if (user) {
      const q = query(
        collection(db, 'leaveRequests'),
        where('employeeEmail', '==', user.email)
      );
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const requests = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }));
        setLeaveRequests(requests);
      });
      return () => unsubscribe();
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'leaveRequests'), {
        employeeEmail: user.email,
        reason,
        status: 'pending',
        applyDate: new Date().toISOString().split('T')[0],
        approvedDate: null,
        approvedBy: null
      });
      await createNotification(`${user.email} submitted a leave request`);
      setReason('');
      toast.success('Leave request submitted successfully!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } catch (error) {
      console.error(error);
      toast.error(`Error submitting request: ${error.message}`, {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  const StatusIcon = ({ status }) => {
    switch (status) {
      case 'approved':
        return <FaCheck className="text-green-600 mr-2" />;
      case 'declined':
        return <FaTimes className="text-red-600 mr-2" />;
      default:
        return <FaClock className="text-yellow-600 mr-2" />;
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8 bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="max-w-6xl mx-auto">
        <ToastContainer />
        
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8 flex items-center">
          <FaCalendarAlt className="mr-3 text-blue-600" />
          Leave Management
        </h1>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Request Form */}
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">
              <FaPaperPlane className="inline mr-2 text-blue-500" />
              New Leave Request
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <textarea
                placeholder="Enter reason for leave..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                rows="4"
                required
              />
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-101"
              >
                Submit Request
              </button>
            </form>
          </div>

          {/* Leave Requests List */}
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">
              <FaInfoCircle className="inline mr-2 text-purple-500" />
              My Leave History
            </h2>
            
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    {['Date', 'Reason', 'Status', 'Approved By', 'Approved Date'].map((header) => (
                      <th key={header} className="px-4 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {leaveRequests.map((request) => (
                    <tr key={request.id} className="hover:bg-gray-50 transition-colors duration-150">
                      <td className="px-4 py-3 text-sm text-gray-600">{request.applyDate}</td>
                      <td className="px-4 py-3 text-sm text-gray-800 max-w-xs truncate">{request.reason}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center">
                          <StatusIcon status={request.status} />
                          <span className={`font-medium ${request.status === 'approved' ? 'text-green-600' : request.status === 'declined' ? 'text-red-600' : 'text-yellow-600'}`}>
                            {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">{request.approvedBy || 'N/A'}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{request.approvedDate || 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-4">
              {leaveRequests.map((request) => (
                <div key={request.id} className="bg-gray-50 p-4 rounded-lg transition-all duration-200 hover:bg-white hover:shadow-md">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-sm font-medium text-gray-700">{request.applyDate}</span>
                    <div className="flex items-center">
                      <StatusIcon status={request.status} />
                      <span className={`text-xs font-medium ${request.status === 'approved' ? 'text-green-600' : request.status === 'declined' ? 'text-red-600' : 'text-yellow-600'}`}>
                        {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-2 truncate">{request.reason}</p>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Approved by: {request.approvedBy || 'N/A'}</span>
                    <span>{request.approvedDate || ''}</span>
                  </div>
                </div>
              ))}
            </div>

            {leaveRequests.length === 0 && (
              <div className="text-center py-6 text-gray-500">
                No leave requests found
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default LeaveRequest;