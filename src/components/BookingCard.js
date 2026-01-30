import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Custom Configuration
import colors from '../constants/colors';
import Button from './Button'; 

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
  const isPending = status?.toLowerCase() === 'pending';

  return (
    <View style={styles.card}>
      {/* Header with Title and Dynamic Status Badge */}
      <View style={styles.headerRow}>
        <Text style={styles.hallTitle}>{hallName}</Text>
        <View style={[
          styles.badge, 
          isPending ? styles.pendingBadge : styles.approvedBadge
        ]}>
          <Ionicons 
            name={isPending ? "time-outline" : "checkmark-done-circle"} 
            size={14} 
            color={isPending ? colors.text : "#1B5E20"} 
          />
          <Text style={[
            styles.badgeText, 
            isPending ? styles.pendingText : styles.approvedText
          ]}>
            {status}
          </Text>
        </View>
      </View>

      <View style={styles.locationRow}>
        <Ionicons name="location-outline" size={16} color={colors.gray} />
        <Text style={styles.locationText}>{location}</Text>
      </View>

      <View style={styles.divider} />

      {/* Details Section */}
      <View style={styles.infoRow}>
        <Ionicons name="calendar-outline" size={16} color={colors.gray} />
        <Text style={styles.infoText}>{date}</Text>
      </View>

      <View style={styles.infoRow}>
        <Ionicons name="time-outline" size={16} color={colors.gray} />
        <Text style={styles.infoText}>{time} hr</Text>
      </View>

      <View style={styles.infoRow}>
        <Ionicons name="document-text-outline" size={16} color={colors.gray} />
        <Text style={styles.infoText}>{subject}</Text>
      </View>

      <View style={styles.infoRow}>
        <Ionicons name="people-outline" size={16} color={colors.gray} />
        <Text style={styles.infoText}>{students} Students</Text>
      </View>

      <Button 
        title="Cancel Booking" 
        onPress={onCancel} 
        style={styles.cancelBtn} 
        // Assuming your Button component can take a variant or custom color
        // if not, the default red from your Global Button works well here.
      />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: 15,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#CCC',
    elevation: 4,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  hallTitle: { fontSize: 18, fontWeight: 'bold', flex: 1, color: colors.text },
  locationRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  locationText: { marginLeft: 6, color: colors.gray, fontSize: 14 },
  divider: { height: 1, backgroundColor: '#EEE', marginBottom: 12 },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  infoText: { marginLeft: 10, color: '#444', fontSize: 14 },
  
  // Badge Styles
  badge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 15, borderWidth: 1 },
  pendingBadge: { backgroundColor: '#FFEBEE', borderColor: colors.primary }, // Light red tint
  approvedBadge: { backgroundColor: '#C8E6C9', borderColor: '#81C784' }, 
  badgeText: { marginLeft: 4, fontWeight: 'bold', fontSize: 12 },
  pendingText: { color: colors.black },
  approvedText: { color: '#1B5E20' },
  
  cancelBtn: { marginTop: 15, height: 48, backgroundColor: colors.primary }
});

export default BookingCard;