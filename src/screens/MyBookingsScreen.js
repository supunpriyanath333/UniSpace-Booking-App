import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import BookingCard from '../components/BookingCard';

const MY_BOOKINGS = [
  { id: '1', hall: 'Main Auditorium', date: '2024-05-20', status: 'Confirmed' },
  { id: '2', hall: 'Science Hall 01', date: '2024-05-25', status: 'Pending' },
];

const MyBookingsScreen = () => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Bookings</Text>
      </View>
      <FlatList
        data={MY_BOOKINGS}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <BookingCard 
            hallName={item.hall} 
            date={item.date} 
            status={item.status} 
          />
        )}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { padding: 20, backgroundColor: '#F9EDB3', paddingTop: 50 },
  title: { fontSize: 22, fontWeight: 'bold' },
  list: { padding: 15 }
});

export default MyBookingsScreen;