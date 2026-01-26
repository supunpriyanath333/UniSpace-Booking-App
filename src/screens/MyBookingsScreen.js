import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  SafeAreaView, 
  ActivityIndicator, 
  Alert 
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

// Firebase Imports
import { db, auth } from '../firebase/firebaseConfig';
import { collection, query, where, onSnapshot, deleteDoc, doc } from 'firebase/firestore';

// Custom Components
import { GlobalStyles } from '../styles/GlobalStyles';
import BookingCard from '../components/BookingCard';
import HamburgerMenu from '../components/HamburgerMenu';

const MyBookingsScreen = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('All');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // State for Real Data
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Fetch Data from Firebase
  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      setLoading(false);
      return;
    }

    const q = query(collection(db, 'bookings'), where("userId", "==", user.uid));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedBookings = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setBookings(fetchedBookings);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching bookings:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // 2. Calculate Counts
  const allCount = bookings.length;
  const pendingCount = bookings.filter(b => b.status === 'Pending').length;
  const approvedCount = bookings.filter(b => b.status === 'Approved').length;

  // 3. Filter Data and Empty Message Logic
  const filteredBookings = bookings.filter(b => {
    if (activeTab === 'Pending') return b.status === 'Pending';
    if (activeTab === 'Approved') return b.status === 'Approved';
    return true; // 'All'
  });

  const getEmptyMessage = () => {
    if (activeTab === 'Pending') return "You have no pending booking requests.";
    if (activeTab === 'Approved') return "You don't have any approved bookings yet.";
    return "You haven't made any bookings yet.";
  };

  // 4. Handle Cancel
  const handleCancel = (bookingId) => {
    Alert.alert(
      "Cancel Booking",
      "Are you sure you want to cancel this reservation?",
      [
        { text: "No", style: "cancel" },
        { 
          text: "Yes, Cancel", 
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteDoc(doc(db, "bookings", bookingId));
            } catch (error) {
              Alert.alert("Error", "Could not cancel booking.");
            }
          }
        }
      ]
    );
  };

  return (
    <View style={GlobalStyles.container}>
      <StatusBar style="dark" backgroundColor="#F9EDB3" translucent={true} />
      
      <HamburgerMenu visible={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      {/* Header */}
      <View style={GlobalStyles.headerWrapper}>
        <SafeAreaView edges={['top']}>
          <View style={GlobalStyles.headerSection}>
            <View style={GlobalStyles.headerTopRow}>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Ionicons name="arrow-back" size={30} color="black" />
              </TouchableOpacity>
              <Text style={GlobalStyles.headerTitle}>My Bookings</Text>
              <TouchableOpacity onPress={() => setIsMenuOpen(true)}>
                <Ionicons name="menu" size={38} color="black" />
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* Tab Filters */}
        <View style={styles.tabContainer}>
          {[
            { label: 'All', count: allCount },
            { label: 'Pending', count: pendingCount },
            { label: 'Approved', count: approvedCount }
          ].map((tab) => (
            <TouchableOpacity 
              key={tab.label}
              style={[styles.tab, activeTab === tab.label && styles.activeTab]}
              onPress={() => setActiveTab(tab.label)}
            >
              <Text style={[styles.tabText, activeTab === tab.label && styles.activeTabText]}>
                {tab.label} ({tab.count})
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#DA291C" style={{ marginTop: 20 }} />
        ) : (
          <View>
            {/* Show specific message if the filtered list is empty */}
            {filteredBookings.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Ionicons name="information-circle-outline" size={50} color="#ccc" />
                <Text style={styles.emptyText}>{getEmptyMessage()}</Text>
                
                {activeTab === 'All' && (
                  <TouchableOpacity 
                    style={styles.bookNowLink} 
                    onPress={() => navigation.navigate('CheckAvailability')}
                  >
                    <Text style={styles.linkText}>Book a hall now</Text>
                  </TouchableOpacity>
                )}
              </View>
            ) : (
              // Show the list of cards
              filteredBookings.map((item) => (
                <BookingCard 
                  key={item.id}
                  hallName={item.hallName}
                  location={item.location}
                  date={item.date} 
                  time={`${item.startTime} hr - ${item.endTime} hr`} 
                  subject={item.eventName} 
                  students={item.capacity} 
                  status={item.status}
                  onCancel={() => handleCancel(item.id)}
                />
              ))
            )}
          </View>
        )}

      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  content: { padding: 20, paddingBottom: 100 },
  tabContainer: { flexDirection: 'row', marginBottom: 20, justifyContent: 'space-between' },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#000',
    backgroundColor: '#FFF',
    minWidth: '30%',
    alignItems: 'center'
  },
  activeTab: { backgroundColor: '#F9EDB3' },
  tabText: { fontWeight: 'bold', fontSize: 13, color: '#666' },
  activeTabText: { color: '#000' },
  
  // Empty State Styles
  emptyContainer: { 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginTop: 60,
    paddingHorizontal: 20
  },
  emptyText: { 
    textAlign: 'center', 
    color: '#999', 
    fontSize: 16, 
    marginTop: 10,
    lineHeight: 22
  },
  bookNowLink: { marginTop: 15 },
  linkText: { color: '#DA291C', fontWeight: 'bold', fontSize: 16, textDecorationLine: 'underline' }
});

export default MyBookingsScreen;