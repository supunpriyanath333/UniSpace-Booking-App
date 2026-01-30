import React, { useState, useEffect } from 'react';
import { 
  View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, 
  SafeAreaView, ActivityIndicator, Platform, StatusBar as RNStatusBar,
  Modal, ScrollView 
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

// Firebase
import { db } from '../firebase/firebaseConfig';
import { collection, onSnapshot, query, where, getDocs } from 'firebase/firestore';

// Components
import HamburgerMenu from '../components/HamburgerMenu';
import HallCard from '../components/HallCard'; 

const AllHallsScreen = ({ route, navigation }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [halls, setHalls] = useState([]);
  const [filteredHalls, setFilteredHalls] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(true);

  // Pop-up States
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedHall, setSelectedHall] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(false);

  // Fetch Halls
  useEffect(() => {
    const q = query(collection(db, 'halls'), where('isAvailable', '==', true));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const hallsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setHalls(hallsData);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Fetch Bookings for a specific hall
  const handleViewBookings = async (hall) => {
    setSelectedHall(hall);
    setModalVisible(true);
    setLoadingBookings(true);
    setBookings([]);

    try {
      // Query bookings table where hallId matches the clicked hall
      const q = query(collection(db, 'bookings'), where('hallId', '==', hall.id));
      const querySnapshot = await getDocs(q);
      const bookingData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setBookings(bookingData);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoadingBookings(false);
    }
  };

  // Search logic
  useEffect(() => {
    const result = halls.filter(hall => {
      const searchLower = searchText.toLowerCase();
      return (hall.name?.toLowerCase().includes(searchLower) || hall.building?.toLowerCase().includes(searchLower));
    });
    setFilteredHalls(result);
  }, [searchText, halls]);

  return (
    <View style={styles.container}>
      <StatusBar style="dark" backgroundColor="#F9EDB3" translucent={true} />
      <HamburgerMenu visible={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      {/* --- BOOKING DETAILS MODAL --- */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalHeader}>
              Currently Booked Details For <Text style={{color: '#666'}}>{selectedHall?.name}</Text>
            </Text>

            {/* Table UI */}
            <View style={styles.tableBorder}>
              <View style={styles.tableHeaderRow}>
                <View style={[styles.tableCell, styles.rightBorder]}><Text style={styles.headerText}>Date</Text></View>
                <View style={styles.tableCell}><Text style={styles.headerText}>Time</Text></View>
              </View>

              {loadingBookings ? (
                <ActivityIndicator size="small" color="#DA291C" style={{ padding: 20 }} />
              ) : (
                <View>
                  {bookings.length > 0 ? (
                    bookings.map((item) => (
                      <View key={item.id} style={styles.tableRow}>
                        <View style={[styles.tableCell, styles.rightBorder]}><Text style={styles.cellText}>{item.date}</Text></View>
                        <View style={styles.tableCell}><Text style={styles.cellText}>{item.startTime} - {item.endTime}</Text></View>
                      </View>
                    ))
                  ) : (
                    <Text style={styles.noBookings}>No current bookings found.</Text>
                  )}
                </View>
              )}
            </View>

            <View style={styles.noteSection}>
              <Text style={styles.noteTitle}>Note</Text>
              <Text style={styles.noteDescription}>
                If you want to book this hall, please choose a time without these reserved times.
              </Text>
            </View>

            <TouchableOpacity style={styles.okButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.okButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* HEADER */}
      <View style={styles.header}>
        <SafeAreaView edges={['top']}>
          <View style={styles.headerTop}>
            <TouchableOpacity onPress={() => navigation.goBack()}><Ionicons name="arrow-back" size={30} color="black" /></TouchableOpacity>
            <Text style={styles.headerTitle}>Available Halls</Text>
            <TouchableOpacity onPress={() => setIsMenuOpen(true)}><Ionicons name="menu" size={35} color="black" /></TouchableOpacity>
          </View>
          <View style={styles.searchBar}>
            <TextInput 
              style={styles.searchInput} 
              placeholder="Search hall or building..."
              value={searchText}
              onChangeText={setSearchText}
            />
            <Ionicons name="search-outline" size={22} color="black" />
          </View>
        </SafeAreaView>
      </View>

      {/* CONTENT */}
      {loading ? (
        <View style={styles.center}><ActivityIndicator size="large" color="#DA291C" /></View>
      ) : (
        <FlatList
          data={filteredHalls}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listPadding}
          renderItem={({ item }) => (
            <HallCard 
              name={item.name}
              location={item.building}
              capacity={item.capacity}
              tags={item.tags || []}
              isAvailable={true}
              onBookNow={() => navigation.navigate('BookingForm', { hall: item })}
              onViewDetails={() => handleViewBookings(item)} // This triggers the popup
            />
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F2F2F2' },
  header: { 
    backgroundColor: '#F9EDB3', 
    paddingHorizontal: 20, 
    paddingBottom: 20, 
    borderBottomWidth: 1, 
    borderColor: '#000',
    paddingTop: Platform.OS === 'android' ? RNStatusBar.currentHeight + 10 : 10 
  },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  headerTitle: { fontSize: 20, fontWeight: 'bold' },
  searchBar: { flexDirection: 'row', backgroundColor: '#FFF', borderRadius: 25, paddingHorizontal: 15, height: 45, alignItems: 'center', borderWidth: 1.5, borderColor: '#000' },
  searchInput: { flex: 1, height: '100%', fontSize: 16 },
  listPadding: { padding: 15, paddingBottom: 100 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  modalContainer: {
    backgroundColor: '#FFF',
    width: '100%',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#000'
  },
  modalHeader: { fontSize: 16, fontWeight: 'bold', marginBottom: 20 },
  tableBorder: { borderWidth: 1, borderColor: '#000' },
  tableHeaderRow: { flexDirection: 'row', backgroundColor: '#DDD', borderBottomWidth: 1, borderColor: '#000' },
  tableRow: { flexDirection: 'row', borderBottomWidth: 1, borderColor: '#CCC' },
  tableCell: { flex: 1, padding: 8, alignItems: 'center' },
  rightBorder: { borderRightWidth: 1, borderColor: '#000' },
  headerText: { fontWeight: 'bold', fontSize: 14 },
  cellText: { fontSize: 12 },
  noBookings: { padding: 15, textAlign: 'center', color: '#888' },
  
  noteSection: { marginTop: 20 },
  noteTitle: { fontWeight: 'bold', fontSize: 16 },
  noteDescription: { color: '#DA291C', marginTop: 5, fontSize: 14, fontWeight: '500' },

  okButton: {
    backgroundColor: '#DA291C',
    marginTop: 25,
    paddingVertical: 15,
    borderRadius: 15,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#8b0000'
  },
  okButtonText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 }
});

export default AllHallsScreen;