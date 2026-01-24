import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const HallCard = ({ name, capacity, location }) => (
  <View style={styles.card}>
    <Text style={styles.name}>{name}</Text>
    <Text>Capacity: {capacity}</Text>
    <Text>Location: {location}</Text>
  </View>
);

const styles = StyleSheet.create({
  card: { backgroundColor: '#F9EDB3', padding: 15, borderRadius: 10, marginBottom: 10, borderWidth: 1 },
  name: { fontSize: 18, fontWeight: 'bold' }
});

export default HallCard;