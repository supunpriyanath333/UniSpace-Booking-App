import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Button from './Button'; // Your existing Button component

const BookingCard = ({ 
  hallName, 
  location, 
  date, 
  time, 
  subject, 
  students, 
  status, 
  onCancel 
}) => {
  const isPending = status.toLowerCase() === 'pending';

  return (
    <View style={styles.card}>
      {/* Header with Title and Status Badge */}
      <View style={styles.headerRow}>
        <Text style={styles.hallTitle}>{hallName}</Text>
        <View style={[styles.badge, isPending ? styles.pendingBadge : styles.approvedBadge]}>
          <Ionicons 
            name={isPending ? "time-outline" : "checkbox-outline"} 
            size={14} 
            color={isPending ? "#854d0e" : "#166534"} 
          />
          <Text style={[styles.badgeText, isPending ? styles.pendingText : styles.approvedText]}>
            {status}
          </Text>
        </View>
      </View>

      <View style={styles.locationRow}>
        <Ionicons name="location-outline" size={16} color="#666" />
        <Text style={styles.locationText}>{location}</Text>
      </View>

      <View style={styles.divider} />

      {/* Details Section */}
      <View style={styles.infoRow}>
        <Ionicons name="calendar-outline" size={16} color="#666" />
        <Text style={styles.infoText}>{date}</Text>
      </View>

      <View style={styles.infoRow}>
        <Ionicons name="time-outline" size={16} color="#666" />
        <Text style={styles.infoText}>{time}</Text>
      </View>

      <View style={styles.infoRow}>
        <Ionicons name="document-text-outline" size={16} color="#666" />
        <Text style={styles.infoText}>{subject}</Text>
      </View>

      <View style={styles.infoRow}>
        <Ionicons name="people-outline" size={16} color="#666" />
        <Text style={styles.infoText}>{students} Students</Text>
      </View>

      {/* Using your existing Button component */}
      <Button 
        title="Cancel Booking" 
        onPress={onCancel} 
        style={styles.cancelBtn} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFF',
    borderRadius: 15,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#CCC',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  hallTitle: { fontSize: 18, fontWeight: 'bold' },
  locationRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  locationText: { marginLeft: 6, color: '#666', fontSize: 14 },
  divider: { height: 1, backgroundColor: '#EEE', marginBottom: 12 },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  infoText: { marginLeft: 10, color: '#444', fontSize: 14 },
  
  // Badge Styles
  badge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, borderWidth: 1 },
  pendingBadge: { backgroundColor: '#FEF3C7', borderColor: '#F59E0B' },
  approvedBadge: { backgroundColor: '#DCFCE7', borderColor: '#22C55E' },
  badgeText: { marginLeft: 4, fontWeight: 'bold', fontSize: 12 },
  pendingText: { color: '#854d0e' },
  approvedText: { color: '#166534' },
  
  cancelBtn: {
    marginTop: 15,
    height: 48, // Slightly more compact for the card
  }
});

export default BookingCard;