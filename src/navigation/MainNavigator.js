import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import AuthNavigator from './AuthNavigator';
import AppNavigator from './AppNavigator'; 

const MainNavigator = () => {
  const { userToken } = useContext(AuthContext);
  return userToken === null ? <AuthNavigator /> : <AppNavigator />;
};

export default MainNavigator;