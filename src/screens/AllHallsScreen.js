import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TextInput, 
  TouchableOpacity, 
  SafeAreaView 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import HamburgerMenu from '../components/HamburgerMenu'; // 1. Import the component

const DATA = [
  {
    id: '102',
    name: 'Lecture Hall 102',
    location: 'Sumangala Building - Floor 1',
    capacity: '100 Students',
    tags: ['WiFi', 'Projector', 'Audio', 'AC'],
  },
  {
    id: '103',
    name: 'Lecture Hall 103',
    location: 'Sumangala Building - Floor 1',
    capacity: '50 Students',
    tags: ['Projector', 'Audio', 'AC'],
  },
  {
    id: '104',
    name: 'Lecture Hall 104',
    location: 'Sumangala Building - Floor 2',
    capacity: '120 Students',
    tags: ['WiFi', 'Projector', 'AC'],
  },
];

const AllHallsScreen = ({ navigation }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false); // 2. State for menu

  const renderHall = ({ item }) => (
    <View style={styles.hallCard}>
      <Text style={styles.hallTitle}>{item.name}</Text>
      
      <View style={styles.detailRow}>
        <Ionicons name="location-outline" size={16} color="#666" />
        <Text style={styles.detailText}>{item.location}</Text>
      </View>

      <View style={styles.detailRow}>
        <Ionicons name="people-outline" size={16} color="#666" />
        <Text style={styles.detailText}>Capacity - {item.capacity}</Text>
      </View>

      <View style={styles.tagContainer}>
        {item.tags.map((tag, index) => (
          <View key={index} style={styles.tag}>
            <Text style={styles.tagText}>{tag}</Text>
          </View>
        ))}
      </View>

      <TouchableOpacity style={styles.bookedBtn}>
        <Text style={styles.btnText}>Currently Booked Details</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.bookNowBtn}>
        <Text style={styles.btnText}>Book This Hall Now</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* 3. Place HamburgerMenu at the very top (Absolute Layer) */}
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
            
            {/* 4. Trigger the menu state */}
            <TouchableOpacity onPress={() => setIsMenuOpen(true)}>
              <Ionicons name="menu" size={35} color="black" />
            </TouchableOpacity>
          </View>

          {/* Search Bar */}
          <View style={styles.searchBar}>
            <TextInput 
              style={styles.searchInput} 
              // This prop prevents the keyboard from pushing the view up awkwardly
              returnKeyType="search" 
            />
            <Ionicons name="mic-outline" size={22} color="black" style={{marginRight: 10}} />
            <Ionicons name="search-outline" size={22} color="black" />
          </View>
        </SafeAreaView>
      </View>

      {/* List of Halls */}
      <FlatList
        data={DATA}
        renderItem={renderHall}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listPadding}
        showsVerticalScrollIndicator={false}
      />
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
    borderColor: '#000', // Changed to black to match your screenshot
    paddingTop: 10
  },
  headerTop: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    marginBottom: 15 
  },
  headerTitle: { fontSize: 22, fontWeight: 'bold' },
  searchBar: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 25,
    paddingHorizontal: 15,
    height: 45,
    alignItems: 'center',
    borderWidth: 1.5, // Slightly thicker border to match UI
    borderColor: '#000',
  },
  searchInput: { flex: 1, height: '100%' },
  listPadding: { padding: 15, paddingBottom: 100 },
  hallCard: {
    backgroundColor: '#FFF',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#BBB',
    elevation: 3,
  },
  hallTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  detailRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 5 },
  detailText: { marginLeft: 8, color: '#444', fontSize: 14, fontWeight: '500' },
  tagContainer: { flexDirection: 'row', flexWrap: 'wrap', marginVertical: 12 },
  tag: {
    backgroundColor: '#F9EDB3',
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#000'
  },
  tagText: { fontSize: 12, fontWeight: 'bold' },
  bookedBtn: {
    backgroundColor: '#DA291C',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#A00' // Slight border for depth
  },
  bookNowBtn: {
    backgroundColor: '#DA291C',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#A00'
  },
  btnText: { color: 'white', fontWeight: 'bold', fontSize: 16 }
});

export default AllHallsScreen;