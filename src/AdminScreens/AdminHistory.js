import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { db } from '../firebase/firebaseConfig';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import colors from '../constants/colors';

const AdminHistory = ({ navigation }) => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    // Fetch bookings that are NOT pending
    const q = query(
      collection(db, 'bookings'), 
      where('status', 'in', ['Approved', 'Declined']),
      orderBy('date', 'desc')
    );
    
    const unsub = onSnapshot(q, (snap) => {
      setHistory(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsub();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={28} color="black" />
        </TouchableOpacity>
        <Text style={styles.title}>Booking History</Text>
        <View style={{ width: 28 }} />
      </View>

      <FlatList
        data={history}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 20 }}
        renderItem={({ item }) => (
          <View style={styles.historyCard}>
            <View>
              <Text style={styles.hallName}>{item.hallName}</Text>
              <Text style={styles.dateText}>{item.date} • {item.userName}</Text>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: item.status === 'Approved' ? '#E8F5E9' : '#FFEBEE' }]}>
              <Text style={{ color: item.status === 'Approved' ? '#2E7D32' : '#C62828', fontWeight: 'bold', fontSize: 12 }}>
                {item.status.toUpperCase()}
              </Text>
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F8F8' },
  header: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, paddingTop: 60, backgroundColor: colors.secondary },
  title: { fontSize: 20, fontWeight: 'bold' },
  historyCard: { backgroundColor: 'white', padding: 15, borderRadius: 12, marginBottom: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', elevation: 2 },
  hallName: { fontWeight: 'bold', fontSize: 16 },
  dateText: { color: '#777', fontSize: 13, marginTop: 2 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 }
});

export default AdminHistory;