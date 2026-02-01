import { db } from '../firebase/firebaseConfig';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export const sendNotification = async (userId, type, title, message) => {
  try {
    const notifRef = collection(db, 'users', userId, 'notifications');
    await addDoc(notifRef, {
      type, // 'Approved', 'Declined', 'Cancelled', 'Reminder', 'Requested'
      title,
      message,
      isRead: false,
      time: serverTimestamp(),
    });
  } catch (error) {
    console.error("Notification Error:", error);
  }
};