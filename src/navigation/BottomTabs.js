import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet } from "react-native";

import HomeScreen from "../screens/HomeScreen";
import MyBookingsScreen from "../screens/MyBookingsScreen";
import CheckAvailabilityScreen from "../screens/CheckAvailabilityScreen";
import ProfileScreen from "../screens/ProfileScreen";

const Tab = createBottomTabNavigator();

export default function BottomTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: styles.tabBar,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Home") iconName = "home";
          if (route.name === "Bookings") iconName = "clipboard";
          if (route.name === "Availability") iconName = "calendar";
          if (route.name === "Profile") iconName = "person";

          return (
            <Ionicons
              name={iconName}
              size={24}
              color={focused ? "red" : "#555"}
            />
          );
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Bookings" component={MyBookingsScreen} />
      <Tab.Screen name="Availability" component={CheckAvailabilityScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: "#FFF2A6",
    height: 60,
    borderTopWidth: 1,
    borderTopColor: "#ccc",
  },
});
