// components/Inventory/InventoryList.jsx
import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot } from 'firebase/firestore';

function InventoryList() {
  const [inventoryItems, setInventoryItems] = useState([]);

  useEffect(() => {
    const inventoryRef = collection(db, 'inventory');
    const unsubscribe = onSnapshot(inventoryRef, (snapshot) => {
      const items = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      setInventoryItems(items);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="p-4 min-h-screen bg-gradient-to-r from-blue-50 to-purple-50">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Inventory Items</h2>
      <div className="overflow-x-auto rounded-lg shadow-lg">
        <table className="min-w-full bg-white rounded-lg overflow-hidden">
          <thead className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
            <tr>
              <th className="py-3 px-4 text-left font-semibold">Item Name</th>
              <th className="py-3 px-4 text-left font-semibold">Item ID</th>
              <th className="py-3 px-4 text-left font-semibold">Description</th>
              <th className="py-3 px-4 text-left font-semibold">Quantity</th>
              <th className="py-3 px-4 text-left font-semibold">Availability</th>
              <th className="py-3 px-4 text-left font-semibold">Expiration Date</th>
              <th className="py-3 px-4 text-left font-semibold">Price ($)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {inventoryItems.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                <td className="py-3 px-4 text-gray-700">{item.itemName}</td>
                <td className="py-3 px-4 text-gray-700">{item.itemId}</td>
                <td className="py-3 px-4 text-gray-700">{item.description}</td>
                <td className="py-3 px-4 text-gray-700">{item.quantity}</td>
                <td className="py-3 px-4 text-gray-700">{item.availabilityStatus}</td>
                <td className="py-3 px-4 text-gray-700">{item.expiryDate}</td>
                <td className="py-3 px-4 text-gray-700">${item.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default InventoryList;