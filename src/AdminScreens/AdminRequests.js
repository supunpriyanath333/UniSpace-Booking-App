import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  Alert, 
  ActivityIndicator 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

// Firebase
import { db } from '../firebase/firebaseConfig';
import { collection, query, where, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore';

// Utils & Components
import colors from '../constants/colors';
import { GlobalStyles } from '../styles/GlobalStyles';

const AdminRequests = ({ navigation }) => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Matches "Pending" capitalization in your Firestore
    const q = query(collection(db, 'bookings'), where('status', '==', 'Pending'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setRequests(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleAction = async (item, actionType) => {
    const isApprove = actionType === 'Approve';
    
    Alert.alert(
      `${actionType} Request`,
      isApprove 
        ? `Approve this booking for ${item.hallName}?` 
        : `Decline and DELETE this request?`,
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: actionType, 
          style: isApprove ? "default" : "destructive",
          onPress: async () => {
            try {
              const bookingRef = doc(db, 'bookings', item.id);

              if (isApprove) {
                await updateDoc(bookingRef, { status: 'Approved' });
                Alert.alert("Success", "Booking approved successfully.");
              } else {
                await deleteDoc(bookingRef);
                Alert.alert("Deleted", "Request has been removed.");
              }

            } catch (error) {
              Alert.alert("Error", "Failed to process request.");
              console.error(error);
            }
          }
        }
      ]
    );
  };

  const renderRequestItem = ({ item }) => (
    <View style={styles.requestCard}>
      <View style={styles.cardHeader}>
        <View style={styles.hallInfo}>
          <Text style={styles.hallTitle}>{item.hallName}</Text>
          {/* Location displayed under Hall Name */}
          <Text style={styles.locationSubText}>{item.location}</Text>
        </View>
        <View style={styles.pendingBadge}>
          <Text style={styles.badgeText}>PENDING</Text>
        </View>
      </View>

      <View style={styles.divider} />

      <Text style={styles.eventTitle}>For {item.eventName}</Text>

      <View style={styles.detailsGrid}>
        <DetailItem icon="person-outline" label="Lecturer" value={item.lecturerName} />
        <DetailItem icon="calendar-outline" label="Date" value={item.date} />
        <DetailItem icon="time-outline" label="Time" value={`${item.startTime} - ${item.endTime}`} />
        <DetailItem icon="people-outline" label="Capacity" value={item.capacity} />
        <DetailItem icon="call-outline" label="Contact" value={item.contact} />
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity 
          style={[styles.actionBtn, styles.declineBtn]} 
          onPress={() => handleAction(item, 'Decline')}
        >
          <Ionicons name="trash-outline" size={20} color={colors.primary} />
          <Text style={styles.declineText}>Decline</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.actionBtn, styles.approveBtn]} 
          onPress={() => handleAction(item, 'Approve')}
        >
          <Ionicons name="checkmark-circle-outline" size={20} color="#FFF" />
          <Text style={styles.approveText}>Approve</Text>
        </TouchableOpacity>
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
        <Text style={styles.headerTitle}>Pending Requests</Text>
        <View style={{ width: 28 }} /> 
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={requests}
          renderItem={renderRequestItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Ionicons name="checkmark-done-circle-outline" size={80} color="#CCC" />
              <Text style={styles.emptyText}>No pending requests.</Text>
            </View>
          }
        />
      )}
    </View>
  );
};

const DetailItem = ({ icon, label, value }) => (
  <View style={styles.detailItem}>
    <Ionicons name={icon} size={14} color={colors.gray} />
    <Text style={styles.detailValue}>{value}</Text>
  </View>
);

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
  requestCard: { 
    backgroundColor: '#FFF', 
    borderRadius: 15, 
    padding: 15, 
    marginBottom: 15,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#EEE'
  },
  cardHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'flex-start',
    marginBottom: 5 
  },
  hallInfo: { flex: 1 },
  hallTitle: { fontSize: 15, fontWeight: 'bold', color: colors.black, textTransform: 'uppercase' },
  locationSubText: { fontSize: 11, color: colors.gray, marginTop: 2 },
  divider: { height: 1, backgroundColor: '#e0dbdb', marginVertical: 10 },
  eventTitle: { fontSize: 16, fontWeight: 'bold', color: colors.black, marginBottom: 12 },
  pendingBadge: { backgroundColor: '#FFF3E0', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 5 },
  badgeText: { color: '#E65100', fontSize: 10, fontWeight: 'bold' },
  detailsGrid: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 15 },
  detailItem: { flexDirection: 'row', alignItems: 'center', width: '50%', marginBottom: 8 },
  detailValue: { marginLeft: 5, fontSize: 12, color: '#444', flexShrink: 1 },
  buttonRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 5 },
  actionBtn: { flex: 0.48, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 12, borderRadius: 10 },
  declineBtn: { borderWidth: 1, borderColor: colors.primary, backgroundColor: '#FFF1F0' },
  approveBtn: { backgroundColor: '#4CAF50' },
  declineText: { color: colors.primary, fontWeight: 'bold', marginLeft: 5 },
  approveText: { color: '#FFF', fontWeight: 'bold', marginLeft: 5 },
  emptyState: { alignItems: 'center', marginTop: 100 },
  emptyText: { color: colors.gray, marginTop: 10, fontSize: 16 }
});

export default AdminRequests;