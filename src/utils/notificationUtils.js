import { addDoc, collection, updateDoc, arrayUnion, doc } from 'firebase/firestore';
import { db } from '../firebase';

// Create a new notification
export const createNotification = async (message) => {
  try {
    await addDoc(collection(db, 'notifications'), {
      message,
      timestamp: new Date(),
      readBy: []
    });
  } catch (error) {
    console.error('Notification error:', error);
  }
};

// Mark a notification as read by the current user
export const markAsRead = async (notifId, userEmail) => {
  try {
    const notifRef = doc(db, 'notifications', notifId);
    await updateDoc(notifRef, {
      readBy: arrayUnion(userEmail)
    });
  } catch (error) {
    console.error('Error marking notification as read:', error);
  }
};
