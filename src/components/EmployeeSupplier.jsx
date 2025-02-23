import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import { 
  FaClipboardList, FaBuilding, FaMapMarkerAlt, FaIdCard, 
  FaRegIdBadge, FaCalendarDay, FaInfoCircle, FaRegMeh 
} from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function EmployeeSupplier() {
  const [supplierData, setSupplierData] = useState([]);

  useEffect(() => {
    const q = collection(db, 'suppliers');
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const suppliers = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setSupplierData(suppliers);
    }, (error) => {
      console.error("Error fetching suppliers: ", error);
      toast.error("Failed to load supplier data.");
    });
    return () => unsubscribe();
  }, []);

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-4 min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-blue-50">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-center text-gray-800 flex items-center justify-center space-x-3">
          <FaClipboardList className="text-emerald-600 animate-pulse mr-3" />
          <span className="bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
            Supplier Directory
          </span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {supplierData.length > 0 ? (
            supplierData.map((supplier, index) => (
              <div
                key={supplier.id}
                className="bg-white group p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 ease-out hover:-translate-y-1 border-l-4 border-emerald-500 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-100/30 rotate-45 translate-x-8 -translate-y-8" />
                
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <FaBuilding className="w-6 h-6 text-emerald-600 flex-shrink-0" />
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">{supplier.supplierName}</h3>
                      <p className="text-sm text-gray-500">{supplier.supplierID}</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <FaMapMarkerAlt className="w-5 h-5 text-blue-500 flex-shrink-0 mt-1" />
                      <p className="text-gray-600">{supplier.supplierAddress}</p>
                    </div>

                    <div className="flex items-center space-x-3">
                      <FaIdCard className="w-5 h-5 text-purple-500 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-gray-500">Govt TID</p>
                        <p className="text-gray-700 font-medium">{supplier.govtTID}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <FaRegIdBadge className="w-5 h-5 text-orange-500 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-gray-500">Tax ID</p>
                        <p className="text-gray-700 font-medium">{supplier.taxID}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center space-x-2">
                        <FaCalendarDay className="w-5 h-5 text-cyan-500 flex-shrink-0" />
                        <div>
                          <p className="text-sm text-gray-500">Start Date</p>
                          <p className="text-gray-700 text-sm">{supplier.startDate || 'N/A'}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <FaCalendarDay className="w-5 h-5 text-rose-500 flex-shrink-0" />
                        <div>
                          <p className="text-sm text-gray-500">End Date</p>
                          <p className="text-gray-700 text-sm">{supplier.endDate || 'N/A'}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <FaInfoCircle className="w-5 h-5 text-indigo-500 flex-shrink-0" />
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-500">Status:</span>
                        <span className={`${getStatusColor(supplier.status)} px-3 py-1 rounded-full text-sm font-medium`}>
                          {supplier.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12 space-y-4">
              <FaRegMeh className="text-5xl mx-auto text-gray-400 animate-bounce" />
              <p className="text-xl text-gray-500 font-medium">No suppliers found</p>
              <p className="text-gray-400">Please check back later</p>
            </div>
          )}
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

export default EmployeeSupplier;