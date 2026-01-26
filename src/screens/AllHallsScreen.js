import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TextInput, 
  TouchableOpacity, 
  SafeAreaView,
  ActivityIndicator 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Firebase & Components
import { db } from '../firebase/firebaseConfig';
import { collection, onSnapshot, query } from 'firebase/firestore';
import HamburgerMenu from '../components/HamburgerMenu';
import HallCard from '../components/HallCard'; 

const AllHallsScreen = ({ route, navigation }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [halls, setHalls] = useState([]);
  const [filteredHalls, setFilteredHalls] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(true);

  // 1. Fetch Halls from Firestore (Live Updates)
  useEffect(() => {
    const q = query(collection(db, 'halls'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const hallsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setHalls(hallsData);
      setFilteredHalls(hallsData);
      setLoading(false);
    }, (error) => {
      console.error("Firestore Error:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // 2. Handle Search Parameter from Home Screen
  useEffect(() => {
    const initialQuery = route.params?.initialSearch || '';
    if (initialQuery) {
      setSearchText(initialQuery);
      // Reset params so navigation doesn't lock the filter
      navigation.setParams({ initialSearch: undefined });
    }
  }, [route.params?.initialSearch]);

  // 3. Filtering Logic (Name or Building)
  useEffect(() => {
    const filtered = halls.filter(hall => 
      hall.name?.toLowerCase().includes(searchText.toLowerCase()) ||
      hall.building?.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredHalls(filtered);
  }, [searchText, halls]);

  return (
    <View style={styles.container}>
      <HamburgerMenu 
        visible={isMenuOpen} 
        onClose={() => setIsMenuOpen(false)} 
      />

      {/* Header Section */}
      <View style={styles.header}>
        <SafeAreaView>
          <View style={styles.headerTop}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={30} color="black" />
            </TouchableOpacity>
            
            <Text style={styles.headerTitle}>All Halls & Rooms</Text>
            
            <TouchableOpacity onPress={() => setIsMenuOpen(true)}>
              <Ionicons name="menu" size={35} color="black" />
            </TouchableOpacity>
          </View>

          {/* Search Bar */}
          <View style={styles.searchBar}>
            <TextInput 
              style={styles.searchInput} 
              placeholder="Search hall name or building..."
              placeholderTextColor="#666"
              value={searchText}
              onChangeText={setSearchText}
              returnKeyType="search" 
            />
            {searchText !== '' && (
              <TouchableOpacity onPress={() => setSearchText('')}>
                <Ionicons name="close-circle" size={20} color="#666" style={{marginRight: 10}} />
              </TouchableOpacity>
            )}
            <Ionicons name="search-outline" size={22} color="black" />
          </View>
        </SafeAreaView>
      </View>

      {/* List Content */}
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#DA291C" />
        </View>
      ) : (
        <FlatList
          data={filteredHalls}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listPadding}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <HallCard 
              name={item.name}
              location={item.building}       // Mapped to 'building' field
              capacity={item.capacity}       // Mapped to 'capacity' field
              tags={item.tags || []}         // Mapped to 'tags' array
              isAvailable={item.isAvailable} // Mapped to 'isAvailable' boolean
              onBookNow={() => navigation.navigate('BookingForm', { hall: item })}
              onViewDetails={() => {
                // If you have a details screen, navigate here
                console.log("Viewing details for:", item.name);
              }}
            />
          )}
          ListEmptyComponent={
            <View style={styles.center}>
              <Ionicons name="search-outline" size={50} color="#CCC" />
              <Text style={styles.emptyText}>No matching halls found.</Text>
            </View>
          }
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
    paddingTop: 10
  },
  headerTop: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    marginBottom: 15 
  },
  headerTitle: { fontSize: 20, fontWeight: 'bold' },
  searchBar: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 25,
    paddingHorizontal: 15,
    height: 45,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#000',
  },
  searchInput: { flex: 1, height: '100%', fontSize: 16 },
  listPadding: { padding: 15, paddingBottom: 50 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 100 },
  emptyText: { color: '#666', fontSize: 16, marginTop: 10 }
});

export default AllHallsScreen;