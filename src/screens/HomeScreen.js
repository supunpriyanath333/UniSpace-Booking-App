import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TextInput, 
  TouchableOpacity, 
  Image,
  SafeAreaView 
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import HamburgerMenu from '../components/HamburgerMenu'; // Ensure this path is correct

const HomeScreen = ({ navigation }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <View style={styles.container}>
      {/* The Hamburger Menu Component (Absolute Positioned) */}
      <HamburgerMenu 
        visible={isMenuOpen} 
        onClose={() => setIsMenuOpen(false)} 
      />

      <StatusBar style="dark" />
      
      {/* 1. Yellow Header Section */}
      <View style={styles.headerCard}>
        <SafeAreaView>
          <View style={styles.headerTop}>
            <Image 
              source={require('../../assets/logo.png')} 
              style={styles.logo}
              resizeMode="contain"
            />
            {/* Open Menu Button */}
            <TouchableOpacity onPress={() => setIsMenuOpen(true)}>
              <Ionicons name="menu" size={38} color="black" />
            </TouchableOpacity>
          </View>

          <View style={styles.greetingContainer}>
            <Text style={styles.greetingTitle}>Hii.. Supun !</Text>
            <Text style={styles.greetingSub}>Book your space with UniSpace..</Text>
          </View>

          {/* Search Bar inside Header */}
          <View style={styles.searchBar}>
            <TextInput 
              placeholder="Search..." 
              style={styles.searchInput}
              placeholderTextColor="#666"
            />
            <Ionicons name="mic-outline" size={22} color="black" style={{marginRight: 10}} />
            <Ionicons name="search-outline" size={22} color="black" />
          </View>
        </SafeAreaView>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>

        {/* 2. Action Buttons */}
        <ActionCard 
          title="Book a Room" 
          subtitle="Reserve your space now" 
          icon="home-outline"
          onPress={() => navigation.navigate('Bookings')} // Matches Tab name
        />
        
        <ActionCard 
          title="Check Availability" 
          subtitle="View room availability instantly" 
          icon="calendar-outline"
          onPress={() => navigation.navigate('Calendar')}
        />

        <ActionCard 
          title="My Bookings" 
          subtitle="Manage your reservations" 
          icon="reader-outline"
        />

        {/* 3. Why UniSpace Info Cards */}
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

// Reusable Action Card Component
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
  container: { 
    flex: 1, 
    backgroundColor: '#FFF' 
  },
  headerCard: {
    backgroundColor: '#F9EDB3',
    paddingHorizontal: 20,
    paddingBottom: 25,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderWidth: 1,
    borderColor: '#000',
  },
  headerTop: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    marginTop: 10 
  },
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
  content: { 
    padding: 20, 
    paddingBottom: 110 // Extra padding so content isn't hidden by Bottom Bar
  },
  sectionTitle: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    marginVertical: 15,
    color: '#000'
  },
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
  infoRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between' 
  },
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