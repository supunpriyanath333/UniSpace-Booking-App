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

// Firebase
import { db } from '../firebase/firebaseConfig';
import { collection, onSnapshot, query, where } from 'firebase/firestore';

// Components
import HamburgerMenu from '../components/HamburgerMenu';
import HallCard from '../components/HallCard'; 

const AllHallsScreen = ({ route, navigation }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [halls, setHalls] = useState([]);
  const [filteredHalls, setFilteredHalls] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(true);

  // 1. Fetch ONLY available halls from Firestore
  useEffect(() => {
    // This query tells Firestore: "Only send me documents where isAvailable is true"
    const q = query(
      collection(db, 'halls'), 
      where('isAvailable', '==', true) 
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const hallsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Extra Safety: Double check that strings like "false" didn't sneak in
      const strictlyAvailable = hallsData.filter(hall => {
        return hall.isAvailable === true || String(hall.isAvailable).toLowerCase().trim() === 'true';
      });

      setHalls(strictlyAvailable);
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
      navigation.setParams({ initialSearch: undefined });
    }
  }, [route.params?.initialSearch]);

  // 3. Search Filtering (Filtering from the already-available halls)
  useEffect(() => {
    const result = halls.filter(hall => {
      const searchLower = searchText.toLowerCase();
      return (
        hall.name?.toLowerCase().includes(searchLower) ||
        hall.building?.toLowerCase().includes(searchLower)
      );
    });
    setFilteredHalls(result);
  }, [searchText, halls]);

  return (
    <View style={styles.container}>
      <HamburgerMenu visible={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      <View style={styles.header}>
        <SafeAreaView>
          <View style={styles.headerTop}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={30} color="black" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Available Halls</Text>
            <TouchableOpacity onPress={() => setIsMenuOpen(true)}>
              <Ionicons name="menu" size={35} color="black" />
            </TouchableOpacity>
          </View>

          <View style={styles.searchBar}>
            <TextInput 
              style={styles.searchInput} 
              placeholder="Search hall or building..."
              placeholderTextColor="#666"
              value={searchText}
              onChangeText={setSearchText}
            />
            {searchText !== '' && (
              <TouchableOpacity onPress={() => setSearchText('')}>
                <Ionicons name="close-circle" size={20} color="#666" />
              </TouchableOpacity>
            )}
            <Ionicons name="search-outline" size={22} color="black" style={{marginLeft: 10}} />
          </View>
        </SafeAreaView>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#DA291C" />
        </View>
      ) : (
        <FlatList
          data={filteredHalls}
          keyExtractor={item => item.id}
          extraData={filteredHalls} // Forces FlatList to re-render when data changes
          contentContainerStyle={styles.listPadding}
          renderItem={({ item }) => (
            <HallCard 
              name={item.name}
              location={item.building}
              capacity={item.capacity}
              tags={item.tags || []}
              isAvailable={true} // They are definitely true if they appear here
              onBookNow={() => navigation.navigate('BookingForm', { hall: item })}
              onViewDetails={() => {}}
            />
          )}
          ListEmptyComponent={
            <View style={styles.center}>
              <Ionicons name="search-outline" size={50} color="#CCC" />
              <Text style={styles.emptyText}>No available halls found.</Text>
            </View>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F2F2F2' },
  header: { backgroundColor: '#F9EDB3', paddingHorizontal: 20, paddingBottom: 20, borderBottomWidth: 1, borderColor: '#000', paddingTop: 10 },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  headerTitle: { fontSize: 20, fontWeight: 'bold' },
  searchBar: { flexDirection: 'row', backgroundColor: '#FFF', borderRadius: 25, paddingHorizontal: 15, height: 45, alignItems: 'center', borderWidth: 1.5, borderColor: '#000' },
  searchInput: { flex: 1, height: '100%', fontSize: 16 },
  listPadding: { padding: 15, paddingBottom: 50 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 100 },
  emptyText: { color: '#666', fontSize: 16, marginTop: 10 }
});

export default AllHallsScreen;