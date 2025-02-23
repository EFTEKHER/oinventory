// App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Signup from './components/Signup'; // Import the Signup component
import Dashboard from './components/Dashboard';
import Footer from './components/Footer';
import Home from './components/Home';
import Chat from './components/Chat';

function App() {
  return (
    <Router>
      <Navbar />
      <div className="pt-16"> {/* Added pt-16 for all pages */}
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </div>
      <Footer />
    </Router>
  );
}

export default App;