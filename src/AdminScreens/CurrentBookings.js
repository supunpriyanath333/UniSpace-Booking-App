import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  ActivityIndicator 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

// Firebase
import { db } from '../firebase/firebaseConfig';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';

// Custom Config
import colors from '../constants/colors';
import { GlobalStyles } from '../styles/GlobalStyles';

const CurrentBookings = ({ navigation }) => {
  const [bookedHalls, setBookedHalls] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Querying only 'Approved' bookings, ordered by the date they were created
    const q = query(
      collection(db, 'bookings'), 
      where('status', '==', 'Approved')
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      
      // Sorting manually in case Firestore index isn't ready for orderBy
      const sortedData = data.sort((a, b) => b.createdAt - a.createdAt);
      
      setBookedHalls(sortedData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const renderBookingItem = ({ item }) => (
    <View style={styles.bookingCard}>
      <View style={styles.cardHeader}>
        <View style={styles.hallInfo}>
          <Text style={styles.hallLabel}>{item.hallName}</Text>
          <Text style={styles.locationText}>{item.location}</Text>
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
        <Ionicons name="call-outline" size={14} color={colors.primary} />
        <Text style={styles.contactText}>Contact: {item.contact}</Text>
      </View>
    </View>
  );

  return (
    <View style={GlobalStyles.container}>
      <StatusBar style="dark" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={28} color={colors.black} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Approved Bookings</Text>
        <View style={{ width: 28 }} /> 
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
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingHorizontal: 20, 
    paddingTop: 60, 
    paddingBottom: 20,
    backgroundColor: colors.secondary 
  },
  headerTitle: { fontSize: 20, fontWeight: 'bold' },
  listContent: { padding: 15 },
  bookingCard: { 
    backgroundColor: '#FFF', 
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
  hallLabel: { fontSize: 14, fontWeight: 'bold', color: colors.black, textTransform: 'uppercase' },
  locationText: { fontSize: 11, color: '#757373' },
  approvedBadge: { 
    backgroundColor: '#4CAF50', 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingHorizontal: 10, 
    paddingVertical: 4, 
    borderRadius: 12 
  },
  approvedText: { color: '#FFF', fontSize: 10, fontWeight: 'bold', marginLeft: 4 },
  divider: { height: 1, backgroundColor: '#716d6d', marginBottom: 10 },
  eventTitle: { fontSize: 16, fontWeight: 'bold', color: colors.black, marginBottom: 15 },
  detailsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 15 },
  detailBox: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    width: '45%', 
    marginBottom: 10 
  },
  detailTextGroup: { marginLeft: 10 },
  detailLabel: { fontSize: 10, color: '#999', textTransform: 'uppercase' },
  detailValue: { fontSize: 12, fontWeight: '600', color: '#444' },
  footer: { 
    marginTop: 10, 
    paddingTop: 10, 
    borderTopWidth: 1, 
    borderTopColor: '#9a9595',
    flexDirection: 'row',
    alignItems: 'center'
  },
  contactText: { fontSize: 12, color: colors.gray, marginLeft: 5 },
  emptyState: { alignItems: 'center', marginTop: 100 },
  emptyText: { color: colors.gray, marginTop: 10, fontSize: 16 }
});

export default CurrentBookings;