import React, { useState, useEffect, useContext } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  SafeAreaView,
  Dimensions,
  Alert,
  Image 
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
    // Listen for Pending Bookings
    const qPending = query(collection(db, 'bookings'), where('status', '==', 'Pending'));
    const unsubPending = onSnapshot(qPending, (snap) => {
      setStats(prev => ({ ...prev, pending: snap.size }));
    });

    // Listen for Total Halls
    const unsubHalls = onSnapshot(collection(db, 'halls'), (snap) => {
      setStats(prev => ({ ...prev, totalHalls: snap.size }));
    });

    // Listen for Approved Bookings
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
      title: 'Current Bookings', 
      desc: 'View Active Schedules', 
      icon: 'calendar', 
      screen: 'CurrentBookings', 
      color: '#9C27B0' 
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
            <View style={styles.textContainer}>
              {/* UPDATED: Welcome Text with Colored Brand Name */}
              <Text style={styles.welcomeText}>
                Welcome to <Text style={styles.redText}>Uni</Text>
                <Text style={styles.yellowText}>Space</Text> Administrator
              </Text>
              
              {/* UPDATED: Slogan with Colored Brand Name */}
              <Text style={styles.sloganText}>
                <Text style={styles.redText}>Uni</Text>
                <Text style={styles.yellowText}>Space</Text> System Control Dashboard
              </Text>
            </View>
            
            <Image 
              source={require('../../assets/logo 1.png')} 
              style={styles.logoImage}
              resizeMode="contain"
            />
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
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    borderColor: '#1b1515',
    borderBottomWidth: 0.5,
    borderWidth: 0.5,
    marginBottom: 10
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 45,
  },
  textContainer: { flex: 1, paddingRight: 10 },
  
  // Font Styles
  welcomeText: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    color: colors.black,
    lineHeight: 26 
  },
  sloganText: { 
    fontSize: 14, 
    color: '#666', 
    marginTop: 4,
    fontWeight: '600' 
  },
  
  // Brand Colors
  redText: { color: colors.primary },
  yellowText: { color: '#907911' },

  logoImage: {
    width: 120,
    height: 40,
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
  grid: { marginBottom: 30 },
  actionCard: {
    backgroundColor: colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#EEE',
    elevation: 2,
    marginBottom: 15,
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