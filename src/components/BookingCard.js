import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import colors from '../constants/colors';

const BookingCard = ({ hallName, date, status }) => (
  <View style={styles.card}>
    <Text style={styles.hallName}>{hallName}</Text>
    <Text style={styles.date}>Date: {date}</Text>
    <Text style={[styles.status, { color: status === 'Confirmed' ? 'green' : 'orange' }]}>
      {status}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  card: { 
    backgroundColor: '#fff', 
    padding: 15, 
    borderRadius: 12, 
    marginBottom: 10, 
    borderWidth: 1, 
    borderColor: '#eee',
    elevation: 2 
  },
  hallName: { fontSize: 18, fontWeight: 'bold' },
  date: { color: '#666', marginVertical: 5 },
  status: { fontWeight: 'bold' }
});

export default BookingCard;