import React, { useState, useEffect } from 'react';
import { auth, provider, db } from '../firebase';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { FaGoogle, FaArrowRight } from 'react-icons/fa';
import { FiMail, FiLock } from 'react-icons/fi';

function Login() {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const createUserDocument = async (user) => {
    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);
    if (!userSnap.exists()) {
      await setDoc(userRef, {
        email: user.email,
        name: user.displayName || '',
        salary: 0,
        role: 'employee'
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      await createUserDocument(user);
      navigate('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      alert(error.message);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const { user } = await signInWithPopup(auth, provider);
      await createUserDocument(user);
      navigate('/dashboard');
    } catch (error) {
      console.error('Google sign in error:', error);
      alert(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-300 via-purple-200 to-pink-300 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white/80 backdrop-blur-sm rounded-xl p-6 md:p-8 shadow-xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back</h1>
          <p className="text-gray-600">Sign in to continue to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 mb-2 font-medium">Email</label>
            <div className="relative">
              <FiMail className="absolute top-3 left-3 text-gray-400 text-lg" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your email"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 mb-2 font-medium">Password</label>
            <div className="relative">
              <FiLock className="absolute top-3 left-3 text-gray-400 text-lg" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your password"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-slate-600 hover:bg-blue-700 text-white py-2.5 px-4 rounded-lg font-medium transition-all duration-300 flex items-center justify-center"
          >
            Continue <FaArrowRight className="ml-2" />
          </button>
        </form>

        <div className="my-6 flex items-center">
          <div className="flex-1 border-t border-gray-300"></div>
          <span className="px-3 text-gray-500">or</span>
          <div className="flex-1 border-t border-gray-300"></div>
        </div>

        <button
          onClick={handleGoogleSignIn}
          className="w-full bg-green-500 hover:bg-green-600 text-white py-2.5 px-4 rounded-lg font-medium transition-all duration-300 flex items-center justify-center"
        >
          <FaGoogle className="mr-2" /> Continue with Google
        </button>

        <p className="mt-6 text-center text-gray-600">
          Don't have an account?{' '}
          <Link
            to="/signup"
            className="text-blue-500 hover:text-blue-600 font-medium transition-colors duration-300"
          >
            Sign up here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;