import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  SafeAreaView,
  Dimensions 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

// Firebase
import { db } from '../firebase/firebaseConfig';
import { collection, onSnapshot, query, where } from 'firebase/firestore';

// Custom Config
import colors from '../constants/colors';
import { GlobalStyles } from '../styles/GlobalStyles';

const { width } = Dimensions.get('window');

const AdminDashboard = ({ navigation }) => {
  const [stats, setStats] = useState({
    pending: 0,
    totalHalls: 0,
    totalBookings: 0
  });

  useEffect(() => {
    // Listen for Pending Bookings Count
    const qPending = query(collection(db, 'bookings'), where('status', '==', 'pending'));
    const unsubPending = onSnapshot(qPending, (snap) => {
      setStats(prev => ({ ...prev, pending: snap.size }));
    });

    // Listen for Total Halls Count
    const unsubHalls = onSnapshot(collection(db, 'halls'), (snap) => {
      setStats(prev => ({ ...prev, totalHalls: snap.size }));
    });

    // Listen for Total Bookings
    const unsubTotal = onSnapshot(collection(db, 'bookings'), (snap) => {
      setStats(prev => ({ ...prev, totalBookings: snap.size }));
    });

    return () => {
      unsubPending();
      unsubHalls();
      unsubTotal();
    };
  }, []);

  const adminActions = [
    { 
      title: 'Pending Requests', 
      desc: 'Approve or Decline', 
      icon: 'time', 
      screen: 'AdminRequests', 
      color: '#FF9800',
      badge: stats.pending 
    },
    { 
      title: 'Manage Halls', 
      desc: 'Availability & Delete', 
      icon: 'business', 
      screen: 'ManageHalls', 
      color: '#2196F3' 
    },
    { 
      title: 'Add New Hall', 
      desc: 'Expand System', 
      icon: 'add-circle', 
      screen: 'AddHall', 
      color: '#4CAF50' 
    },
    { 
      title: 'Booking History', 
      desc: 'All Past Records', 
      icon: 'list-circle', 
      screen: 'AdminHistory', 
      color: colors.gray 
    },
  ];

  return (
    <View style={GlobalStyles.container}>
      <StatusBar style="dark" />
      
      {/* Header Section */}
      <View style={styles.header}>
        <SafeAreaView>
          <View style={styles.headerContent}>
            <View>
              <Text style={styles.welcomeText}>Welcome back,</Text>
              <Text style={styles.adminName}>System Admin</Text>
            </View>
            <TouchableOpacity style={styles.profileBtn} onPress={() => navigation.navigate('Profile')}>
              <Ionicons name="person-circle" size={50} color={colors.black} />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>

      <ScrollView contentContainerStyle={styles.scrollBody} showsVerticalScrollIndicator={false}>
        
        {/* Quick Stats Overview */}
        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{stats.totalHalls}</Text>
            <Text style={styles.statLabel}>Total Halls</Text>
          </View>
          <View style={[styles.statBox, { borderColor: colors.secondary, borderWidth: 2 }]}>
            <Text style={[styles.statNumber, { color: colors.primary }]}>{stats.pending}</Text>
            <Text style={styles.statLabel}>New Requests</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{stats.totalBookings}</Text>
            <Text style={styles.statLabel}>Total Booked</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Management Console</Text>

        {/* Action Grid */}
        <View style={styles.grid}>
          {adminActions.map((item, index) => (
            <TouchableOpacity 
              key={index} 
              style={styles.actionCard}
              onPress={() => navigation.navigate(item.screen)}
            >
              <View style={[styles.iconCircle, { backgroundColor: item.color + '15' }]}>
                <Ionicons name={item.icon} size={30} color={item.color} />
              </View>
              
              <View style={styles.cardTextContent}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardDesc}>{item.desc}</Text>
              </View>

              {item.badge > 0 && (
                <View style={styles.cardBadge}>
                  <Text style={styles.badgeText}>{item.badge}</Text>
                </View>
              )}
              
              <Ionicons name="chevron-forward" size={20} color="#CCC" style={styles.arrow} />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.secondary, // Your brand yellow
    paddingHorizontal: 20,
    paddingBottom: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
  },
  welcomeText: { fontSize: 16, color: '#555' },
  adminName: { fontSize: 24, fontWeight: 'bold', color: colors.black },
  scrollBody: { padding: 20 },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
    marginTop: -15, // Lift stats slightly into the yellow header area
  },
  statBox: {
    backgroundColor: colors.white,
    width: (width - 60) / 3,
    padding: 15,
    borderRadius: 15,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  statNumber: { fontSize: 20, fontWeight: 'bold', color: colors.black },
  statLabel: { fontSize: 10, color: colors.gray, marginTop: 5, textAlign: 'center' },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15, color: colors.text },
  grid: { gap: 15 },
  actionCard: {
    backgroundColor: colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#EEE',
    elevation: 2,
  },
  iconCircle: {
    width: 55,
    height: 55,
    borderRadius: 27.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardTextContent: { flex: 1, marginLeft: 15 },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: colors.black },
  cardDesc: { fontSize: 12, color: colors.gray, marginTop: 2 },
  cardBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    marginRight: 10,
  },
  badgeText: { color: colors.white, fontSize: 12, fontWeight: 'bold' },
  arrow: { marginLeft: 5 }
});

export default AdminDashboard;