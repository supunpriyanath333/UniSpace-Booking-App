import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TextInput, 
  TouchableOpacity, 
  Image,
  SafeAreaView,
  Platform,
  StatusBar as RNStatusBar,
  ActivityIndicator
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import HamburgerMenu from '../components/HamburgerMenu';

// Firebase Imports
import { auth, db } from '../firebase/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';

const HomeScreen = ({ navigation }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [firstName, setFirstName] = useState(''); 
  const [loading, setLoading] = useState(true);
  
  // 1. New State for Search Query
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const userRef = doc(db, "users", user.uid);
          const userSnap = await getDoc(userRef);

          if (userSnap.exists()) {
            const data = userSnap.data();
            if (data.name) {
              const nameParts = data.name.trim().split(' ');
              setFirstName(nameParts[0]); 
            } else {
              setFirstName("Student");
            }
          } else {
            setFirstName("Guest");
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setFirstName("User");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // 2. New Function to handle navigation to search results
  const handleSearch = () => {
    if (searchQuery.trim().length > 0) {
      navigation.navigate('AllHalls', { initialSearch: searchQuery });
      setSearchQuery(''); // Optional: clear search after navigating
    }
  };

  return (
    <View style={styles.container}>
      <HamburgerMenu 
        visible={isMenuOpen} 
        onClose={() => setIsMenuOpen(false)} 
      />

      <StatusBar style="dark" backgroundColor="#F9EDB3" translucent={true} />
      
      <View style={styles.headerWrapper}>
        <SafeAreaView edges={['top']}>
          <View style={styles.headerContent}>
            <View style={styles.headerTop}>
              <Image 
                source={require('../../assets/logo.png')} 
                style={styles.logo}
                resizeMode="contain"
              />
              <TouchableOpacity onPress={() => setIsMenuOpen(true)}>
                <Ionicons name="menu" size={38} color="black" />
              </TouchableOpacity>
            </View>

            <View style={styles.greetingContainer}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={styles.greetingTitle}>Hii.. </Text>
                {loading ? (
                  <ActivityIndicator size="small" color="#DA291C" />
                ) : (
                  <Text style={styles.greetingTitle}>{firstName} !</Text>
                )}
              </View>
              <Text style={styles.greetingSub}>Book your space with UniSpace..</Text>
            </View>

            {/* 3. Updated Search Bar with logic */}
            <View style={styles.searchBar}>
              <TextInput 
                placeholder="Search a hall or building..." 
                style={styles.searchInput}
                placeholderTextColor="#666"
                value={searchQuery}
                onChangeText={setSearchQuery}
                returnKeyType="search"
                onSubmitEditing={handleSearch} // Trigger on "Enter" key
              />
              <Ionicons name="mic-outline" size={22} color="black" style={{marginRight: 10}} />
              <TouchableOpacity onPress={handleSearch}>
                <Ionicons name="search-outline" size={22} color="black" />
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>

        <ActionCard 
          title="Book a Room" 
          subtitle="Reserve your space now" 
          icon="home-outline"
          onPress={() => navigation.navigate('AllHalls')} 
        />
        
        <ActionCard 
          title="Check Availability" 
          subtitle="View room availability instantly" 
          icon="calendar-outline"
          onPress={() => navigation.navigate('CheckAvailability')} 
        />

        <ActionCard 
          title="My Bookings" 
          subtitle="Manage your reservations" 
          icon="reader-outline"
          onPress={() => navigation.navigate('MyBookings')} 
        />

        <Text style={styles.sectionTitle}>Why UniSpace?</Text>
        <View style={styles.infoRow}>
            <View style={styles.infoBox}>
                <Ionicons name="business" size={30} color="#333" />
                <Text style={styles.infoNumber}>150+</Text>
                <Text style={styles.infoLabel}>Halls and Rooms</Text>
            </View>
            <View style={styles.infoBox}>
                <Ionicons name="people" size={30} color="#333" />
                <Text style={styles.infoNumber}>10k +</Text>
                <Text style={styles.infoLabel}>Total Capacity</Text>
            </View>
        </View>
      </ScrollView>
    </View>
  );
};

// ... ActionCard and styles remain exactly the same as your code ...
const ActionCard = ({ title, subtitle, icon, onPress }) => (
  <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
    <View style={styles.cardIconContainer}>
      <Ionicons name={icon} size={32} color="black" />
    </View>
    <View style={styles.cardTextContainer}>
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.cardSub}>{subtitle}</Text>
    </View>
    <Ionicons name="arrow-forward-outline" size={24} color="#DA291C" />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  headerWrapper: {
    backgroundColor: '#F9EDB3',
    paddingTop: Platform.OS === 'android' ? RNStatusBar.currentHeight : 0,
    borderBottomWidth: 1,
    borderColor: '#000',
  },
  headerContent: { paddingHorizontal: 20, paddingBottom: 25 },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 },
  logo: { width: 120, height: 45 },
  greetingContainer: { marginVertical: 15 },
  greetingTitle: { fontSize: 26, fontWeight: 'bold' },
  greetingSub: { fontSize: 14, color: '#444' },
  searchBar: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 25,
    paddingHorizontal: 15,
    height: 50,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#000',
    marginTop: 5,
  },
  searchInput: { flex: 1, fontSize: 16 },
  content: { padding: 20, paddingBottom: 110 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', marginVertical: 15, color: '#000' },
  card: {
    flexDirection: 'row',
    backgroundColor: '#F9EDB3',
    borderRadius: 18,
    padding: 20,
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 1.2,
    borderColor: '#000',
    elevation: 3,
  },
  cardIconContainer: { marginRight: 18 },
  cardTextContainer: { flex: 1 },
  cardTitle: { fontSize: 18, fontWeight: 'bold' },
  cardSub: { fontSize: 13, color: '#555' },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between' },
  infoBox: {
    backgroundColor: '#F2F2F2',
    width: '48%',
    borderRadius: 15,
    padding: 15,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DDD',
    marginBottom: 20,
  },
  infoNumber: { fontSize: 18, fontWeight: 'bold', marginTop: 5 },
  infoLabel: { fontSize: 12, color: '#666' }
});

export default HomeScreen;