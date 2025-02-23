// src/components/Admin/UserManagement.jsx
import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { collection, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaEdit, FaSave, FaSpinner, FaTimes } from 'react-icons/fa';

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [editingUserId, setEditingUserId] = useState(null);
  const [editedName, setEditedName] = useState('');
  const [editedSalary, setEditedSalary] = useState('');
  const [editedRole, setEditedRole] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'users'), (snapshot) => {
      const userData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      setUsers(userData);
    });
    return () => unsubscribe();
  }, []);

  const handleEdit = (user) => {
    setEditingUserId(user.id);
    setEditedName(user.name || '');
    setEditedSalary(user.salary || 0);
    setEditedRole(user.role || 'employee');
  };

  const cancelEdit = () => {
    setEditingUserId(null);
    setEditedName('');
    setEditedSalary('');
    setEditedRole('');
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      const userRef = doc(db, 'users', editingUserId);
      await updateDoc(userRef, {
        name: editedName,
        salary: Number(editedSalary),
        role: editedRole
      });
      toast.success('User updated successfully!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      cancelEdit();
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error(`Update failed: ${error.message}`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
    setIsUpdating(false);
  };

  return (
    <div className="p-4 min-h-screen bg-gray-50 animate-fade-in">
      <ToastContainer />
      <h2 className="text-2xl font-bold text-gray-800 mb-6">User Management</h2>
      <div className="overflow-x-auto rounded-lg shadow-lg">
        <table className="min-w-full bg-white">
          <thead className="bg-gradient-to-r from-blue-500 to-blue-600">
            <tr>
              <th className="py-3 px-6 text-left text-white font-semibold">Email</th>
              <th className="py-3 px-6 text-left text-white font-semibold">Name</th>
              <th className="py-3 px-6 text-left text-white font-semibold">Salary</th>
              <th className="py-3 px-6 text-left text-white font-semibold">Role</th>
              <th className="py-3 px-6 text-center text-white font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {users.map((user) => (
              <tr 
                key={user.id} 
                className="hover:bg-gray-50 transition-colors duration-200"
              >
                <td className="py-4 px-6 text-gray-700">{user.email}</td>
                <td className="py-4 px-6">
                  {editingUserId === user.id ? (
                    <input
                      type="text"
                      value={editedName}
                      onChange={(e) => setEditedName(e.target.value)}
                      className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-32"
                    />
                  ) : (
                    <span className="text-gray-800">{user.name || 'N/A'}</span>
                  )}
                </td>
                <td className="py-4 px-6">
                  {editingUserId === user.id ? (
                    <input
                      type="number"
                      value={editedSalary}
                      onChange={(e) => setEditedSalary(e.target.value)}
                      className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-24"
                    />
                  ) : (
                    <span className="text-gray-800">
                      ${user.salary?.toLocaleString() || '0'}
                    </span>
                  )}
                </td>
                <td className="py-4 px-6">
                  {editingUserId === user.id ? (
                    <select
                      value={editedRole}
                      onChange={(e) => setEditedRole(e.target.value)}
                      className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="employee">Employee</option>
                      <option value="admin">Admin</option>
                      <option value="manager">Manager</option>
                    </select>
                  ) : (
                    <span className="capitalize text-gray-800">{user.role}</span>
                  )}
                </td>
                <td className="py-4 px-6 text-center">
                  <div className="flex items-center justify-center space-x-2">
                    {editingUserId === user.id ? (
                      <>
                        <button
                          onClick={handleUpdate}
                          disabled={isUpdating}
                          className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200 disabled:opacity-50 flex items-center"
                        >
                          {isUpdating ? (
                            <FaSpinner className="animate-spin" />
                          ) : (
                            <FaSave className="w-4 h-4" />
                          )}
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200"
                        >
                          <FaTimes className="w-4 h-4" />
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => handleEdit(user)}
                        className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
                      >
                        <FaEdit className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default UserManagement;