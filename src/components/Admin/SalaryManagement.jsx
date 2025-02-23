// components/Admin/SalaryManagement.jsx
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
import {
  FaDollarSign,
  FaEdit,
  FaTrash,
  FaCheckCircle,
  FaTimesCircle
} from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function SalaryManagement() {
  const [salaries, setSalaries] = useState([]);
  const [employeeEmail, setEmployeeEmail] = useState('');
  const [employeeName, setEmployeeName] = useState('');
  const [role, setRole] = useState('');
  const [salary, setSalary] = useState('');
  const [bonus1, setBonus1] = useState('');
  const [bonus2, setBonus2] = useState('');
  const [bonus3, setBonus3] = useState('');
  const [extraFacility, setExtraFacility] = useState('');
  const [status, setStatus] = useState('paid'); // Default status
  const [paidMonth, setPaidMonth] = useState('');
  const [paidYear, setPaidYear] = useState('');
  const [editingSalaryId, setEditingSalaryId] = useState(null);

  const salariesRef = collection(db, 'salaries');

  useEffect(() => {
    const unsubscribe = onSnapshot(salariesRef, (snapshot) => {
      const salaryData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      setSalaries(salaryData);
    });
    return () => unsubscribe();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await addDoc(salariesRef, {
        employeeEmail,
        employeeName,
        role,
        salary,
        bonus1,
        bonus2,
        bonus3,
        extraFacility,
        status,
        paidMonth,
        paidYear
      });
      toast.success('Salary added successfully!');
      resetFields();
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  const handleEdit = (item) => {
    setEditingSalaryId(item.id);
    setEmployeeEmail(item.employeeEmail);
    setEmployeeName(item.employeeName);
    setRole(item.role);
    setSalary(item.salary);
    setBonus1(item.bonus1);
    setBonus2(item.bonus2);
    setBonus3(item.bonus3);
    setExtraFacility(item.extraFacility);
    setStatus(item.status);
    setPaidMonth(item.paidMonth);
    setPaidYear(item.paidYear);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const docRef = doc(db, 'salaries', editingSalaryId);
      await updateDoc(docRef, {
        employeeEmail,
        employeeName,
        role,
        salary,
        bonus1,
        bonus2,
        bonus3,
        extraFacility,
        status,
        paidMonth,
        paidYear
      });
      toast.success('Salary updated successfully!');
      resetFields();
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, 'salaries', id));
      toast.success('Salary deleted successfully!');
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  const resetFields = () => {
    setEditingSalaryId(null);
    setEmployeeEmail('');
    setEmployeeName('');
    setRole('');
    setSalary('');
    setBonus1('');
    setBonus2('');
    setBonus3('');
    setExtraFacility('');
    setStatus('paid');
    setPaidMonth('');
    setPaidYear('');
  };

  return (
    <div className="p-4 animate-fadeIn bg-gradient-to-r from-blue-50 to-purple-50 min-h-screen">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
        Salary Management
      </h2>

      {/* Form Section */}
      <form
        onSubmit={editingSalaryId ? handleUpdate : handleAdd}
        className="mb-8 space-y-4 bg-white p-6 rounded-lg shadow-lg transform transition-all duration-300 hover:shadow-xl"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <input
            type="email"
            placeholder="Employee Email"
            value={employeeEmail}
            onChange={(e) => setEmployeeEmail(e.target.value)}
            className="border p-2 rounded w-full focus:ring-2 focus:ring-blue-500 transition-all duration-300"
            required
          />
          <input
            type="text"
            placeholder="Employee Name"
            value={employeeName}
            onChange={(e) => setEmployeeName(e.target.value)}
            className="border p-2 rounded w-full focus:ring-2 focus:ring-blue-500 transition-all duration-300"
            required
          />
          <input
            type="text"
            placeholder="Role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="border p-2 rounded w-full focus:ring-2 focus:ring-blue-500 transition-all duration-300"
            required
          />
          <div className="flex items-center border rounded w-full focus-within:ring-2 focus-within:ring-blue-500 transition-all duration-300">
            <span className="px-2 text-gray-600">
              <FaDollarSign />
            </span>
            <input
              type="number"
              placeholder="Salary"
              value={salary}
              onChange={(e) => setSalary(e.target.value)}
              className="p-2 rounded w-full outline-none"
              required
            />
          </div>
          <input
            type="number"
            placeholder="Bonus 1"
            value={bonus1}
            onChange={(e) => setBonus1(e.target.value)}
            className="border p-2 rounded w-full focus:ring-2 focus:ring-blue-500 transition-all duration-300"
          />
          <input
            type="number"
            placeholder="Bonus 2"
            value={bonus2}
            onChange={(e) => setBonus2(e.target.value)}
            className="border p-2 rounded w-full focus:ring-2 focus:ring-blue-500 transition-all duration-300"
          />
          <input
            type="number"
            placeholder="Bonus 3"
            value={bonus3}
            onChange={(e) => setBonus3(e.target.value)}
            className="border p-2 rounded w-full focus:ring-2 focus:ring-blue-500 transition-all duration-300"
          />
          <input
            type="text"
            placeholder="Extra Facility"
            value={extraFacility}
            onChange={(e) => setExtraFacility(e.target.value)}
            className="border p-2 rounded w-full focus:ring-2 focus:ring-blue-500 transition-all duration-300"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="border p-2 rounded w-full focus:ring-2 focus:ring-blue-500 transition-all duration-300"
          >
            <option value="paid">Paid</option>
            <option value="unpaid">Unpaid</option>
          </select>
          <input
            type="month"
            value={
              paidMonth ? `${paidYear}-${String(paidMonth).padStart(2, '0')}` : ''
            }
            onChange={(e) => {
              const [year, month] = e.target.value.split('-');
              setPaidYear(year);
              setPaidMonth(month);
            }}
            placeholder="Enter Paid Month/Year"
            className="border p-2 rounded w-full focus:ring-2 focus:ring-blue-500 transition-all duration-300"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-green-500 hover:bg-green-600 transition-all duration-300 text-white p-2 rounded w-full flex items-center justify-center space-x-2 transform hover:scale-105"
        >
          {editingSalaryId ? (
            <>
              <FaEdit />
              <span>Update Salary</span>
            </>
          ) : (
            <>
              <FaCheckCircle />
              <span>Add Salary</span>
            </>
          )}
        </button>
      </form>

      {/* Table Section */}
      <div className="overflow-x-auto bg-white rounded-lg shadow-lg transform transition-all duration-300 hover:shadow-xl">
        <table className="min-w-full border border-gray-200 rounded-lg">
          <thead>
            <tr className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
              <th className="py-3 px-4 border text-left">Employee Email</th>
              <th className="py-3 px-4 border text-left">Employee Name</th>
              <th className="py-3 px-4 border text-left">Role</th>
              <th className="py-3 px-4 border text-left">Salary</th>
              <th className="py-3 px-4 border text-left">Bonuses</th>
              <th className="py-3 px-4 border text-left">Extra Facility</th>
              <th className="py-3 px-4 border text-left">Status</th>
              <th className="py-3 px-4 border text-left">Paid Month/Year</th>
              <th className="py-3 px-4 border text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {salaries.map((item) => (
              <tr
                key={item.id}
                className="hover:bg-gray-50 transition-colors duration-300 border-b last:border-b-0"
              >
                <td className="py-3 px-4 border">{item.employeeEmail}</td>
                <td className="py-3 px-4 border">{item.employeeName}</td>
                <td className="py-3 px-4 border">{item.role}</td>
                <td className="py-3 px-4 border">${item.salary}</td>
                <td className="py-3 px-4 border">
                  ${item.bonus1}, ${item.bonus2}, ${item.bonus3}
                </td>
                <td className="py-3 px-4 border">{item.extraFacility}</td>
                <td className="py-3 px-4 border">
                  {item.status === 'paid' ? (
                    <span className="text-green-500 flex items-center">
                      <FaCheckCircle className="mr-1" /> Paid
                    </span>
                  ) : (
                    <span className="text-red-500 flex items-center">
                      <FaTimesCircle className="mr-1" /> Unpaid
                    </span>
                  )}
                </td>
                <td className="py-3 px-4 border">
                  {item.paidMonth ? `${item.paidMonth}-${item.paidYear}` : 'N/A'}
                </td>
                <td className="py-5 px-4 border flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
                  <button
                    onClick={() => handleEdit(item)}
                    className="bg-blue-500 hover:bg-blue-600 transition-all duration-300 text-white px-3 py-1 rounded flex items-center justify-center space-x-1 transform hover:scale-105"
                  >
                    <FaEdit />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="bg-red-500 hover:bg-red-600 transition-all duration-300 text-white px-3 py-1 rounded flex items-center justify-center space-x-1 transform hover:scale-105"
                  >
                    <FaTrash />
                    <span>Delete</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Toast Notification Container */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
}

export default SalaryManagement;
