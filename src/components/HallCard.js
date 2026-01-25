import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Button from './Button'; // Using your existing component

const HallCard = ({ 
  name, 
  location, 
  capacity, 
  tags = [], 
  isAvailable = false, 
  onBookNow, 
  onViewDetails,
  loadingBook = false // Added prop to handle your button's loading state
}) => {
  return (
    <View style={styles.hallCard}>
      <View style={styles.hallHeader}>
        <Text style={styles.hallTitle}>{name}</Text>
        {isAvailable && (
          <View style={styles.availableBadge}>
            <Text style={styles.badgeText}>Available</Text>
          </View>
        )}
      </View>

      <View style={styles.detailRow}>
        <Ionicons name="location-outline" size={16} color="#666" />
        <Text style={styles.detailText}>{location}</Text>
      </View>

      <View style={styles.detailRow}>
        <Ionicons name="people-outline" size={16} color="#666" />
        <Text style={styles.detailText}>Capacity - {capacity}</Text>
      </View>

      <View style={styles.tagRow}>
        {tags.map((tag, index) => (
          <View key={index} style={styles.tag}>
            <Text style={styles.tagText}>{tag}</Text>
          </View>
        ))}
      </View>

      {/* Using your Button component */}
      <Button 
        title="Currently Booked Details" 
        onPress={onViewDetails} 
        style={styles.actionBtn}
      />
      
      <Button 
        title="Book This Hall Now" 
        onPress={onBookNow} 
        loading={loadingBook}
        style={styles.actionBtn}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  hallCard: {
    backgroundColor: '#FFF',
    borderRadius: 15,
    padding: 18,
    borderWidth: 1,
    borderColor: '#CCC',
    marginBottom: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  hallHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 10 
  },
  hallTitle: { fontSize: 18, fontWeight: 'bold' },
  availableBadge: { 
    backgroundColor: '#C8E6C9', 
    paddingHorizontal: 12, 
    paddingVertical: 4, 
    borderRadius: 15 
  },
  badgeText: { color: '#2E7D32', fontWeight: 'bold', fontSize: 12 },
  detailRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 5 },
  detailText: { marginLeft: 8, color: '#555', fontSize: 14 },
  tagRow: { flexDirection: 'row', flexWrap: 'wrap', marginVertical: 12 },
  tag: { 
    backgroundColor: '#F9EDB3', 
    borderWidth: 1, 
    borderColor: '#000',
    borderRadius: 15, 
    paddingHorizontal: 12, 
    paddingVertical: 4, 
    marginRight: 8,
    marginBottom: 5
  },
  tagText: { fontWeight: 'bold', fontSize: 11 },
  actionBtn: {
    marginTop: 10, // Overriding your component's default marginTop: 20
    height: 50,    // Adjusting height slightly for card layout
  }
});

export default HallCard;