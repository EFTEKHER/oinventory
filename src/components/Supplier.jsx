import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { toast, ToastContainer } from 'react-toastify';
import { FaEdit, FaTrash, FaPlus, FaTimes } from 'react-icons/fa';
import 'react-toastify/dist/ReactToastify.css';

function Supplier() {
  const [user] = useAuthState(auth);
  const [supplierData, setSupplierData] = useState([]);
  const [formData, setFormData] = useState({
    id: '',
    supplierName: '',
    supplierAddress: '',
    govtTID: '',
    taxID: '',
    startDate: '',
    endDate: '',
    status: '',
    supplierID: ''
  });

  useEffect(() => {
    const q = collection(db, 'suppliers');
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const suppliers = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setSupplierData(suppliers);
    });
    return () => unsubscribe();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddOrUpdate = async (e) => {
    e.preventDefault();
    try {
      if (formData.id) {
        // Update existing supplier
        const supplierRef = doc(db, 'suppliers', formData.id);
        await updateDoc(supplierRef, {
          supplierName: formData.supplierName,
          supplierAddress: formData.supplierAddress,
          govtTID: formData.govtTID,
          taxID: formData.taxID,
          startDate: formData.startDate,
          endDate: formData.endDate,
          status: formData.status,
          supplierID: formData.supplierID
        });
        toast.success(`Supplier "${formData.supplierName}" updated by ${user.email}`);
      } else {
        // Add new supplier
        await addDoc(collection(db, 'suppliers'), {
          supplierName: formData.supplierName,
          supplierAddress: formData.supplierAddress,
          govtTID: formData.govtTID,
          taxID: formData.taxID,
          startDate: formData.startDate,
          endDate: formData.endDate,
          status: formData.status,
          supplierID: formData.supplierID
        });
        toast.success(`New supplier "${formData.supplierName}" added by ${user.email}`);
      }
      resetForm();
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  const handleEdit = (supplier) => {
    setFormData(supplier);
  };

  const handleDelete = async (id, supplierName) => {
    try {
      const supplierRef = doc(db, 'suppliers', id);
      await deleteDoc(supplierRef);
      toast.success(`Supplier "${supplierName}" deleted by ${user.email}`);
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  const resetForm = () => {
    setFormData({
      id: '',
      supplierName: '',
      supplierAddress: '',
      govtTID: '',
      taxID: '',
      startDate: '',
      endDate: '',
      status: '',
      supplierID: ''
    });
  };

  return (
    <div className="p-4 min-h-screen bg-gradient-to-r from-blue-50 to-purple-50 animate-fadeIn">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Supplier List
        </h2>
        <form
          onSubmit={handleAddOrUpdate}
          className="mb-6 bg-white p-6 rounded-lg shadow-lg animate-fadeIn"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="supplierName"
              value={formData.supplierName}
              onChange={handleInputChange}
              placeholder="Supplier Name"
              required
              className="border p-2 rounded focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              name="supplierAddress"
              value={formData.supplierAddress}
              onChange={handleInputChange}
              placeholder="Supplier Address"
              required
              className="border p-2 rounded focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              name="govtTID"
              value={formData.govtTID}
              onChange={handleInputChange}
              placeholder="Govt TID"
              required
              className="border p-2 rounded focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              name="taxID"
              value={formData.taxID}
              onChange={handleInputChange}
              placeholder="Tax ID"
              required
              className="border p-2 rounded focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleInputChange}
              placeholder="Start Date"
              className="border p-2 rounded focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleInputChange}
              placeholder="End Date"
              className="border p-2 rounded focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              placeholder="Status"
              required
              className="border p-2 rounded focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              name="supplierID"
              value={formData.supplierID}
              onChange={handleInputChange}
              placeholder="Supplier ID"
              required
              className="border p-2 rounded focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mt-4 flex items-center">
            <button
              type="submit"
              className="bg-blue-500 text-white p-2 rounded flex items-center hover:bg-blue-600 transition-all duration-300"
            >
              {formData.id ? <FaEdit className="mr-2" /> : <FaPlus className="mr-2" />}
              {formData.id ? 'Update Supplier' : 'Add Supplier'}
            </button>
            {formData.id && (
              <button
                type="button"
                onClick={resetForm}
                className="ml-4 bg-gray-500 text-white p-2 rounded flex items-center hover:bg-gray-600 transition-all duration-300"
              >
                <FaTimes className="mr-2" /> Cancel
              </button>
            )}
          </div>
        </form>

        <div className="space-y-4">
          {supplierData.length > 0 ? (
            supplierData.map((supplier) => (
              <div
                key={supplier.id}
                className="bg-white p-4 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 animate-fadeIn"
              >
                <p>
                  <strong>Supplier Name:</strong> {supplier.supplierName}
                </p>
                <p>
                  <strong>Supplier Address:</strong> {supplier.supplierAddress}
                </p>
                <p>
                  <strong>Govt TID:</strong> {supplier.govtTID}
                </p>
                <p>
                  <strong>TAX ID:</strong> {supplier.taxID}
                </p>
                <p>
                  <strong>Start Date:</strong> {supplier.startDate || 'N/A'}
                </p>
                <p>
                  <strong>End Date:</strong> {supplier.endDate || 'N/A'}
                </p>
                <p>
                  <strong>Status:</strong> {supplier.status}
                </p>
                <p>
                  <strong>Supplier ID:</strong> {supplier.supplierID}
                </p>
                <div className="mt-2 flex flex-col sm:flex-row sm:space-x-4">
                  <button
                    onClick={() => handleEdit(supplier)}
                    className="bg-yellow-500 text-white p-2 rounded flex items-center hover:bg-yellow-600 transition-all duration-300"
                  >
                    <FaEdit className="mr-2" /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(supplier.id, supplier.supplierName)}
                    className="bg-red-500 text-white p-2 rounded flex items-center hover:bg-red-600 transition-all duration-300"
                  >
                    <FaTrash className="mr-2" /> Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">No suppliers found.</p>
          )}
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

export default Supplier;
