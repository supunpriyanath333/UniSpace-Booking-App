import React, { useState } from 'react';
import { 
  View, Text, StyleSheet, Image, TextInput, 
  TouchableOpacity, ScrollView, SafeAreaView, Modal 
} from 'react-native';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import HamburgerMenu from '../components/HamburgerMenu'; // We will create this next

const HomeScreen = ({ navigation }) => {
  const [menuVisible, setMenuVisible] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      {/* HAMBURGER MENU MODAL */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={menuVisible}
        onRequestClose={() => setMenuVisible(false)}
      >
        <HamburgerMenu onClose={() => setMenuVisible(false)} navigation={navigation} />
      </Modal>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* YELLOW HEADER SECTION */}
        <View style={styles.header}>
          <View style={styles.topRow}>
            <View style={styles.logoContainer}>
              <Image 
                source={require('../../assets/logo.png')} 
                style={styles.logo} 
                resizeMode="contain" 
              />
            </View>
            <TouchableOpacity onPress={() => setMenuVisible(true)}>
              <Ionicons name="menu" size={40} color="black" />
            </TouchableOpacity>
          </View>

          <Text style={styles.welcomeText}>Hii.. Supun !</Text>
          <Text style={styles.subText}>Book your space with UniSpace..</Text>

          {/* SEARCH BAR */}
          <View style={styles.searchBar}>
            <Ionicons name="mic-outline" size={24} color="black" />
            <TextInput style={styles.searchInput} placeholder="" />
            <Ionicons name="search-outline" size={24} color="black" />
          </View>
        </View>

        {/* QUICK ACTIONS SECTION */}
        <View style={styles.content}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          
          <ActionCard 
            title="Book a Room" 
            sub="Reserve your space now" 
            icon={<FontAwesome5 name="home" size={24} color="black" />}
            onPress={() => navigation.navigate('AllHalls')}
          />
          <ActionCard 
            title="Check Availability" 
            sub="View room availability instantly" 
            icon={<Ionicons name="calendar" size={24} color="black" />}
            onPress={() => navigation.navigate('CheckAvailability')}
          />
          <ActionCard 
            title="My Bookings" 
            sub="Manage your reservations" 
            icon={<MaterialCommunityIcons name="clipboard-text-outline" size={24} color="black" />}
            onPress={() => navigation.navigate('MyBookings')}
          />

          {/* WHY UNISPACE SECTION */}
          <Text style={styles.sectionTitle}>Why UniSpace?</Text>
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Image source={require('../../assets/logo.png')} style={styles.statImg} />
              <Text style={styles.statText}>150+ Halls and Rooms</Text>
            </View>
            <View style={styles.statBox}>
              <Image source={require('../../assets/logo.png')} style={styles.statImg} />
              <Text style={styles.statText}>10k+ Total Capacity</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// Reusable Action Card Component
const ActionCard = ({ title, sub, icon, onPress }) => (
  <TouchableOpacity style={styles.card} onPress={onPress}>
    <View style={styles.cardIcon}>{icon}</View>
    <View style={styles.cardTextContainer}>
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.cardSub}>{sub}</Text>
    </View>
    <Ionicons name="arrow-forward-outline" size={24} color="#D32F2F" />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { backgroundColor: '#F9EDB3', padding: 20, borderBottomWidth: 1, borderColor: '#ccc' },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  logo: { width: 140, height: 50 },
  welcomeText: { fontSize: 26, fontWeight: 'bold', color: '#000' },
  subText: { fontSize: 16, color: '#555', marginBottom: 15 },
  searchBar: { 
    flexDirection: 'row', 
    backgroundColor: '#fff', 
    borderRadius: 25, 
    paddingHorizontal: 15, 
    height: 45, 
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#000'
  },
  searchInput: { flex: 1, paddingHorizontal: 10 },
  content: { padding: 20 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginVertical: 15 },
  card: { 
    flexDirection: 'row', 
    backgroundColor: '#F9EDB3', 
    borderRadius: 15, 
    padding: 15, 
    alignItems: 'center', 
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd'
  },
  cardIcon: { marginRight: 15 },
  cardTextContainer: { flex: 1 },
  cardTitle: { fontSize: 16, fontWeight: 'bold' },
  cardSub: { fontSize: 12, color: '#444' },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between' },
  statBox: { width: '48%', borderRadius: 15, overflow: 'hidden', borderWidth: 1, borderColor: '#ccc' },
  statImg: { width: '100%', height: 100 },
  statText: { textAlign: 'center', fontWeight: 'bold', padding: 5, fontSize: 12 }
});

export default HomeScreen;