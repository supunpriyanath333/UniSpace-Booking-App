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
        tabBarInactiveTintColor: '#787878', 
        tabBarStyle: {
          backgroundColor: '#F9EDB3', 
          height: 70,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          position: 'absolute',
          // Ensure there is no extra border or padding causing offset
          borderTopWidth: 0, 
          elevation: 10, // Shadow for Android
          shadowColor: '#000', // Shadow for iOS
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
        },
        // THIS SECTION CENTERS THE ICONS
        tabBarItemStyle: {
          justifyContent: 'center', // Horizontal center
          alignItems: 'center',      // Vertical center
          paddingTop: 5,             // Adjust this slightly if icons look too low
        },
        tabBarIcon: ({ focused, color }) => {
          let iconName;
          if (route.name === 'Home') iconName = focused ? 'home' : 'home-outline';
          else if (route.name === 'Bookings') iconName = focused ? 'clipboard' : 'clipboard-outline';
          else if (route.name === 'Profile') iconName = focused ? 'person' : 'person-outline';
          else if (route.name === 'Calendar') iconName = focused ? 'calendar' : 'calendar-outline';

          // Increased size to 28 for better visibility on the yellow background
          return <Ionicons name={iconName} size={28} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Bookings" component={MyBookingsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
      <Tab.Screen name="Calendar" component={CheckAvailabilityScreen} />
    </Tab.Navigator>
  );
};

export default BottomTabs;