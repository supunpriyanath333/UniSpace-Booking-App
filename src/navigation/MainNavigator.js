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

// Admin Screen Imports (From your new folder)
import AdminDashboard from '../AdminScreens/AdminDashboard';
import AdminRequests from '../AdminScreens/AdminRequests';
import ManageHalls from '../AdminScreens/ManageHalls';
import AddHall from '../AdminScreens/AddHall';
import AdminHistory from '../AdminScreens/AdminHistory';

const Stack = createNativeStackNavigator();

const MainNavigator = () => {
  // Destructure userToken and userEmail from AuthContext
  const { userToken, userEmail } = useContext(AuthContext);

  // 1. If not logged in, show Auth flow
  if (userToken == null) return <AuthNavigator />;

  // 2. Define the Admin Email
  const ADMIN_EMAIL = 'admin@hallbook.com';

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {userEmail === ADMIN_EMAIL ? (
        // --- ADMIN STACK ---
        <>
          <Stack.Screen name="AdminDashboard" component={AdminDashboard} />
          <Stack.Screen name="AdminRequests" component={AdminRequests} />
          <Stack.Screen name="ManageHalls" component={ManageHalls} />
          <Stack.Screen name="AddHall" component={AddHall} />
          <Stack.Screen name="AdminHistory" component={AdminHistory} />
          {/* Admin might still need to see their profile */}
          <Stack.Screen name="Profile" component={ProfileScreen} />
        </>
      ) : (
        // --- USER STACK ---
        <>
          <Stack.Screen name="MainTabs" component={BottomTabs} />
          <Stack.Screen name="AllHalls" component={AllHallsScreen} /> 
          <Stack.Screen name="CheckAvailability" component={CheckAvailabilityScreen} />
          <Stack.Screen name="BookingForm" component={BookingForm} />
          <Stack.Screen name="Profile" component={ProfileScreen} />
          <Stack.Screen name="Notifications" component={NotificationsScreen} />
        </>
      )}
    </Stack.Navigator>
  );
};

export default MainNavigator;