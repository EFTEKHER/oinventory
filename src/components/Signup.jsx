// src/components/Signup.jsx
import React, { useState } from 'react';
import { auth, provider, db } from '../firebase';
import { createUserWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { useNavigate, Link } from 'react-router-dom';

function Signup() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');

  // Create a user document in Firestore if not already present
  const createUserDocument = async (user, userName = '') => {
    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);

    // If no user doc exists, create it
    if (!userSnap.exists()) {
      await setDoc(userRef, {
        email: user.email,
        name: userName,          // name from form or displayName
        salary: 0,               // default salary
        role: 'employee'         // default role
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      // Use the name from the signup form
      await createUserDocument(user, name);
      navigate('/dashboard');
    } catch (error) {
      console.error('Sign up error:', error);
      alert(error.message);
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      const { user } = await signInWithPopup(auth, provider);
      // Use displayName if available
      await createUserDocument(user, user.displayName || '');
      navigate('/dashboard');
    } catch (error) {
      console.error('Google sign up error:', error);
      alert(error.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-4 text-center">Sign Up</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Field */}
          <div>
            <label className="block text-gray-700">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full border p-2 rounded"
              placeholder="Your Name"
            />
          </div>
          {/* Email Field */}
          <div>
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border p-2 rounded"
            />
          </div>
          {/* Password Field */}
          <div>
            <label className="block text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border p-2 rounded"
            />
          </div>
          {/* Confirm Password Field */}
          <div>
            <label className="block text-gray-700">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full border p-2 rounded"
            />
          </div>

          <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
            Sign Up
          </button>
        </form>

        {/* Google Sign Up */}
        <button
          onClick={handleGoogleSignUp}
          className="w-full mt-4 bg-red-500 text-white p-2 rounded"
        >
          Sign Up with Google
        </button>

        <p className="mt-4 text-center">
          Already have an account?{' '}
          <Link to="/" className="text-blue-500">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;
