import React, { useContext } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthContext } from '../context/AuthContext';
import AuthNavigator from './AuthNavigator';
import BottomTabs from './BottomTabs';

// Screen Imports
import AllHallsScreen from '../screens/AllHallsScreen'; 
import BookingForm from '../screens/BookingForm'; 
import CheckAvailabilityScreen from '../screens/CheckAvailabilityScreen';
import ProfileScreen from '../screens/ProfileScreen'; // Added
import NotificationsScreen from '../screens/NotificationsScreen'; // Added

const Stack = createNativeStackNavigator();

const MainNavigator = () => {
  const { userToken } = useContext(AuthContext);

  if (userToken == null) return <AuthNavigator />;

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* Primary Tab Navigation (Home, etc.) */}
      <Stack.Screen name="MainTabs" component={BottomTabs} />
      
      {/* Hall & Booking Flow */}
      <Stack.Screen name="AllHalls" component={AllHallsScreen} /> 
      <Stack.Screen name="CheckAvailability" component={CheckAvailabilityScreen} />
      <Stack.Screen name="BookingForm" component={BookingForm} />
      
      {/* Hamburger Menu Destinations */}
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
    </Stack.Navigator>
  );
};

export default MainNavigator;