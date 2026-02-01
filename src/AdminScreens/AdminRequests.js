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
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  doc, 
  updateDoc, 
  deleteDoc, 
  addDoc, 
  serverTimestamp 
} from 'firebase/firestore';

// Utils & Components
import colors from '../constants/colors';
import { GlobalStyles } from '../styles/GlobalStyles';

const AdminRequests = ({ navigation }) => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

  const sendNotification = async (userId, type, title, message) => {
    try {
      await addDoc(collection(db, 'notifications'), {
        userId: userId,
        type: type,
        title: title,
        message: message,
        isRead: false,
        createdAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Notification Error:", error);
    }
  };

  const handleAction = async (item, actionType) => {
    const isApprove = actionType === 'Approve';
    
    Alert.alert(
      `${actionType} Request`,
      isApprove 
        ? `Approve this booking for ${item.hallName}?` 
        : `Decline and remove this request?`,
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
                await sendNotification(
                  item.userId, 
                  'Approved', 
                  'Booking Approved', 
                  `Your booking for ${item.hallName} on ${item.date} has been confirmed.`
                );
                Alert.alert("Success", "Booking approved and user notified.");
              } else {
                await sendNotification(
                  item.userId, 
                  'Declined', 
                  'Booking Declined', 
                  `Your request for ${item.hallName} on ${item.date} was declined.`
                );
                await deleteDoc(bookingRef);
                Alert.alert("Declined", "Request removed and user notified.");
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
          <Text style={styles.locationSubText}>{item.location || 'Faculty Building'}</Text>
        </View>
        <View style={styles.pendingBadge}>
          <Text style={styles.badgeText}>PENDING</Text>
        </View>
      </View>

      <View style={styles.divider} />

      <Text style={styles.eventTitle}>For {item.eventName}</Text>

      <View style={styles.detailsGrid}>
        <DetailItem icon="person-outline" value={item.lecturerName} />
        <DetailItem icon="calendar-outline" value={item.date} />
        <DetailItem icon="time-outline" value={`${item.startTime} - ${item.endTime}`} />
        <DetailItem icon="people-outline" value={`${item.capacity || 'N/A'}`} />
        <DetailItem icon="call-outline" value={item.contact || 'No Contact'} />
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
      {/* Set StatusBar to match the yellow header background */}
      <StatusBar style="dark" backgroundColor={colors.secondary} />
      
      {/* USING GLOBAL HEADER STYLE */}
      <View style={GlobalStyles.headerWrapper}>
        <View style={GlobalStyles.headerSection}>
          <View style={GlobalStyles.headerTopRow}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={30} color={colors.black} />
            </TouchableOpacity>
            
            <Text style={GlobalStyles.headerTitle}>Pending Requests</Text>
            
            {/* Balance the row for centered title */}
            <View style={{ width: 30 }} /> 
          </View>
        </View>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={requests}
          renderItem={renderRequestItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
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

const DetailItem = ({ icon, value }) => (
  <View style={styles.detailItem}>
    <Ionicons name={icon} size={15} color={colors.gray} />
    <Text style={styles.detailValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  listContent: { padding: 15, paddingBottom: 30 },
  requestCard: { 
    backgroundColor: '#FFF', 
    borderRadius: 15, 
    padding: 18, 
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
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
  hallTitle: { fontSize: 16, fontWeight: 'bold', color: colors.black, textTransform: 'uppercase' },
  locationSubText: { fontSize: 12, color: colors.gray, marginTop: 2 },
  divider: { height: 1, backgroundColor: '#EEE', marginVertical: 12 },
  eventTitle: { fontSize: 17, fontWeight: 'bold', color: colors.black, marginBottom: 15 },
  pendingBadge: { backgroundColor: '#FFF3E0', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
  badgeText: { color: '#E65100', fontSize: 11, fontWeight: 'bold' },
  detailsGrid: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 15 },
  detailItem: { flexDirection: 'row', alignItems: 'center', width: '50%', marginBottom: 10 },
  detailValue: { marginLeft: 8, fontSize: 13, color: '#444' },
  buttonRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 5 },
  actionBtn: { flex: 0.48, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 14, borderRadius: 12 },
  declineBtn: { borderWidth: 1, borderColor: colors.primary, backgroundColor: '#FFF' },
  approveBtn: { backgroundColor: '#4CAF50' },
  declineText: { color: colors.primary, fontWeight: 'bold', marginLeft: 8, fontSize: 15 },
  approveText: { color: '#FFF', fontWeight: 'bold', marginLeft: 8, fontSize: 15 },
  emptyState: { alignItems: 'center', marginTop: 100 },
  emptyText: { color: colors.gray, marginTop: 10, fontSize: 16 }
});

export default AdminRequests;