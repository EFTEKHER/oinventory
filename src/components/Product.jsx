// components/Product/Product.jsx
import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { FaEdit, FaTrash, FaPlus, FaTimes } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Product() {
  const [productData, setProductData] = useState([]);
  const [formData, setFormData] = useState({
    id: '',
    productName: '',
    productDescription: '',
    supplierID: '',
    supplierMethod: '',
    productStatus: ''
  });

  useEffect(() => {
    const q = collection(db, 'products');
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const products = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setProductData(products);
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
        // Update existing product
        const productRef = doc(db, 'products', formData.id);
        await updateDoc(productRef, {
          productName: formData.productName,
          productDescription: formData.productDescription,
          supplierID: formData.supplierID,
          supplierMethod: formData.supplierMethod,
          productStatus: formData.productStatus
        });
        toast.success('Product updated successfully!');
      } else {
        // Add new product
        await addDoc(collection(db, 'products'), {
          productName: formData.productName,
          productDescription: formData.productDescription,
          supplierID: formData.supplierID,
          supplierMethod: formData.supplierMethod,
          productStatus: formData.productStatus
        });
        toast.success('Product added successfully!');
      }
      resetForm();
    } catch (error) {
      toast.error('Error updating/adding product!');
    }
  };

  const handleEdit = (product) => {
    setFormData(product);
  };

  const handleDelete = async (id) => {
    try {
      const productRef = doc(db, 'products', id);
      await deleteDoc(productRef);
      toast.success('Product deleted successfully!');
    } catch (error) {
      toast.error('Error deleting product!');
    }
  };

  const resetForm = () => {
    setFormData({
      id: '',
      productName: '',
      productDescription: '',
      supplierID: '',
      supplierMethod: '',
      productStatus: ''
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-purple-50 p-4">
      <ToastContainer position="top-right" autoClose={3000} />
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Product List</h2>
      <form onSubmit={handleAddOrUpdate} className="bg-white p-6 rounded-lg shadow-md mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <input
            type="text"
            name="productName"
            value={formData.productName}
            onChange={handleInputChange}
            placeholder="Product Name"
            required
            className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            name="productDescription"
            value={formData.productDescription}
            onChange={handleInputChange}
            placeholder="Product Description"
            required
            className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            name="supplierID"
            value={formData.supplierID}
            onChange={handleInputChange}
            placeholder="Supplier ID"
            required
            className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            name="supplierMethod"
            value={formData.supplierMethod}
            onChange={handleInputChange}
            placeholder="Supplier Method"
            required
            className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            name="productStatus"
            value={formData.productStatus}
            onChange={handleInputChange}
            placeholder="Product Status"
            required
            className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex justify-end mt-4 space-x-2">
          <button
            type="submit"
            className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition duration-300 flex items-center"
          >
            {formData.id ? <FaEdit className="mr-2" /> : <FaPlus className="mr-2" />}
            {formData.id ? 'Update Product' : 'Add Product'}
          </button>
          {formData.id && (
            <button
              type="button"
              onClick={resetForm}
              className="bg-gray-500 text-white p-2 rounded hover:bg-gray-600 transition duration-300 flex items-center"
            >
              <FaTimes className="mr-2" />
              Cancel
            </button>
          )}
        </div>
      </form>
      {productData.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {productData.map((product) => (
            <div
              key={product.id}
              className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <p className="text-lg font-semibold text-gray-800">{product.productName}</p>
              <p className="text-sm text-gray-600">{product.productDescription}</p>
              <p className="text-sm text-gray-600"><strong>Supplier ID:</strong> {product.supplierID}</p>
              <p className="text-sm text-gray-600"><strong>Supplier Method:</strong> {product.supplierMethod}</p>
              <p className="text-sm text-gray-600"><strong>Product Status:</strong> {product.productStatus}</p>
              <div className="flex justify-end mt-4 space-x-2">
                <button
                  onClick={() => handleEdit(product)}
                  className="bg-yellow-500 text-white p-2 rounded hover:bg-yellow-600 transition duration-300 flex items-center"
                >
                  <FaEdit className="mr-2" />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(product.id)}
                  className="bg-red-500 text-white p-2 rounded hover:bg-red-600 transition duration-300 flex items-center"
                >
                  <FaTrash className="mr-2" />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-600">No products found.</p>
      )}
    </div>
  );
}

export default Product;