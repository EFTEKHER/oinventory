import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMenu, FiX, FiBell, FiAlertCircle, FiCheckCircle, FiInfo } from 'react-icons/fi';
import { auth, db } from '../firebase';
import { signOut } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { markAsRead } from '../utils/notificationUtils';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Navbar() {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationsRef = useRef(null);

  const handleSignOut = async () => {
    await signOut(auth);
    navigate('/login');
    toast.success('Successfully signed out');
  };

  // Close notifications when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Listen for notifications
  useEffect(() => {
    if (user) {
      const q = query(
        collection(db, 'notifications'),
        orderBy('timestamp', 'desc')
      );
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const notifs = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          timestamp: doc.data().timestamp?.toDate()
        }));
        
        // Detect new notifications for toast
        const newNotifs = notifs.filter(
          newNotif => !notifications.some(oldNotif => oldNotif.id === newNotif.id)
        );
        
        newNotifs.forEach(notif => {
          if (!notif.readBy?.includes(user.email)) {
            toast.info(notif.message, {
              icon: getNotificationIcon(notif.type),
              autoClose: 5000,
              hideProgressBar: true,
            });
          }
        });

        setNotifications(notifs);
      });
      return () => unsubscribe();
    }
  }, [user]);

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'alert':
        return <FiAlertCircle className="text-yellow-500 mr-2" />;
      case 'success':
        return <FiCheckCircle className="text-green-500 mr-2" />;
      default:
        return <FiInfo className="text-blue-500 mr-2" />;
    }
  };

  const handleMarkAsRead = async (notifId) => {
    if (!user) return; // Guard in case user is null
    try {
      await markAsRead(notifId, user.email);
      toast.success('Marked as read');
    } catch (error) {
      toast.error('Error marking notification');
    }
  };

  // Guard against user being null when calculating unreadCount
  const unreadCount = user
    ? notifications.filter(notif => !notif.readBy?.includes(user.email)).length
    : 0;

  // Toggle body scroll when mobile menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
  }, [menuOpen]);

  return (
    <>
      <nav className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-300 backdrop-blur-sm shadow-lg fixed w-full z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left section */}
            <div className="flex items-center">
              <Link
                to="/"
                className="text-white text-2xl font-bold tracking-tighter hover:text-indigo-100 transition-colors"
              >
                OfficeHub
              </Link>
            </div>

            {/* Desktop navigation */}
            <div className="hidden md:flex items-center space-x-6">
              <Link
                to="/home"
                className="text-white hover:text-indigo-100 px-3 py-2 rounded-md transition-colors"
              >
                Home
              </Link>
              
              {user && (
                <div className="relative" ref={notificationsRef}>
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="text-white relative p-2 hover:bg-white/10 rounded-full transition-colors"
                  >
                    <FiBell className="h-6 w-6" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-xs w-5 h-5 rounded-full flex items-center justify-center">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  {showNotifications && (
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl transform transition-all duration-200 origin-top-right">
                      <div className="p-4 border-b border-gray-200">
                        <h3 className="text-lg font-semibold">Notifications</h3>
                      </div>
                      <div className="max-h-96 overflow-y-auto">
                        {notifications.length > 0 ? (
                          notifications.map(notif => (
                            <div
                              key={notif.id}
                              className={`p-4 border-b hover:bg-gray-50 cursor-pointer transition-colors ${
                                notif.readBy?.includes(user.email) ? 'bg-gray-50' : 'bg-white'
                              }`}
                              onClick={() => handleMarkAsRead(notif.id)}
                            >
                              <div className="flex items-start">
                                {getNotificationIcon(notif.type)}
                                <div className="flex-1">
                                  <p className="text-sm text-gray-800">{notif.message}</p>
                                  <p className="text-xs text-gray-500 mt-1">
                                    {new Date(notif.timestamp).toLocaleString()}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="p-4 text-center text-gray-500">
                            No new notifications
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {user ? (
                <div className="flex items-center space-x-4">
                  <span className="text-black text-sm font-medium">{user.email}</span>
                  <button
                    onClick={handleSignOut}
                    className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Login
                </Link>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              {user && (
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="text-white mr-4 relative p-2"
                >
                  <FiBell className="h-6 w-6" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-xs w-5 h-5 rounded-full flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </button>
              )}
              
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="text-white hover:bg-white/10 p-2 rounded-full"
              >
                {menuOpen ? (
                  <FiX className="h-6 w-6" />
                ) : (
                  <FiMenu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <div
          className={`md:hidden fixed top-16 right-0 w-full h-full bg-black/50 transition-opacity duration-300 ${
            menuOpen ? 'opacity-100 visible' : 'opacity-80 visible'
          }`}
          onClick={() => setMenuOpen(false)}
        >
          <div
            className={`absolute right-0 w-64 bg-slate-700 h-full transform transition-transform duration-300 ${
              menuOpen ? 'translate-x-0' : 'translate-x-full'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b bg-slate-700 text-white border-gray-200">
              {user ? (
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-800">{user.email}</p>
                  <button
                    onClick={handleSignOut}
                    className="text-red-600 text-sm mt-2 hover:text-red-700"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="text-blue-600 hover:text-blue-700 block mb-4"
                  onClick={() => setMenuOpen(false)}
                >
                  Login
                </Link>
              )}

              <Link
                to="/home"
                className="block py-2 text-gray-800 hover:text-indigo-600"
                onClick={() => setMenuOpen(false)}
              >
                Home
              </Link>
            </div>

            {user && notifications.length > 0 && (
              <div className="p-4 border-b bg-slate-700 text-white border-gray-200">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Notifications</h3>
                <div className="space-y-2">
                  {notifications.map(notif => (
                    <div
                      key={notif.id}
                      className={`p-3 rounded-lg cursor-pointer ${
                        notif.readBy?.includes(user.email)
                          ? 'bg-gray-50'
                          : 'bg-blue-50'
                      }`}
                      onClick={() => handleMarkAsRead(notif.id)}
                    >
                      <div className="flex items-start">
                        {getNotificationIcon(notif.type)}
                        <div className="ml-2">
                          <p className="text-xs text-gray-800">{notif.message}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(notif.timestamp).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>
      <ToastContainer position="bottom-right" />
    </>
  );
}

export default Navbar;
