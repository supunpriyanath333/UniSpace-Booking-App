import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { Dimensions } from 'react-native';

import HomeScreen from '../screens/HomeScreen';
import MyBookingsScreen from '../screens/MyBookingsScreen'; 
import ProfileScreen from '../screens/ProfileScreen';
import CheckAvailabilityScreen from '../screens/CheckAvailabilityScreen';
import AllHallsScreen from '../screens/AllHallsScreen';

const Tab = createBottomTabNavigator();
const { width } = Dimensions.get('window');

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
          borderColor: '#0c0404',
          borderWidth: 1,
          borderTopEndRadius: 15,
          borderTopStartRadius: 15,
          borderTopColor: '#000',
          paddingBottom: 5,
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: width, // Ensures the bar background hits the right edge
          elevation: 0,
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Home') iconName = focused ? 'home' : 'home-outline';
          else if (route.name === 'MyBookings') iconName = focused ? 'clipboard' : 'clipboard-outline';
          else if (route.name === 'Profile') iconName = focused ? 'person' : 'person-outline';
          else if (route.name === 'CheckAvailability') iconName = focused ? 'calendar' : 'calendar-outline';
          return <Ionicons name={iconName} size={size + 4} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen}/>
      <Tab.Screen name="MyBookings" component={MyBookingsScreen}/>
      <Tab.Screen name="Profile" component={ProfileScreen}/>
      <Tab.Screen name="CheckAvailability" component={CheckAvailabilityScreen}/>
      <Tab.Screen 
        name="AllHalls" 
        component={AllHallsScreen} 
        options={{ 
          tabBarButton: () => null,
          tabBarItemStyle: { display: 'none' } // This prevents the 5th "ghost" space on the right
        }} 
      />
    </Tab.Navigator>
  );
};

export default BottomTabs;