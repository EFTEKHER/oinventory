// components/Office/Office.jsx
import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, onSnapshot, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';
import { toast, ToastContainer } from 'react-toastify';
import { FaEdit, FaTrash, FaPlus, FaTimes } from 'react-icons/fa';
import 'react-toastify/dist/ReactToastify.css';

function Office() {
  const [user] = useAuthState(auth);
  const [offices, setOffices] = useState([]);
  const [newOffice, setNewOffice] = useState({
    officeName: '',
    officeDescription: '',
    businessType: '',
    officeContact: '',
    officeEmail: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editOfficeId, setEditOfficeId] = useState(null);

  useEffect(() => {
    const q = query(collection(db, 'offices'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const officeData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setOffices(officeData);
    });
    return () => unsubscribe();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewOffice(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await updateDoc(doc(db, 'offices', editOfficeId), newOffice);
        toast.success("Office updated successfully!");
        setIsEditing(false);
        setEditOfficeId(null);
      } else {
        await addDoc(collection(db, 'offices'), newOffice);
        toast.success("Office added successfully!");
      }
      setNewOffice({
        officeName: '',
        officeDescription: '',
        businessType: '',
        officeContact: '',
        officeEmail: ''
      });
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  const handleEdit = (office) => {
    setNewOffice(office);
    setIsEditing(true);
    setEditOfficeId(office.id);
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, 'offices', id));
      toast.success("Office deleted successfully!");
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-purple-50 p-4">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800 animate-fade-in-down">
          Office Management
        </h2>

        {user && (
          <form onSubmit={handleSubmit} className="mb-6 bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {['officeName', 'officeDescription', 'businessType', 'officeContact', 'officeEmail'].map((field) => (
                <input
                  key={field}
                  type={field === 'officeEmail' ? 'email' : 'text'}
                  name={field}
                  value={newOffice[field]}
                  onChange={handleInputChange}
                  placeholder={
                    field.replace('office', '').replace(/([A-Z])/g, ' $1').trim() + 
                    (field === 'officeEmail' ? ' Address' : '')
                  }
                  required
                  className="input-field border-2 p-3 rounded-lg focus:outline-none focus:border-blue-500 transition-colors duration-300"
                />
              ))}
            </div>
            <div className="mt-4 flex flex-col sm:flex-row gap-2">
              <button
                type="submit"
                className="btn-primary bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 transform hover:scale-105"
              >
                {isEditing ? (
                  <>
                    <FaEdit className="text-lg" /> Update Office
                  </>
                ) : (
                  <>
                    <FaPlus className="text-lg" /> Add Office
                  </>
                )}
              </button>
              {isEditing && (
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setEditOfficeId(null);
                    setNewOffice({
                      officeName: '',
                      officeDescription: '',
                      businessType: '',
                      officeContact: '',
                      officeEmail: ''
                    });
                  }}
                  className="btn-secondary bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 transform hover:scale-105"
                >
                  <FaTimes className="text-lg" /> Cancel Edit
                </button>
              )}
            </div>
          </form>
        )}

        <div className="space-y-6">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Registered Offices</h3>
          {offices.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4">
              {offices.map((office) => (
                <div 
                  key={office.id}
                  className="bg-white p-5 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div className="space-y-2">
                    <h4 className="text-xl font-bold text-blue-600">{office.officeName}</h4>
                    <p className="text-gray-600">{office.officeDescription}</p>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="font-semibold">Business Type:</span>
                        <p className="text-gray-700">{office.businessType}</p>
                      </div>
                      <div>
                        <span className="font-semibold">Contact:</span>
                        <p className="text-gray-700">{office.officeContact}</p>
                      </div>
                      <div className="col-span-2">
                        <span className="font-semibold">Email:</span>
                        <p className="text-gray-700 break-all">{office.officeEmail}</p>
                      </div>
                    </div>
                  </div>
                  {user && user.email === "binary2ai@gmail.com" && (
                    <div className="mt-4 flex flex-col sm:flex-row gap-2">
                      <button
                        onClick={() => handleEdit(office)}
                        className="btn-edit bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 flex-1"
                      >
                        <FaEdit /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(office.id)}
                        className="btn-delete bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 flex-1"
                      >
                        <FaTrash /> Delete
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center p-8 bg-white rounded-xl shadow-md animate-pulse">
              <p className="text-gray-600 text-lg">No offices found. Start by adding a new office!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Office;