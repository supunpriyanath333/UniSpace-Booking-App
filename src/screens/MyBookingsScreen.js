import React, { useState, useEffect } from 'react';
import { 
  View, Text, StyleSheet, ScrollView, TouchableOpacity, 
  ActivityIndicator, Alert 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

// Firebase Imports
import { db, auth } from '../firebase/firebaseConfig';
import { collection, query, where, onSnapshot, deleteDoc, doc } from 'firebase/firestore';

// Custom Components
import { GlobalStyles } from '../styles/GlobalStyles';
import HamburgerMenu from '../components/HamburgerMenu';
import BookingCard from '../components/BookingCard'; // Using your component

const MyBookingsScreen = ({ navigation }) => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    // Real-time listener for current user's bookings
    const q = query(collection(db, 'bookings'), where('userId', '==', user.uid));
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const bookingsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setBookings(bookingsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleCancel = (bookingId) => {
    Alert.alert(
      "Cancel Booking",
      "Are you sure you want to cancel this booking?",
      [
        { text: "No", style: "cancel" },
        { 
          text: "Yes", 
          style: "destructive", 
          onPress: async () => {
            try {
              await deleteDoc(doc(db, 'bookings', bookingId));
            } catch (error) {
              Alert.alert("Error", "Could not cancel booking.");
            }
          } 
        }
      ]
    );
  };

  const filteredBookings = bookings.filter(b => 
    activeFilter === 'All' ? true : b.status === activeFilter
  );

  return (
    <View style={GlobalStyles.container}>
      <StatusBar style="dark" backgroundColor="#F9EDB3" />
      <HamburgerMenu visible={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      {/* GLOBAL HEADER - Logic from your other pages */}
      <View style={GlobalStyles.headerWrapper}>
        <SafeAreaView edges={['top']} style={GlobalStyles.headerSection}>
          <View style={GlobalStyles.headerTopRow}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={30} color="black" />
            </TouchableOpacity>
            <Text style={GlobalStyles.headerTitle}>My Bookings</Text>
            <TouchableOpacity onPress={() => setIsMenuOpen(true)}>
              <Ionicons name="menu" size={38} color="black" />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>

      {/* FILTER ROW */}
      <View style={styles.filterRow}>
        {['All', 'Pending', 'Approved'].map((label) => {
          const count = label === 'All' ? bookings.length : bookings.filter(b => b.status === label).length;
          return (
            <TouchableOpacity 
              key={label}
              style={[styles.filterBtn, activeFilter === label && styles.activeFilterBtn]} 
              onPress={() => setActiveFilter(label)}
            >
              <Text style={styles.filterText}>{label} ({count})</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <ScrollView contentContainerStyle={styles.scrollBody} showsVerticalScrollIndicator={false}>
        {loading ? (
          <ActivityIndicator size="large" color="#D32F2F" style={{ marginTop: 50 }} />
        ) : (
          filteredBookings.map((item) => (
            <BookingCard 
              key={item.id}
              hallName={item.hallName}
              location={item.location}
              date={item.date}
              time={`${item.startTime} - ${item.endTime}`}
              subject={item.eventName}
              students={item.capacity}
              status={item.status}
              onCancel={() => handleCancel(item.id)}
            />
          ))
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  filterRow: { 
    flexDirection: 'row', 
    padding: 15, 
    justifyContent: 'space-around', 
    backgroundColor: '#FFF' 
  },
  filterBtn: { 
    paddingVertical: 6, 
    paddingHorizontal: 15, 
    borderRadius: 20, 
    borderWidth: 1, 
    borderColor: '#000' 
  },
  activeFilterBtn: { backgroundColor: '#F9EDB3' },
  filterText: { fontWeight: 'bold', fontSize: 14 },
  scrollBody: { paddingHorizontal: 15, paddingBottom: 30 }
});

export default MyBookingsScreen;