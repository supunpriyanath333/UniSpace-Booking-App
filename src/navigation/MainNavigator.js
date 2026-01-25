import React, { useContext } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthContext } from '../context/AuthContext';
import AuthNavigator from './AuthNavigator';
import BottomTabs from './BottomTabs';
import AllHallsScreen from '../screens/AllHallsScreen'; // Hidden from tabs

const Stack = createNativeStackNavigator();

const MainNavigator = () => {
  const { userToken } = useContext(AuthContext);

  if (userToken == null) return <AuthNavigator />;

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs" component={BottomTabs} />
      <Stack.Screen name="AllHalls" component={AllHallsScreen} /> 
    </Stack.Navigator>
  );
};

export default MainNavigator;