import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons'; // Ensure this is installed

// Import your screens
import HomeScreen from '../screens/HomeScreen';
import AllHallsScreen from '../screens/AllHallsScreen'; 
import ProfileScreen from '../screens/ProfileScreen';
import CheckAvailabilityScreen from '../screens/CheckAvailabilityScreen';

const Tab = createBottomTabNavigator();

const BottomTabs = () => {
  return (
    <Tab.Navigator 
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false, // Hides text labels as per your UI
        tabBarActiveTintColor: '#DA291C', // Active icon color (Red)
        tabBarInactiveTintColor: '#444',  // Inactive icon color
        tabBarStyle: {
          backgroundColor: '#F9EDB3', // Your theme yellow
          height: 70,
          borderTopWidth: 1,
          borderTopColor: '#000',
          paddingBottom: 5,
        },
        // This function draws the icons
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Bookings') {
            iconName = focused ? 'clipboard' : 'clipboard-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          } else if (route.name === 'Calendar') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          }

          return <Ionicons name={iconName} size={size + 5} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Bookings" component={AllHallsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
      <Tab.Screen name="Calendar" component={CheckAvailabilityScreen} />
    </Tab.Navigator>
  );
};

export default BottomTabs;