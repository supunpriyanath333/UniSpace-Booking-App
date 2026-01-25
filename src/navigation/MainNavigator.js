import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import AuthNavigator from './AuthNavigator';
import BottomTabs from './BottomTabs'; // Your bottom navigation file

const MainNavigator = () => {
  const { userToken } = useContext(AuthContext);

  // If userToken is null, show Login/Register. 
  // Once login() sets the token, this will automatically re-render and show BottomTabs.
  return userToken == null ? <AuthNavigator /> : <BottomTabs />;
};

export default MainNavigator;