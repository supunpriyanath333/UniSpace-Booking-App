import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function DrawerContent({ navigation }) {
  return (
    <View style={styles.container}>
      {/* Profile */}
      <View style={styles.profileSection}>
        <Image
          source={{ uri: "https://i.pravatar.cc/300" }} // temp image
          style={styles.avatar}
        />
        <Text style={styles.name}>Supun Priyanath</Text>
      </View>

      {/* Menu Items */}
      <MenuItem icon="person-outline" label="Profile" />
      <MenuItem icon="accessibility-outline" label="Accessibility" />
      <MenuItem icon="information-circle-outline" label="About Us" />
      <MenuItem icon="settings-outline" label="Settings" />

      {/* Logout */}
      <TouchableOpacity style={styles.logoutBtn}>
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
}

function MenuItem({ icon, label }) {
  return (
    <TouchableOpacity style={styles.menuItem}>
      <Ionicons name={icon} size={22} />
      <Text style={styles.menuText}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 20,
  },

  profileSection: {
    alignItems: "center",
    marginBottom: 30,
  },

  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    marginBottom: 10,
  },

  name: {
    fontSize: 18,
    fontWeight: "700",
  },

  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
  },

  menuText: {
    fontSize: 16,
    marginLeft: 15,
    fontWeight: "500",
  },

  logoutBtn: {
    backgroundColor: "#d61f1f",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    marginTop: "auto",
    marginBottom: 30,
  },

  logoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});
