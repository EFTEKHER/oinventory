import React, { useState } from "react";
import UserManagement from "./Admin/UserManagement";
import SalaryManagement from "./Admin/SalaryManagement";
import LeaveRequests from "./Admin/LeaveRequests";
import InventoryManagementAdmin from "./Admin/InventoryManagement";
import InventoryList from "./InventoryList";
import Supplier from "../components/Supplier";
import Product from "../components/Product";
import Office from "./Office";
import { motion, AnimatePresence } from "framer-motion";
import Chatbot from "./Chatbot";

function AdminDashboard() {
  const adminTabs = [
    { id: "userManagement", label: "User Management", component: <UserManagement /> },
    { id: "salaryManagement", label: "Salary Management", component: <SalaryManagement /> },
    { id: "inventorylist", label: "Inventory List", component: <InventoryList /> },
    { id: "leaveRequests", label: "Leave Requests", component: <LeaveRequests /> },
    { id: "inventory", label: "Inventory", component: <InventoryManagementAdmin /> },
    { id: "supplier", label: "Supplier", component: <Supplier /> },
    {id :"office", label: "Office", component: <Office />},
    { id: "product", label: "Product", component: <Product /> },
    {id:"chatbot", label: "Chatbot", component: <Chatbot />}
  ];

  const [activeTab, setActiveTab] = useState(adminTabs[0].id);

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Admin Dashboard</h1>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap justify-center gap-2 mb-6">
        {adminTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`p-2 rounded-lg transition-all duration-300 ${
              activeTab === tab.id ? "bg-blue-500 text-white shadow-lg" : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Animated Tab Content */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <AnimatePresence mode="wait">
          {adminTabs.map(
            (tab) =>
              activeTab === tab.id && (
                <motion.div
                  key={tab.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  {tab.component}
                </motion.div>
              )
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default AdminDashboard;
