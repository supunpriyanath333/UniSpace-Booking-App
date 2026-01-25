import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import HomeScreen from '../screens/HomeScreen';
import MyBookingsScreen from '../screens/MyBookingsScreen'; 
import ProfileScreen from '../screens/ProfileScreen';
import CheckAvailabilityScreen from '../screens/CheckAvailabilityScreen';

const Tab = createBottomTabNavigator();

const BottomTabs = () => {
  return (
    <Tab.Navigator 
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: '#DA291C',
        tabBarInactiveTintColor: '#444',
        tabBarStyle: {
          backgroundColor: '#F9EDB3',
          height: 70,
          borderTopWidth: 1,
          borderTopColor: '#000',
          paddingBottom: 5,
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'MyBookings') {
            // List/Clipboard icon for My Bookings
            iconName = focused ? 'clipboard' : 'clipboard-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          } else if (route.name === 'CheckAvailability') {
            // Calendar icon for Availability
            iconName = focused ? 'calendar' : 'calendar-outline';
          }
          return <Ionicons name={iconName} size={size + 5} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="CheckAvailability" component={CheckAvailabilityScreen} />
      <Tab.Screen name="MyBookings" component={MyBookingsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

export default BottomTabs;