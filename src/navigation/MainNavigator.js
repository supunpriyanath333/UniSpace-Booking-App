import React, { useContext } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthContext } from '../context/AuthContext';
import AuthNavigator from './AuthNavigator';
import BottomTabs from './BottomTabs';
import AllHallsScreen from '../screens/AllHallsScreen'; 
// ADD THESE IMPORTS
import BookingForm from '../screens/BookingForm'; 
import CheckAvailabilityScreen from '../screens/CheckAvailabilityScreen';

const Stack = createNativeStackNavigator();

const MainNavigator = () => {
  const { userToken } = useContext(AuthContext);

  if (userToken == null) return <AuthNavigator />;

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs" component={BottomTabs} />
      <Stack.Screen name="AllHalls" component={AllHallsScreen} /> 
      {/* ADD THESE SCREENS TO THE STACK */}
      <Stack.Screen name="CheckAvailability" component={CheckAvailabilityScreen} />
      <Stack.Screen name="BookingForm" component={BookingForm} />
    </Stack.Navigator>
  );
};

export default MainNavigator;