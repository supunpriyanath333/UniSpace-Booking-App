import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  Switch, 
  Alert, 
  ActivityIndicator 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

// Firebase
import { db } from '../firebase/firebaseConfig';
import { collection, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore';

// Custom Config
import colors from '../constants/colors';
import { GlobalStyles } from '../styles/GlobalStyles';

const ManageHalls = ({ navigation }) => {
  const [halls, setHalls] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen to all halls
    const unsub = onSnapshot(collection(db, 'halls'), (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setHalls(data);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  const toggleAvailability = async (id, currentStatus) => {
    try {
      const hallRef = doc(db, 'halls', id);
      await updateDoc(hallRef, { isAvailable: !currentStatus });
    } catch (error) {
      Alert.alert("Error", "Could not update availability.");
    }
  };

  const confirmDelete = (id, name) => {
    Alert.alert(
      "Delete Hall",
      `Are you sure you want to permanently delete ${name}?`,
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive", 
          onPress: async () => {
            try {
              await deleteDoc(doc(db, 'halls', id));
            } catch (error) {
              Alert.alert("Error", "Could not delete hall.");
            }
          } 
        }
      ]
    );
  };

  const renderHallItem = ({ item }) => (
    <View style={styles.hallCard}>
      <View style={styles.cardInfo}>
        <Text style={styles.hallName}>{item.name}</Text>
        {/* Updated: using item.building instead of location */}
        <Text style={styles.hallLocation}>{item.building}</Text>
        {/* Updated: item.capacity already contains "Students" string now */}
        <Text style={styles.hallCapacity}>Capacity: {item.capacity}</Text>
        
        {/* Optional: Show tags to the admin */}
        <View style={styles.tagContainer}>
          {item.tags && item.tags.slice(0, 3).map((tag, index) => (
            <Text key={index} style={styles.tagText}>• {tag}</Text>
          ))}
        </View>
      </View>

      <View style={styles.cardActions}>
        <View style={styles.statusRow}>
          <Text style={[styles.statusText, { color: item.isAvailable ? '#4CAF50' : colors.primary }]}>
            {item.isAvailable ? "Available" : "Hidden"}
          </Text>
          <Switch
            trackColor={{ false: "#767577", true: "#C8E6C9" }}
            thumbColor={item.isAvailable ? "#4CAF50" : "#f4f3f4"}
            onValueChange={() => toggleAvailability(item.id, item.isAvailable)}
            value={item.isAvailable}
          />
        </View>

        <TouchableOpacity 
          style={styles.deleteBtn} 
          onPress={() => confirmDelete(item.id, item.name)}
        >
          <Ionicons name="trash-outline" size={20} color={colors.primary} />
          <Text style={styles.deleteText}>Delete</Text>
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
        <Text style={styles.headerTitle}>Manage Halls</Text>
        <TouchableOpacity onPress={() => navigation.navigate('AddHall')}>
          <Ionicons name="add-circle" size={30} color={colors.black} />
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={halls}
          renderItem={renderHallItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No halls found. Add one to get started!</Text>
            </View>
          }
        />
      )}
    </View>
  );
};

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
  hallCard: { 
    backgroundColor: '#FFF', 
    borderRadius: 15, 
    padding: 15, 
    marginBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    elevation: 3,
    borderWidth: 1,
    borderColor: '#EEE'
  },
  cardInfo: { flex: 0.65 },
  hallName: { fontSize: 17, fontWeight: 'bold', marginBottom: 4 },
  hallLocation: { fontSize: 13, color: '#666', marginBottom: 4 },
  hallCapacity: { fontSize: 12, color: colors.gray, marginBottom: 6 },
  tagContainer: { flexDirection: 'row', flexWrap: 'wrap' },
  tagText: { fontSize: 10, color: colors.gray, marginRight: 5 },
  cardActions: { flex: 0.35, alignItems: 'flex-end', justifyContent: 'space-between' },
  statusRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  statusText: { fontSize: 12, fontWeight: 'bold', marginRight: 8 },
  deleteBtn: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#FFF1F0', 
    paddingHorizontal: 12, 
    paddingVertical: 6, 
    borderRadius: 8 
  },
  deleteText: { color: colors.primary, fontSize: 13, fontWeight: 'bold', marginLeft: 4 },
  emptyState: { alignItems: 'center', marginTop: 100 },
  emptyText: { color: colors.gray, fontSize: 16 }
});

export default ManageHalls;