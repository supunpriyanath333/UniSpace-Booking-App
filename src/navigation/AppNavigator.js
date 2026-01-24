import React from 'react';
import { createStackNavigator } from '@react-navigation/stack'; // This works now!
import BottomTabs from './BottomTabs';
import AllHallsScreen from '../screens/AllHallsScreen';
import HallDetailsScreen from '../screens/HallDetailsScreen';
import CheckAvailabilityScreen from '../screens/CheckAvailabilityScreen'; // Add this
import MyBookingsScreen from '../screens/MyBookingsScreen'; // Add this
import colors from '../constants/colors';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* 1. The Main Home Screen (Tabs) */}
      <Stack.Screen name="MainTabs" component={BottomTabs} />
      
      {/* 2. Inner Screens (Navigation works because they are here) */}
      <Stack.Screen 
        name="AllHalls" 
        component={AllHallsScreen} 
        options={{ headerShown: true, title: 'Available Halls', headerStyle: { backgroundColor: colors.secondary } }} 
      />
      <Stack.Screen 
        name="HallDetails" 
        component={HallDetailsScreen} 
        options={{ headerShown: true, title: 'Hall Details' }} 
      />
      <Stack.Screen 
        name="CheckAvailability" 
        component={CheckAvailabilityScreen} 
        options={{ headerShown: true, title: 'Check Availability' }} 
      />
      <Stack.Screen 
        name="MyBookings" 
        component={MyBookingsScreen} 
        options={{ headerShown: true, title: 'My Bookings' }} 
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;