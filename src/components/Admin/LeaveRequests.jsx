import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import {
  collection,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
} from 'firebase/firestore';
import { createNotification } from '../../utils/notificationUtils';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaCheckCircle, FaTimesCircle, FaTrash } from 'react-icons/fa';

function LeaveRequests() {
  const [requests, setRequests] = useState([]);
  const requestsRef = collection(db, 'leaveRequests');

  useEffect(() => {
    const unsubscribe = onSnapshot(requestsRef, (snapshot) => {
      const reqs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setRequests(reqs);
    });
    return () => unsubscribe();
  }, []);

  const handleUpdateStatus = async (id, status) => {
    try {
      const docRef = doc(db, 'leaveRequests', id);
      await updateDoc(docRef, {
        status,
        approvedBy: 'Admin',
        approvedDate: new Date().toISOString().split('T')[0],
      });

      // Notify employee about the approval/decline
      const request = requests.find((r) => r.id === id);
      const message = `${request.employeeEmail}, your leave request has been ${status} by Admin.`;
      await createNotification(message, request.employeeEmail);

      toast.success(`Leave request ${status}!`, {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (error) {
      console.error(error);
      toast.error(error.message, {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, 'leaveRequests', id));
      toast.success('Leave request deleted!', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (error) {
      console.error(error);
      toast.error(error.message, {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  return (
    <div className="min-h-screen p-8 bg-gradient-to-r from-blue-50 to-purple-50 animate-gradient-x">
      <ToastContainer />
      <h2 className="text-3xl font-bold mb-8 text-gray-800 text-center">Leave Requests</h2>
      <div className="overflow-x-auto rounded-lg shadow-2xl">
        <table className="min-w-full bg-white rounded-lg overflow-hidden">
          <thead className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
            <tr>
              <th className="py-4 px-6 text-left">Employee Email</th>
              <th className="py-4 px-6 text-left">Request Details</th>
              <th className="py-4 px-6 text-left">Apply Date</th>
              <th className="py-4 px-6 text-left">Status</th>
              <th className="py-4 px-6 text-left">Approved By</th>
              <th className="py-4 px-6 text-left">Approved Date</th>
              <th className="py-4 px-6 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((req) => (
              <tr
                key={req.id}
                className="hover:bg-gray-50 transition-colors duration-200 border-b border-gray-200"
              >
                <td className="py-4 px-6">{req.employeeEmail}</td>
                <td className="py-4 px-6">{req.reason}</td>
                <td className="py-4 px-6">{req.applyDate}</td>
                <td className="py-4 px-6">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      req.status === 'approved'
                        ? 'bg-green-100 text-green-700'
                        : req.status === 'declined'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}
                  >
                    {req.status}
                  </span>
                </td>
                <td className="py-4 px-6">{req.approvedBy || '-'}</td>
                <td className="py-4 px-6">{req.approvedDate || '-'}</td>
                <td className="py-4 px-6 space-x-2">
                  {req.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleUpdateStatus(req.id, 'approved')}
                        className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors duration-200 flex items-center"
                      >
                        <FaCheckCircle className="mr-2" /> Approve
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(req.id, 'declined')}
                        className="bg-red-500 text-white px-5 py-2 rounded-md hover:bg-red-600 transition-colors duration-200 flex items-center"
                      >
                        <FaTimesCircle className="mr-2" /> Decline
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => handleDelete(req.id)}
                    className="bg-gray-500 text-white px-5 py-2 rounded-md hover:bg-gray-600 transition-colors duration-200 flex items-center"
                  >
                    <FaTrash className="mr-2" /> Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default LeaveRequests;