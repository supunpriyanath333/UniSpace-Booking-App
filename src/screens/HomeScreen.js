import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import GlobalStyles from "../styles/GlobalStyles";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* 🔶 Header */}
        <View style={styles.header}>
          <View style={styles.logoRow}>
            <Image
              source={require("../../assets/logo.png")}
              style={styles.logo}
            />
          </View>

          <Text style={styles.greeting}>Hii.. Supun !</Text>
          <Text style={styles.subGreeting}>
            Book your space with UniSpace..
          </Text>

          {/* 🔍 Search */}
          <View style={styles.searchBox}>
            <TextInput
              placeholder="Search"
              style={styles.searchInput}
            />
            <Ionicons name="mic" size={20} color="#000" />
            <Ionicons
              name="search"
              size={20}
              color="#000"
              style={{ marginLeft: 10 }}
            />
          </View>
        </View>

        {/* 🔶 Quick Actions */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>

        <ActionCard
          icon="home-outline"
          title="Book a Room"
          subtitle="Reserve your space now"
        />

        <ActionCard
          icon="calendar-outline"
          title="Check Availability"
          subtitle="View room availability instantly"
        />

        <ActionCard
          icon="clipboard-outline"
          title="My Bookings"
          subtitle="Manage your reservations"
        />

        {/* 🔶 Why UniSpace */}
        <Text style={styles.sectionTitle}>Why UniSpace?</Text>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Ionicons name="business-outline" size={30} />
            <Text style={styles.statTitle}>150+</Text>
            <Text style={styles.statText}>Halls and Rooms</Text>
          </View>

          <View style={styles.statCard}>
            <Ionicons name="people-outline" size={30} />
            <Text style={styles.statTitle}>10k+</Text>
            <Text style={styles.statText}>Total Capacity</Text>
          </View>
        </View>
      </ScrollView>

      {/* 🔶 Bottom Navigation */}
      <View style={styles.bottomNav}>
        <Ionicons name="home" size={24} color="red" />
        <Ionicons name="clipboard-outline" size={24} />
        <Ionicons name="person-outline" size={24} />
        <Ionicons name="calendar-outline" size={24} />
      </View>
    </View>
  );
}

/* 🔹 Reusable Action Card */
function ActionCard({ icon, title, subtitle }) {
  return (
    <TouchableOpacity style={styles.actionCard}>
      <Ionicons name={icon} size={32} />
      <View style={{ flex: 1, marginLeft: 15 }}>
        <Text style={styles.actionTitle}>{title}</Text>
        <Text style={styles.actionSubtitle}>{subtitle}</Text>
      </View>
      <Ionicons name="arrow-forward" size={22} color="red" />
    </TouchableOpacity>
  );
}

/* 🟡 Page-level styles (Home only) */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f6f5f2",
  },

  header: {
    backgroundColor: "#FFF2A6",
    padding: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },

  logoRow: {
    alignItems: "flex-start",
  },

  logo: {
    width: 160,
    height: 60,
    resizeMode: "contain",
  },

  greeting: {
    fontSize: 22,
    fontWeight: "700",
    marginTop: 10,
  },

  subGreeting: {
    fontSize: 14,
    color: "#555",
    marginBottom: 15,
  },

  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 30,
    paddingHorizontal: 15,
    borderColor: "#040404",
    borderWidth: 1,
    height: 45,
  },

  searchInput: {
    flex: 1,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 10,
  },

  actionCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF2A6",
    marginHorizontal: 20,
    padding: 15,
    borderRadius: 14,
    borderColor: "#040404",
    borderWidth: 1,
    marginBottom: 12,
  },

  actionTitle: {
    fontSize: 16,
    fontWeight: "700",
  },

  actionSubtitle: {
    fontSize: 13,
    color: "#555",
  },

  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 20,
    marginBottom: 20,
  },

  statCard: {
    width: "48%",
    backgroundColor: "#FFF",
    borderRadius: 14,
    padding: 15,
    borderColor: "#040404",
    borderWidth: 1,
    alignItems: "center",
  },

  statTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginTop: 5,
  },

  statText: {
    fontSize: 13,
    color: "#555",
  },

  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 12,
    borderTopWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#FFF2A6",
  },
});
