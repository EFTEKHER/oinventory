import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import { ToastContainer } from 'react-toastify';
import { 
  FaBox, 
  FaTag, 
  FaInfoCircle, 
  FaUser, 
  FaTruck, 
  FaCheckCircle, 
  FaTimesCircle,
  FaExclamationCircle
} from 'react-icons/fa';
import 'react-toastify/dist/ReactToastify.css';

function EmployeeProduct() {
  const [productData, setProductData] = useState([]);

  useEffect(() => {
    const q = collection(db, 'products');
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const products = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setProductData(products);
    });
    return () => unsubscribe();
  }, []);

  const getStatusDetails = (status) => {
    switch (status.toLowerCase()) {
      case 'in stock':
        return { icon: FaCheckCircle, color: 'text-green-500' };
      case 'out of stock':
        return { icon: FaTimesCircle, color: 'text-red-500' };
      case 'low stock':
        return { icon: FaExclamationCircle, color: 'text-yellow-500' };
      default:
        return { icon: FaInfoCircle, color: 'text-gray-500' };
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-purple-50 p-6 md:p-8 lg:p-10">
      <ToastContainer position="top-right" autoClose={3000} />
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 md:mb-10 text-gray-800 flex items-center justify-center gap-3">
        <FaBox className="text-indigo-600 text-4xl" />
        Product Inventory
      </h2>
      
      {productData.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8">
          {productData.map((product) => {
            const { icon: StatusIcon, color } = getStatusDetails(product.productStatus);
            
            return (
              <div
                key={product.id}
                className="bg-white group p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:-translate-y-2 min-h-[280px]"
              >
                <div className="flex items-center gap-4 mb-6 pb-4 border-b border-gray-200">
                  <div className="p-3 bg-indigo-100 rounded-xl">
                    <FaTag className="text-indigo-600 text-2xl" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 truncate">
                    {product.productName}
                  </h3>
                </div>

                <div className="space-y-4 text-base md:text-lg">
                  <div className="flex items-center gap-3 text-gray-600">
                    <FaInfoCircle className="text-blue-400 text-xl flex-shrink-0" />
                    <p className="truncate">{product.productDescription}</p>
                  </div>

                  <div className="flex items-center gap-3 text-gray-600">
                    <FaUser className="text-purple-400 text-xl flex-shrink-0" />
                    <span><span className="font-semibold">Supplier:</span> {product.supplierID}</span>
                  </div>

                  <div className="flex items-center gap-3 text-gray-600">
                    <FaTruck className="text-orange-400 text-xl flex-shrink-0" />
                    <span><span className="font-semibold">Method:</span> {product.supplierMethod}</span>
                  </div>

                  <div className="flex items-center gap-3 mt-4">
                    <StatusIcon className={`${color} text-2xl flex-shrink-0`} />
                    <span className={`text-lg font-semibold ${color}`}>
                      {product.productStatus}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center p-10 bg-white rounded-2xl shadow-lg">
          <p className="text-gray-600 text-xl">No products available in inventory</p>
        </div>
      )}
    </div>
  );
}

export default EmployeeProduct;