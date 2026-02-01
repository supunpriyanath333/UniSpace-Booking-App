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
      <View style={styles.cardMain}>
        <View style={styles.infoSection}>
          <Text style={styles.hallName}>{item.name}</Text>
          
          <View style={styles.iconRow}>
            {/* UPDATED: Location Icon */}
            <Ionicons name="location-outline" size={16} color={colors.gray} />
            <Text style={styles.hallLocation}>{item.building}</Text>
          </View>

          <View style={styles.iconRow}>
            <Ionicons name="people-outline" size={16} color={colors.gray} />
            <Text style={styles.hallCapacity}>{item.capacity}</Text>
          </View>
          
          <View style={styles.tagContainer}>
            {item.tags && item.tags.map((tag, index) => (
              <View key={index} style={styles.tagPill}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.actionSection}>
          <View style={styles.switchWrapper}>
            <Text style={[styles.statusLabel, { color: item.isAvailable ? '#4CAF50' : colors.primary }]}>
              {item.isAvailable ? "AVAILABLE" : "NOT AVAILABLE"}
            </Text>
            <Switch
              trackColor={{ false: "#EEE", true: "#C8E6C9" }}
              thumbColor={item.isAvailable ? "#4CAF50" : "#BCBCBC"}
              onValueChange={() => toggleAvailability(item.id, item.isAvailable)}
              value={item.isAvailable}
            />
          </View>

          {/* UPDATED: Delete Button with Text & Icon */}
          <TouchableOpacity 
            style={styles.deleteBtn} 
            onPress={() => confirmDelete(item.id, item.name)}
          >
            <Ionicons name="trash-outline" size={18} color={colors.primary} />
            <Text style={styles.deleteText}>Delete</Text>
          </TouchableOpacity>
        </View>
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
          <Ionicons name="add-circle" size={32} color={colors.primary} />
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
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Ionicons name="business-outline" size={60} color="#CCC" />
              <Text style={styles.emptyText}>No halls found.</Text>
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
  headerTitle: { fontSize: 22, fontWeight: 'bold' },
  listContent: { padding: 15 },
  hallCard: { 
    backgroundColor: '#FFF', 
    borderRadius: 16, 
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: '#F0F0F0'
  },
  cardMain: {
    flexDirection: 'row',
    padding: 16,
  },
  infoSection: { flex: 1 },
  actionSection: { 
    alignItems: 'flex-end', 
    justifyContent: 'space-between',
    paddingLeft: 10
  },
  hallName: { fontSize: 18, fontWeight: '800', color: '#333', marginBottom: 6 },
  iconRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  hallLocation: { fontSize: 13, color: '#666', marginLeft: 6 },
  hallCapacity: { fontSize: 13, color: '#666', marginLeft: 6 },
  tagContainer: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 10 },
  tagPill: { 
    backgroundColor: '#F0F0F0', 
    paddingHorizontal: 10, 
    paddingVertical: 4, 
    borderRadius: 20, 
    marginRight: 6,
    marginBottom: 6
  },
  tagText: { fontSize: 10, color: '#555', fontWeight: '600' },
  switchWrapper: { alignItems: 'center' },
  statusLabel: { fontSize: 10, fontWeight: '900', marginBottom: 2 },
  
  // Updated Delete Button Styles
  deleteBtn: { 
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF1F0', 
    paddingHorizontal: 12, 
    paddingVertical: 8, 
    borderRadius: 8,
    marginTop: 10
  },
  deleteText: { 
    color: colors.primary, 
    fontSize: 12, 
    fontWeight: 'bold', 
    marginLeft: 6 
  },
  
  emptyState: { alignItems: 'center', marginTop: 100 },
  emptyText: { color: colors.gray, fontSize: 16, marginTop: 10 }
});

export default ManageHalls;