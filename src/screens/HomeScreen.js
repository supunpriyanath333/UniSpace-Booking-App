import React, { useState, useEffect } from 'react';
import { 
  View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, 
  Image, SafeAreaView, Platform, StatusBar as RNStatusBar, 
  ActivityIndicator, ImageBackground 
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

  const handleSearch = () => {
    if (searchQuery.trim().length > 0) {
      navigation.navigate('AllHalls', { initialSearch: searchQuery });
      setSearchQuery('');
    }
  };

  return (
    <View style={styles.container}>
      <HamburgerMenu visible={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      <StatusBar style="dark" backgroundColor="#F9EDB3" translucent={true} />
      
      <View style={styles.headerWrapper}>
        <SafeAreaView edges={['top']}>
          <View style={styles.headerContent}>
            <View style={styles.headerTop}>
              <Image source={require('../../assets/logo.png')} style={styles.logo} resizeMode="contain" />
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

            <View style={styles.searchBar}>
              <TextInput 
                placeholder="Search a hall or building..." 
                style={styles.searchInput}
                placeholderTextColor="#666"
                value={searchQuery}
                onChangeText={setSearchQuery}
                returnKeyType="search"
                onSubmitEditing={handleSearch}
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
          image={require('../../assets/hall_bg.jpg')} // Ensure these assets exist
          onPress={() => navigation.navigate('AllHalls')} 
        />
        
        <ActionCard 
          title="Check Availability" 
          subtitle="View room availability instantly" 
          icon="calendar-outline"
          image={require('../../assets/calendar_bg.jpg')}
          onPress={() => navigation.navigate('CheckAvailability')} 
        />

        <ActionCard 
          title="My Bookings" 
          subtitle="Manage your reservations" 
          icon="reader-outline"
          image={require('../../assets/booking_bg.jpg')}
          onPress={() => navigation.navigate('MyBookings')} 
        />

        <Text style={styles.sectionTitle}>Why UniSpace?</Text>
        <View style={styles.infoRow}>
            <InfoBox 
                icon="business" 
                number="150+" 
                label="Halls and Rooms" 
                image={require('../../assets/building_bg.jpg')} 
            />
            <InfoBox 
                icon="people" 
                number="10k +" 
                label="Total Capacity" 
                image={require('../../assets/students_bg.jpg')} 
            />
        </View>
      </ScrollView>
    </View>
  );
};

const ActionCard = ({ title, subtitle, icon, image, onPress }) => (
  <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
    <ImageBackground 
      source={image} 
      style={styles.cardBg} 
      imageStyle={{ opacity: 0.2, borderRadius: 18 }}
    >
      <View style={styles.cardContentInner}>
        <View style={styles.cardIconContainer}>
          <Ionicons name={icon} size={32} color="black" />
        </View>
        <View style={styles.cardTextContainer}>
          <Text style={styles.cardTitle}>{title}</Text>
          <Text style={styles.cardSub}>{subtitle}</Text>
        </View>
        <Ionicons name="arrow-forward-outline" size={24} color="#DA291C" />
      </View>
    </ImageBackground>
  </TouchableOpacity>
);

const InfoBox = ({ icon, number, label, image }) => (
    <View style={styles.infoBox}>
        <ImageBackground 
            source={image} 
            style={styles.infoBg} 
            imageStyle={{ opacity: 0.2, borderRadius: 15 }}
        >
            <Ionicons name={icon} size={30} color="#333" />
            <Text style={styles.infoNumber}>{number}</Text>
            <Text style={styles.infoLabel}>{label}</Text>
        </ImageBackground>
    </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  headerWrapper: {
    backgroundColor: '#F9EDB3',
    paddingTop: Platform.OS === 'android' ? RNStatusBar.currentHeight : 0,
    borderWidth: 0.5,
    borderBottomWidth: 0.5,
    borderBottomRightRadius: 15,
    borderBottomLeftRadius: 15,
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
  
  // Card Styles with ImageBackground
  card: {
    backgroundColor: '#F9EDB3',
    borderRadius: 18,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#000',
    elevation: 3,
    overflow: 'hidden',
  },
  cardBg: { width: '100%' },
  cardContentInner: {
    flexDirection: 'row',
    padding: 20,
    alignItems: 'center',
  },
  cardIconContainer: { marginRight: 18 },
  cardTextContainer: { flex: 1 },
  cardTitle: { fontSize: 18, fontWeight: 'bold' },
  cardSub: { fontSize: 14, color: '#373434', fontWeight:'bold' },

  // Info Box Styles with ImageBackground
  infoRow: { flexDirection: 'row', justifyContent: 'space-between' },
  infoBox: {
    backgroundColor: '#F2F2F2',
    width: '48%',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#0b0a0a',
    marginBottom: 20,
    overflow: 'hidden',
  },
  infoBg: {
    padding: 15,
    alignItems: 'center',
    width: '100%',
  },
  infoNumber: { fontSize: 18, fontWeight: 'bold', marginTop: 5 },
  infoLabel: { fontSize: 14, color: '#252323', fontWeight: 'bold' }
});

export default HomeScreen;