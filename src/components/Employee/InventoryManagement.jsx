// components/Admin/InventoryManagement.jsx
import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot
} from 'firebase/firestore';

function InventoryManagement() {
  const [items, setItems] = useState([]);
  const [itemName, setItemName] = useState('');
  const [itemId, setItemId] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [quantity, setQuantity] = useState('');
  const [availabilityStatus, setAvailabilityStatus] = useState('In Stock');
  const [editingItemId, setEditingItemId] = useState(null);

  // Reference to 'inventory' collection in Firestore
  const inventoryRef = collection(db, 'inventory');

  useEffect(() => {
    const unsubscribe = onSnapshot(inventoryRef, (snapshot) => {
      const invItems = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      setItems(invItems);
    });
    return () => unsubscribe();
  }, []);

  // Add new item
  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await addDoc(inventoryRef, {
        itemName,
        itemId,
        expiryDate,
        price,
        description,
        quantity,
        availabilityStatus
      });
      resetForm();
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  // Prepare form for editing an existing item
  const handleEdit = (item) => {
    setEditingItemId(item.id);
    setItemName(item.itemName);
    setItemId(item.itemId);
    setExpiryDate(item.expiryDate);
    setPrice(item.price);
    setDescription(item.description);
    setQuantity(item.quantity);
    setAvailabilityStatus(item.availabilityStatus);
  };

  // Update existing item
  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editingItemId) return;

    try {
      const docRef = doc(db, 'inventory', editingItemId);
      await updateDoc(docRef, {
        itemName,
        itemId,
        expiryDate,
        price,
        description,
        quantity,
        availabilityStatus
      });
      setEditingItemId(null);
      resetForm();
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  // Delete an item
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this item?");
    if (confirmDelete) {
      try {
        await deleteDoc(doc(db, 'inventory', id));
      } catch (error) {
        console.error(error);
        alert(error.message);
      }
    }
  };

  // Reset form fields
  const resetForm = () => {
    setItemName('');
    setItemId('');
    setExpiryDate('');
    setPrice('');
    setDescription('');
    setQuantity('');
    setAvailabilityStatus('In Stock');
  };

  return (
    <div className="p-4 min-h-screen bg-gradient-to-r from-blue-50 to-purple-50">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Inventory Management
        </h2>

        {/* Form Section */}
        <form
          onSubmit={editingItemId ? handleUpdate : handleAdd}
          className="mb-8 bg-white p-6 rounded-lg shadow-lg transform transition-all duration-300 hover:shadow-2xl"
        >
          {/* Inputs arranged in a responsive grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Item Name"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              className="border p-2 rounded w-full focus:ring-2 focus:ring-blue-500 transition-all"
              required
            />
            <input
              type="text"
              placeholder="Item ID"
              value={itemId}
              onChange={(e) => setItemId(e.target.value)}
              className="border p-2 rounded w-full focus:ring-2 focus:ring-blue-500 transition-all"
              required
            />
            <input
              type="date"
              placeholder="Expiry Date"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
              className="border p-2 rounded w-full focus:ring-2 focus:ring-blue-500 transition-all"
              required
            />
            <input
              type="number"
              placeholder="Price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="border p-2 rounded w-full focus:ring-2 focus:ring-blue-500 transition-all"
              required
            />
            <input
              type="number"
              placeholder="Quantity"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="border p-2 rounded w-full focus:ring-2 focus:ring-blue-500 transition-all"
              required
            />
            <select
              value={availabilityStatus}
              onChange={(e) => setAvailabilityStatus(e.target.value)}
              className="border p-2 rounded w-full focus:ring-2 focus:ring-blue-500 transition-all"
              required
            >
              <option value="In Stock">In Stock</option>
              <option value="Out of Stock">Out of Stock</option>
            </select>
          </div>

          {/* Textarea below the grid */}
          <div className="mt-4">
            <textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="border p-2 rounded w-full focus:ring-2 focus:ring-blue-500 transition-all"
              rows={3}
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="mt-4 bg-green-500 hover:bg-green-600 text-white p-2 rounded w-full transition-colors duration-300 transform hover:scale-105"
          >
            {editingItemId ? 'Update Item' : 'Add Item'}
          </button>
        </form>

        {/* Table Section */}
        <div className="overflow-x-auto bg-white rounded-lg shadow-lg transform transition-all duration-300 hover:shadow-2xl">
          <table className="min-w-full border border-gray-200 rounded-lg">
            <thead>
              <tr className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                <th className="py-3 px-4 border text-left">Item Name</th>
                <th className="py-3 px-4 border text-left">Item ID</th>
                <th className="py-3 px-4 border text-left">Description</th>
                <th className="py-3 px-4 border text-left">Quantity</th>
                <th className="py-3 px-4 border text-left">Expiry Date</th>
                <th className="py-3 px-4 border text-left">Price</th>
                <th className="py-3 px-4 border text-left">Availability</th>
                <th className="py-3 px-4 border text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-gray-50 transition-colors duration-300 border-b last:border-b-0"
                >
                  <td className="py-3 px-4 border">{item.itemName}</td>
                  <td className="py-3 px-4 border">{item.itemId}</td>
                  <td className="py-3 px-4 border">{item.description}</td>
                  <td className="py-3 px-4 border">{item.quantity}</td>
                  <td className="py-3 px-4 border">{item.expiryDate}</td>
                  <td className="py-3 px-4 border">${item.price}</td>
                  <td className="py-3 px-4 border">{item.availabilityStatus}</td>
                  <td className="py-5 px-4 border flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
                    <button
                      onClick={() => handleEdit(item)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded transition-all duration-300 transform hover:scale-105"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition-all duration-300 transform hover:scale-105"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr>
                  <td
                    colSpan={8}
                    className="py-4 px-4 text-center text-gray-500"
                  >
                    No items found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default InventoryManagement;
