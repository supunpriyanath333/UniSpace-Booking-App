import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  ActivityIndicator,
  Alert 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

// Firebase
import { db } from '../firebase/firebaseConfig';
import { collection, query, where, onSnapshot, doc, deleteDoc } from 'firebase/firestore';

// Custom Config
import colors from '../constants/colors';
import { GlobalStyles } from '../styles/GlobalStyles';

const CurrentBookings = ({ navigation }) => {
  const [bookedHalls, setBookedHalls] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Only fetch bookings that are already approved
    const q = query(
      collection(db, 'bookings'), 
      where('status', '==', 'Approved')
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      
      // Sort manually if createdAt is not yet indexed or available
      const sortedData = data.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
      setBookedHalls(sortedData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleDelete = (id, eventName) => {
    Alert.alert(
      "Cancel Booking",
      `Are you sure you want to remove the booking for "${eventName}"? This cannot be undone.`,
      [
        { text: "No, Keep it", style: "cancel" },
        { 
          text: "Yes, Cancel", 
          style: "destructive", 
          onPress: async () => {
            try {
              await deleteDoc(doc(db, 'bookings', id));
            } catch (error) {
              Alert.alert("Error", "Could not remove the booking record.");
            }
          } 
        }
      ]
    );
  };

  const renderBookingItem = ({ item }) => (
    <View style={styles.bookingCard}>
      <View style={styles.cardHeader}>
        <View style={styles.hallInfo}>
          <Text style={styles.hallLabel}>{item.hallName}</Text>
          <Text style={styles.locationText}>{item.location || 'Faculty Building'}</Text>
        </View>
        <View style={styles.approvedBadge}>
          <Ionicons name="checkmark-circle" size={14} color="#FFF" />
          <Text style={styles.approvedText}>BOOKED</Text>
        </View>
      </View>

      <View style={styles.divider} />

      <Text style={styles.eventTitle}>For {item.eventName}</Text>

      <View style={styles.detailsGrid}>
        <View style={styles.detailBox}>
          <Ionicons name="person" size={16} color={colors.primary} />
          <View style={styles.detailTextGroup}>
            <Text style={styles.detailLabel}>Lecturer</Text>
            <Text style={styles.detailValue}>{item.lecturerName}</Text>
          </View>
        </View>

        <View style={styles.detailBox}>
          <Ionicons name="calendar" size={16} color={colors.primary} />
          <View style={styles.detailTextGroup}>
            <Text style={styles.detailLabel}>Date</Text>
            <Text style={styles.detailValue}>{item.date}</Text>
          </View>
        </View>

        <View style={styles.detailBox}>
          <Ionicons name="time" size={16} color={colors.primary} />
          <View style={styles.detailTextGroup}>
            <Text style={styles.detailLabel}>Time Slot</Text>
            <Text style={styles.detailValue}>{item.startTime} - {item.endTime}</Text>
          </View>
        </View>

        <View style={styles.detailBox}>
          <Ionicons name="people" size={16} color={colors.primary} />
          <View style={styles.detailTextGroup}>
            <Text style={styles.detailLabel}>Expected</Text>
            <Text style={styles.detailValue}>{item.capacity} Students</Text>
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <View style={styles.contactInfo}>
          <Ionicons name="call" size={14} color={colors.gray} />
          <Text style={styles.contactText}>{item.contact}</Text>
        </View>
        
        <TouchableOpacity 
          style={styles.deleteBtn} 
          onPress={() => handleDelete(item.id, item.eventName)}
        >
          <Ionicons name="close-circle-outline" size={18} color={colors.primary} />
          <Text style={styles.deleteText}>Cancel Booking</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={GlobalStyles.container}>
      <StatusBar style="dark" backgroundColor={colors.secondary} />
      
      {/* GLOBAL HEADER */}
      <View style={GlobalStyles.headerWrapper}>
        <View style={GlobalStyles.headerSection}>
          <View style={GlobalStyles.headerTopRow}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={30} color={colors.black} />
            </TouchableOpacity>
            
            <Text style={GlobalStyles.headerTitle}>Approved Bookings</Text>
            
            <View style={{ width: 30 }} /> 
          </View>
        </View>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={bookedHalls}
          renderItem={renderBookingItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Ionicons name="calendar-outline" size={80} color="#CCC" />
              <Text style={styles.emptyText}>No approved bookings found.</Text>
            </View>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  listContent: { padding: 15, paddingBottom: 30 },
  bookingCard: { 
    backgroundColor: colors.white, 
    borderRadius: 20, 
    padding: 18, 
    marginBottom: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    borderWidth: 1,
    borderColor: '#F0F0F0'
  },
  cardHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    marginBottom: 12
  },
  hallLabel: { fontSize: 15, fontWeight: 'bold', color: colors.black, textTransform: 'uppercase' },
  locationText: { fontSize: 12, color: colors.gray },
  approvedBadge: { 
    backgroundColor: '#4CAF50', 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingHorizontal: 10, 
    paddingVertical: 5, 
    borderRadius: 12 
  },
  approvedText: { color: '#FFF', fontSize: 10, fontWeight: 'bold', marginLeft: 4 },
  divider: { height: 1, backgroundColor: '#EEE', marginBottom: 15 },
  eventTitle: { fontSize: 18, fontWeight: 'bold', color: colors.black, marginBottom: 15 },
  detailsGrid: { flexDirection: 'row', flexWrap: 'wrap', rowGap: 15 },
  detailBox: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    width: '50%', 
  },
  detailTextGroup: { marginLeft: 10 },
  detailLabel: { fontSize: 10, color: colors.gray, textTransform: 'uppercase', letterSpacing: 0.5 },
  detailValue: { fontSize: 13, fontWeight: '600', color: '#333' },
  footer: { 
    marginTop: 15, 
    paddingTop: 15, 
    borderTopWidth: 1, 
    borderTopColor: '#F0F0F0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  contactInfo: { flexDirection: 'row', alignItems: 'center' },
  contactText: { fontSize: 13, color: colors.gray, marginLeft: 6 },
  deleteBtn: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#FFF1F0', 
    paddingHorizontal: 12, 
    paddingVertical: 6, 
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.primary + '20'
  },
  deleteText: { color: colors.primary, fontSize: 12, fontWeight: 'bold', marginLeft: 6 },
  emptyState: { alignItems: 'center', marginTop: 100 },
  emptyText: { color: colors.gray, marginTop: 10, fontSize: 16 }
});

export default CurrentBookings;