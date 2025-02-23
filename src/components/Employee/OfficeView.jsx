import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { collection, query, onSnapshot } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../firebase';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaBuilding, FaEnvelope, FaPhone, FaInfoCircle } from 'react-icons/fa';

function OfficeView() {
  const [user] = useAuthState(auth);
  const [offices, setOffices] = useState([]);

  useEffect(() => {
    const q = query(collection(db, 'offices'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const officeData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setOffices(officeData);
      toast.success('Offices loaded successfully!');
    }, (error) => {
      toast.error('Error loading offices: ' + error.message);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="p-4 min-h-screen bg-gradient-to-r from-blue-50 to-purple-50">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Office Details</h2>
      {offices.length > 0 ? (
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {offices.map(office => (
            <li key={office.id} className="border border-gray-200 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white">
              <div className="flex items-center mb-4">
                <FaBuilding className="text-blue-500 mr-2" />
                <h4 className="font-bold text-xl text-gray-700">{office.officeName}</h4>
              </div>
              <div className="flex items-center mb-2">
                <FaInfoCircle className="text-purple-500 mr-2" />
                <p className="text-gray-600">{office.officeDescription}</p>
              </div>
              <div className="flex items-center mb-2">
                <FaBuilding className="text-green-500 mr-2" />
                <p className="text-gray-600"><strong>Business Type:</strong> {office.businessType}</p>
              </div>
              <div className="flex items-center mb-2">
                <FaPhone className="text-red-500 mr-2" />
                <p className="text-gray-600"><strong>Contact:</strong> {office.officeContact}</p>
              </div>
              <div className="flex items-center">
                <FaEnvelope className="text-yellow-500 mr-2" />
                <p className="text-gray-600"><strong>Email:</strong> {office.officeEmail}</p>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center text-gray-600">No offices available.</p>
      )}
      <ToastContainer position="bottom-right" autoClose={3000} />
    </div>
  );
}

export default OfficeView;