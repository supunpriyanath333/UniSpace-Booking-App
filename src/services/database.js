import { db } from '../firebase/firebaseConfig';
import { collection, getDocs, query, where } from 'firebase/firestore';

export const getAvailableHalls = async () => {
  try {
    const hallsRef = collection(db, 'halls');
    // We only want halls that are currently available
    const q = query(hallsRef, where('isAvailable', '==', true));
    
    const querySnapshot = await getDocs(q);
    const hallsList = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    return hallsList;
  } catch (error) {
    console.error("Error fetching halls: ", error);
    return [];
  }
};