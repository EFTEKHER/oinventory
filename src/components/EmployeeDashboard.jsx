import React, { useState } from "react";
import SalaryView from "./Employee/SalaryView";
import LeaveRequest from "./Employee/LeaveRequest";
import InventoryManagementEmployee from "./Employee/InventoryManagement";
import InventoryList from "./InventoryList";
import OfficeView from "./Employee/OfficeView";
import Product from "./Product";
import Supplier from "./Supplier";
import { motion, AnimatePresence } from "framer-motion";
import Chatbot from "./Chatbot";
function EmployeeDashboard() {
  const employeeTabs = [
    { id: "salaryView", label: "My Salary", component: <SalaryView /> },
    { id: "leaveRequest", label: "Request Leave", component: <LeaveRequest /> },
    { id: "inventory", label: "Inventory", component: <InventoryManagementEmployee /> },
    { id: "inventorylist", label: "Inventory List", component: <InventoryList /> },
    { id: "officeView", label: "Office", component: <OfficeView /> },
    { id: "product", label: "Products", component: <Product /> },
    { id: "supplier", label: "Suppliers", component: <Supplier /> },
    { id: "chatbot", label: "Chatbot", component: <Chatbot /> }, // Add Chatbot component here

  ];

  const [activeTab, setActiveTab] = useState(employeeTabs[0].id);

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Employee Dashboard</h1>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap justify-center gap-2 mb-6">
        {employeeTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`p-2 rounded-lg transition-all duration-300 ${
              activeTab === tab.id ? "bg-green-500 text-white shadow-lg" : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Animated Tab Content */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <AnimatePresence mode="wait">
          {employeeTabs.map(
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

export default EmployeeDashboard;
