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
        tabBarIconStyle: { 
          width: '100%',
          alignItems: 'center',
          justifyContent: 'center',
        },
        tabBarItemStyle: { 
          justifyContent: 'center',
          height: 65,
        },
        tabBarStyle: {
          backgroundColor: '#F9EDB3',
          height: 55,
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: width,

          // --- ANDROID SPECIFIC BORDER EFFECT ---
          borderTopWidth: 2,           // Thick top border for definition
          borderLeftWidth: 1,
          borderRightWidth: 1,
          borderColor: '#a7a2a2',         // Solid black outline
          borderTopEndRadius: 20,      // Rounded top corners
          borderTopStartRadius: 20,
          
          // ANDROID ELEVATION (Shadow)
          elevation: 15,               // High value for a strong depth effect
          // --------------------------------------

          paddingBottom: 0,
        },
        tabBarIcon: ({ focused, color }) => {
          let iconName;
          if (route.name === 'Home') iconName = focused ? 'home' : 'home-outline';
          else if (route.name === 'MyBookings') iconName = focused ? 'clipboard' : 'clipboard-outline';
          else if (route.name === 'Profile') iconName = focused ? 'person' : 'person-outline';
          else if (route.name === 'CheckAvailability') iconName = focused ? 'calendar' : 'calendar-outline';
          
          return <Ionicons name={iconName} size={28} color={color} />;
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
          tabBarItemStyle: { display: 'none' } 
        }} 
      />
    </Tab.Navigator>
  );
};

export default BottomTabs;