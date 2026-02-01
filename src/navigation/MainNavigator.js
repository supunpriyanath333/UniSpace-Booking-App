import React, { useContext } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthContext } from '../context/AuthContext';

// Navigators
import AuthNavigator from './AuthNavigator';
import BottomTabs from './BottomTabs';

// User Screen Imports
import AllHallsScreen from '../screens/AllHallsScreen'; 
import BookingForm from '../screens/BookingForm'; 
import CheckAvailabilityScreen from '../screens/CheckAvailabilityScreen';
import ProfileScreen from '../screens/ProfileScreen';
import NotificationsScreen from '../screens/NotificationsScreen';

// Admin Screen Imports
import AdminDashboard from '../AdminScreens/AdminDashboard';
import AdminRequests from '../AdminScreens/AdminRequests';
import ManageHalls from '../AdminScreens/ManageHalls';
import AddHall from '../AdminScreens/AddHall';
import CurrentBookings from '../AdminScreens/CurrentBookings';

const Stack = createNativeStackNavigator();

const MainNavigator = () => {
  const { userToken, userEmail } = useContext(AuthContext);

  if (userToken == null) return <AuthNavigator />;

  const ADMIN_EMAIL = 'admin@hallbook.com';

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {userEmail === ADMIN_EMAIL ? (
        <Stack.Group>
          <Stack.Screen name="AdminDashboard" component={AdminDashboard} />
          <Stack.Screen name="AdminRequests" component={AdminRequests} />
          <Stack.Screen name="CurrentBookings" component={CurrentBookings} />
          <Stack.Screen name="ManageHalls" component={ManageHalls} />
          <Stack.Screen name="AddHall" component={AddHall} />
          <Stack.Screen name="Profile" component={ProfileScreen} />
        </Stack.Group>
      ) : (
        <Stack.Group>
          <Stack.Screen name="MainTabs" component={BottomTabs} />
          <Stack.Screen name="AllHalls" component={AllHallsScreen} /> 
          <Stack.Screen name="CheckAvailability" component={CheckAvailabilityScreen} />
          <Stack.Screen name="BookingForm" component={BookingForm} />
          <Stack.Screen name="Profile" component={ProfileScreen} />
          <Stack.Screen name="Notifications" component={NotificationsScreen} />
        </Stack.Group>
      )}
    </Stack.Navigator>
  );
};

export default MainNavigator;