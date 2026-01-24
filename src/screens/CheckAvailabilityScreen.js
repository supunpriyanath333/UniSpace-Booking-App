import React from 'react';
import { View, Text, StyleSheet, Calendar } from 'react-native';
import colors from '../constants/colors';

export default function CheckAvailabilityScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Check Availability</Text>
      <View style={styles.calendarPlaceholder}>
        <Text>Calendar View Coming Soon</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff', paddingTop: 60 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  calendarPlaceholder: { 
    height: 300, 
    backgroundColor: '#F9EDB3', 
    borderRadius: 15, 
    justifyContent: 'center', 
    alignItems: 'center',
    borderWidth: 1,
    borderStyle: 'dashed'
  }
});