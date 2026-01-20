import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import BottomTabs from "./BottomTabs";
import HamburgerMenu from "../components/HamburgerMenu";

const Stack = createNativeStackNavigator();

export default function MainNavigator() {
  return (
    <Stack.Navigator
      screenOptions={({ navigation }) => ({
        headerTitleAlign: "center",
        headerRight: () => (
          <HamburgerMenu onPress={() => navigation.openDrawer?.()} />
        ),
      })}
    >
      <Stack.Screen
        name="MainTabs"
        component={BottomTabs}
        options={{ headerTitle: "UniSpace" }}
      />
    </Stack.Navigator>
  );
}
