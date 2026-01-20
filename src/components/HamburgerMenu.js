import React from "react";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function HamburgerMenu({ onPress }) {
  return (
    <TouchableOpacity onPress={onPress} style={{ marginRight: 15 }}>
      <Ionicons name="menu-outline" size={28} color="#000" />
    </TouchableOpacity>
  );
}
