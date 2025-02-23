import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import AdminDashboard from "./AdminDashboard";
import EmployeeDashboard from "./EmployeeDashboard";

function Dashboard() {
  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();
  const adminEmails = ["binary2ai@gmail.com", "shaimacme@gmail.com", "admin@gmail.com"];

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [user, loading, navigate]);

  if (loading) return <p className="text-center mt-10 text-gray-500">Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-100 pt-16"> {/* Added pt-16 to offset Navbar */}
      {user && adminEmails.includes(user.email) ? <AdminDashboard /> : <EmployeeDashboard />}
    </div>
  );
}

export default Dashboard;
