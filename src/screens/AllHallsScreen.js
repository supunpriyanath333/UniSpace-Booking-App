import React, { useState, useEffect } from 'react';
import { 
  View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, 
  SafeAreaView, ActivityIndicator, Platform, StatusBar as RNStatusBar,
  Modal, ScrollView 
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import colors from '../constants/colors'; // Import your global colors

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
      <StatusBar style="dark" backgroundColor={colors.secondary} translucent={true} />
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
              Currently Booked Details For <Text style={{color: colors.gray}}>{selectedHall?.name}</Text>
            </Text>

            <View style={styles.tableBorder}>
              <View style={styles.tableHeaderRow}>
                <View style={[styles.tableCell, styles.rightBorder]}><Text style={styles.headerText}>Date</Text></View>
                <View style={styles.tableCell}><Text style={styles.headerText}>Time</Text></View>
              </View>

              {loadingBookings ? (
                <ActivityIndicator size="small" color={colors.primary} style={{ padding: 20 }} />
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
            <TouchableOpacity onPress={() => navigation.goBack()}><Ionicons name="arrow-back" size={30} color={colors.black} /></TouchableOpacity>
            <Text style={styles.headerTitle}>Available Halls</Text>
            <TouchableOpacity onPress={() => setIsMenuOpen(true)}><Ionicons name="menu" size={35} color={colors.black} /></TouchableOpacity>
          </View>
          <View style={styles.searchBar}>
            <TextInput 
              style={styles.searchInput} 
              placeholder="Search hall or building..."
              placeholderTextColor={colors.gray}
              value={searchText}
              onChangeText={setSearchText}
            />
            <Ionicons name="search-outline" size={22} color={colors.black} />
          </View>
        </SafeAreaView>
      </View>

      {/* CONTENT */}
      {loading ? (
        <View style={styles.center}><ActivityIndicator size="large" color={colors.primary} /></View>
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
              onViewDetails={() => handleViewBookings(item)} 
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
    backgroundColor: colors.secondary, 
    paddingHorizontal: 20, 
    paddingBottom: 20, 
    borderBottomWidth: 1, 
    borderColor: colors.black,
    paddingTop: Platform.OS === 'android' ? RNStatusBar.currentHeight + 10 : 10 
  },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: colors.text },
  searchBar: { 
    flexDirection: 'row', 
    backgroundColor: colors.white, 
    borderRadius: 25, 
    paddingHorizontal: 15, 
    height: 45, 
    alignItems: 'center', 
    borderWidth: 1.5, 
    borderColor: colors.black 
  },
  searchInput: { flex: 1, height: '100%', fontSize: 16, color: colors.text },
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
    backgroundColor: colors.white,
    width: '100%',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.black
  },
  modalHeader: { fontSize: 16, fontWeight: 'bold', marginBottom: 20, color: colors.text },
  tableBorder: { borderWidth: 1, borderColor: colors.black },
  tableHeaderRow: { flexDirection: 'row', backgroundColor: '#DDD', borderBottomWidth: 1, borderColor: colors.black },
  tableRow: { flexDirection: 'row', borderBottomWidth: 1, borderColor: '#CCC' },
  tableCell: { flex: 1, padding: 8, alignItems: 'center' },
  rightBorder: { borderRightWidth: 1, borderColor: colors.black },
  headerText: { fontWeight: 'bold', fontSize: 14, color: colors.black },
  cellText: { fontSize: 12, color: colors.text },
  noBookings: { padding: 15, textAlign: 'center', color: colors.gray },
  
  noteSection: { marginTop: 20 },
  noteTitle: { fontWeight: 'bold', fontSize: 16, color: colors.black },
  noteDescription: { color: colors.error, marginTop: 5, fontSize: 14, fontWeight: '500' },

  okButton: {
    backgroundColor: colors.primary,
    marginTop: 25,
    paddingVertical: 15,
    borderRadius: 15,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#8b0000' // Darker shade of red for border depth
  },
  okButtonText: { color: colors.white, fontWeight: 'bold', fontSize: 16 }
});

export default AllHallsScreen;