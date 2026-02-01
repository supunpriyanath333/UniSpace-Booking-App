import React, { useState, useEffect, useContext } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  SafeAreaView,
  Dimensions,
  Alert 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

// Firebase
import { db } from '../firebase/firebaseConfig';
import { collection, onSnapshot, query, where } from 'firebase/firestore';

// Context & Components
import { AuthContext } from '../context/AuthContext';
import Button from '../components/Button'; 

// Custom Config
import colors from '../constants/colors';
import { GlobalStyles } from '../styles/GlobalStyles';

const { width } = Dimensions.get('window');

const AdminDashboard = ({ navigation }) => {
  const { logout } = useContext(AuthContext);
  const [stats, setStats] = useState({
    pending: 0,
    totalHalls: 0,
    totalBookings: 0
  });

  useEffect(() => {
    // UPDATED: Matches your "Pending" capitalization in Firestore
    const qPending = query(collection(db, 'bookings'), where('status', '==', 'Pending'));
    const unsubPending = onSnapshot(qPending, (snap) => {
      setStats(prev => ({ ...prev, pending: snap.size }));
    });

    const unsubHalls = onSnapshot(collection(db, 'halls'), (snap) => {
      setStats(prev => ({ ...prev, totalHalls: snap.size }));
    });

    // Count only Approved bookings for the "Total Booked" stat
    const qApproved = query(collection(db, 'bookings'), where('status', '==', 'Approved'));
    const unsubTotal = onSnapshot(qApproved, (snap) => {
      setStats(prev => ({ ...prev, totalBookings: snap.size }));
    });

    return () => {
      unsubPending();
      unsubHalls();
      unsubTotal();
    };
  }, []);

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to log out from the Admin Panel?", [
      { text: "Cancel", style: "cancel" },
      { text: "Logout", style: "destructive", onPress: () => logout() }
    ]);
  };

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
      title: 'Current Bookings', // UPDATED
      desc: 'View Active Schedules', // UPDATED
      icon: 'calendar', // UPDATED
      screen: 'CurrentBookings', // UPDATED to match your new screen
      color: '#9C27B0' // Purple color for distinction
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
  ];

  return (
    <View style={GlobalStyles.container}>
      <StatusBar style="dark" />
      
      <View style={styles.header}>
        <SafeAreaView>
          <View style={styles.headerContent}>
            <View>
              <Text style={styles.welcomeText}>System Control,</Text>
              <Text style={styles.adminName}>Administrator</Text>
            </View>
            <View style={styles.iconCircleHeader}>
                <Ionicons name="shield-checkmark" size={35} color={colors.black} />
            </View>
          </View>
        </SafeAreaView>
      </View>

      <ScrollView contentContainerStyle={styles.scrollBody} showsVerticalScrollIndicator={false}>
        
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
            <Text style={styles.statLabel}>Approved</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Management Console</Text>

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

        <View style={styles.logoutContainer}>
            <Button 
                title="Log out" 
                onPress={handleLogout} 
                style={styles.logoutBtnStyle}
            />
            <Text style={styles.versionText}>v1.0.5 - Admin Portal</Text>
        </View>

      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.secondary,
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
  iconCircleHeader: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  scrollBody: { padding: 20, paddingBottom: 40 },
  statsContainer: {
    flexDirection: 'row', 
    justifyContent: 'space-between',
    marginBottom: 30,
    marginTop: -15,
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
  grid: { gap: 15, marginBottom: 30 },
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
  arrow: { marginLeft: 5 },
  logoutContainer: {
    marginTop: 10,
    alignItems: 'center'
  },
  logoutBtnStyle: {
    width: '100%',
    backgroundColor: colors.primary 
  },
  versionText: {
    marginTop: 15,
    fontSize: 12,
    color: colors.gray
  }
});

export default AdminDashboard;