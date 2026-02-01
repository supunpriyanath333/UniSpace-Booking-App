import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userToken, setUserToken] = useState(null);
  const [userEmail, setUserEmail] = useState(null); // Added email state
  const [isLoading, setIsLoading] = useState(true);

  const login = async (token, email) => {
    setUserToken(token);
    setUserEmail(email); // Set email on login
    await AsyncStorage.setItem('userToken', token);
    await AsyncStorage.setItem('userEmail', email); // Persist email
  };

  const logout = async () => {
    setUserToken(null);
    setUserEmail(null); // Clear email on logout
    await AsyncStorage.removeItem('userToken');
    await AsyncStorage.removeItem('userEmail');
  };

  const isLoggedIn = async () => {
    try {
      setIsLoading(true);
      const token = await AsyncStorage.getItem('userToken');
      const email = await AsyncStorage.getItem('userEmail'); // Retrieve email
      
      setUserToken(token);
      setUserEmail(email);
      setIsLoading(false);
    } catch (e) {
      console.log(`isLoggedIn error: ${e}`);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    isLoggedIn();
  }, []);

  return (
    <AuthContext.Provider value={{ 
      login, 
      logout, 
      userToken, 
      userEmail, // Provide email to the rest of the app
      isLoading 
    }}>
      {children}
    </AuthContext.Provider>
  );
};