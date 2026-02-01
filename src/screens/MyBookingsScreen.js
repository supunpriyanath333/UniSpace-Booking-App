import React, { useState, useEffect } from 'react';
import { 
  View, Text, StyleSheet, ScrollView, TouchableOpacity, 
  ActivityIndicator, Alert 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

// Firebase Imports
import { db, auth } from '../firebase/firebaseConfig';
import { 
  collection, query, where, onSnapshot, deleteDoc, doc, 
  addDoc, serverTimestamp, getDocs 
} from 'firebase/firestore';

// Custom Configuration
import colors from '../constants/colors';
import { GlobalStyles } from '../styles/GlobalStyles';
import HamburgerMenu from '../components/HamburgerMenu';
import BookingCard from '../components/BookingCard';

const MyBookingsScreen = ({ navigation }) => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const q = query(collection(db, 'bookings'), where('userId', '==', user.uid));
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const bookingsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setBookings(bookingsData);
      setLoading(false);
      
      // Trigger reminder check whenever bookings update
      checkAndSendReminders(bookingsData, user.uid);
    });

    return () => unsubscribe();
  }, []);

  // Helper: Send Notification
  const sendNotification = async (userId, type, title, message) => {
    try {
      await addDoc(collection(db, 'notifications'), {
        userId,
        type,
        title,
        message,
        isRead: false,
        createdAt: serverTimestamp(),
      });
    } catch (e) { console.error("Notify Error:", e); }
  };

  // Logic: Automatic 24h Reminder Check
  const checkAndSendReminders = async (allBookings, userId) => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = `${tomorrow.getDate().toString().padStart(2, '0')}/${(tomorrow.getMonth() + 1).toString().padStart(2, '0')}/${tomorrow.getFullYear()}`;

    const upcoming = allBookings.filter(b => b.date === tomorrowStr && b.status === 'Approved');

    for (const booking of upcoming) {
      // Check if reminder already exists to avoid duplicates
      const q = query(
        collection(db, 'notifications'), 
        where('userId', '==', userId), 
        where('type', '==', 'Reminder'),
        where('bookingId', '==', booking.id) // We'll store bookingId to track
      );
      const snap = await getDocs(q);
      
      if (snap.empty) {
        await addDoc(collection(db, 'notifications'), {
            userId,
            type: 'Reminder',
            title: 'Upcoming Booking Reminder',
            message: `Reminder: You have a booking for ${booking.hallName} tomorrow (${booking.date}) at ${booking.startTime}.`,
            bookingId: booking.id,
            isRead: false,
            createdAt: serverTimestamp()
        });
      }
    }
  };

  const handleCancel = (booking) => {
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
              // 1. Send Automatic "Cancelled" Notification
              await sendNotification(
                auth.currentUser.uid,
                'Cancelled',
                'Booking Cancelled',
                `You have cancelled your booking for ${booking.hallName} on ${booking.date}.`
              );

              // 2. Delete the Document
              await deleteDoc(doc(db, 'bookings', booking.id));
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
      <StatusBar style="dark" backgroundColor={colors.secondary} translucent={true} />
      <HamburgerMenu visible={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      <View style={GlobalStyles.headerWrapper}>
        <View style={GlobalStyles.headerSection}>
          <View style={GlobalStyles.headerTopRow}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={30} color={colors.black} />
            </TouchableOpacity>
            <Text style={GlobalStyles.headerTitle}>My Bookings</Text>
            <TouchableOpacity onPress={() => setIsMenuOpen(true)}>
              <Ionicons name="menu" size={38} color={colors.black} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={styles.filterRow}>
        {['All', 'Pending', 'Approved'].map((label) => {
          const count = label === 'All' 
            ? bookings.length 
            : bookings.filter(b => b.status === label).length;
          const isActive = activeFilter === label;

          return (
            <TouchableOpacity 
              key={label}
              style={[
                styles.filterBtn, 
                isActive && { backgroundColor: colors.secondary, borderColor: colors.black }
              ]} 
              onPress={() => setActiveFilter(label)}
            >
              <Text style={[styles.filterText, isActive && { color: colors.black }]}>
                {label} ({count})
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <ScrollView contentContainerStyle={styles.scrollBody} showsVerticalScrollIndicator={false}>
        {loading ? (
          <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 50 }} />
        ) : filteredBookings.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="calendar-outline" size={80} color="#DDD" />
            <Text style={styles.emptyText}>No {activeFilter !== 'All' ? activeFilter : ''} bookings found.</Text>
          </View>
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
              onCancel={() => handleCancel(item)} // Pass full item now
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
    paddingVertical: 15,
    paddingHorizontal: 10,
    justifyContent: 'space-around', 
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderColor: '#EEE'
  },
  filterBtn: { 
    paddingVertical: 8, 
    paddingHorizontal: 16, 
    borderRadius: 20, 
    borderWidth: 1, 
    borderColor: colors.gray 
  },
  filterText: { 
    fontWeight: 'bold', 
    fontSize: 13,
    color: colors.text
  },
  scrollBody: { 
    paddingHorizontal: 15, 
    paddingTop: 15,
    paddingBottom: 110 
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 100,
  },
  emptyText: {
    marginTop: 10,
    fontSize: 16,
    color: colors.gray,
    fontWeight: '600'
  }
});

export default MyBookingsScreen;