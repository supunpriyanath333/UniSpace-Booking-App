import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  TextInput, 
  Modal, 
  Alert 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

// Firebase & Global Imports
import { db, auth } from '../firebase/firebaseConfig';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { GlobalStyles } from '../styles/GlobalStyles';
import HamburgerMenu from '../components/HamburgerMenu';
import Button from '../components/Button';

const BookingForm = ({ route, navigation }) => {
  const { hall } = route.params; 
  
  // UI State
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showBookedModal, setShowBookedModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Form State
  const [form, setForm] = useState({
    date: '', startTime: '', endTime: '',
    eventName: '', lecturerName: '', capacity: '', contact: ''
  });

  const handleBooking = async () => {
    if (!form.date || !form.eventName) {
      Alert.alert("Error", "Please fill in the required fields.");
      return;
    }
    
    setLoading(true);
    try {
      await addDoc(collection(db, 'bookings'), {
        ...form,
        hallId: hall.id,
        hallName: hall.name,
        location: hall.building,
        userId: auth.currentUser?.uid || 'guest',
        status: 'Pending',
        timestamp: serverTimestamp()
      });
      setShowSuccessModal(true);
    } catch (e) {
      console.error(e);
      Alert.alert("Error", "Booking failed. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={GlobalStyles.container}>
      <StatusBar style="dark" backgroundColor="#F9EDB3" translucent={true} />

      {/* 1. Hamburger Menu Integration */}
      <HamburgerMenu 
        visible={isMenuOpen} 
        onClose={() => setIsMenuOpen(false)} 
      />

      {/* 2. Global Yellow Header Section */}
      <View style={GlobalStyles.headerWrapper}>
        <SafeAreaView edges={['top']}>
          <View style={GlobalStyles.headerSection}>
            <View style={GlobalStyles.headerTopRow}>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Ionicons name="arrow-back" size={30} color="black" />
              </TouchableOpacity>
              
              <Text style={GlobalStyles.headerTitle}>Book Lecture Hall</Text>
              
              <TouchableOpacity onPress={() => setIsMenuOpen(true)}>
                <Ionicons name="menu" size={38} color="black" />
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Hall Info Card */}
        <View style={styles.card}>
          <Text style={styles.hallName}>{hall.name}</Text>
          <View style={styles.infoRow}>
            <Ionicons name="location-outline" size={16} color="#666" />
            <Text style={styles.hallSub}> {hall.building}</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="people-outline" size={16} color="#666" />
            <Text style={styles.hallSub}> Capacity - {hall.capacity}</Text>
          </View>
        </View>

        {/* Date & Time Selection */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="calendar-outline" size={24} color="black" />
            <Text style={styles.sectionTitle}> Date and Time</Text>
          </View>

          <Text style={styles.label}>Date</Text>
          <TextInput 
            style={styles.input} 
            placeholder="DD/MM/YYYY" 
            placeholderTextColor="#999"
            onChangeText={(t) => setForm({...form, date: t})} 
          />
          
          <View style={styles.row}>
            <View style={{ flex: 1, marginRight: 10 }}>
              <Text style={styles.label}>Start Time</Text>
              <TextInput 
                style={styles.input} 
                placeholder="-- : --" 
                placeholderTextColor="#999"
                onChangeText={(t) => setForm({...form, startTime: t})} 
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>End Time</Text>
              <TextInput 
                style={styles.input} 
                placeholder="-- : --" 
                placeholderTextColor="#999"
                onChangeText={(t) => setForm({...form, endTime: t})} 
              />
            </View>
          </View>
          
          <TouchableOpacity onPress={() => setShowBookedModal(true)}>
            <Text style={styles.linkText}>View Currently Booked Details</Text>
          </TouchableOpacity>
        </View>

        {/* Purpose Section */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="reader-outline" size={24} color="black" />
            <Text style={styles.sectionTitle}> Purpose</Text>
          </View>

          <Text style={styles.label}>Lecture/Event Name</Text>
          <TextInput style={styles.input} placeholder="Ex : ICT 3243 UX & UI" onChangeText={(t) => setForm({...form, eventName: t})} />
          
          <Text style={styles.label}>Lecturer Name</Text>
          <TextInput style={styles.input} placeholder="Ex : Dr. Sapumal Perera" onChangeText={(t) => setForm({...form, lecturerName: t})} />
          
          <Text style={styles.label}>Capacity</Text>
          <TextInput style={styles.input} placeholder="Ex : 30" keyboardType="numeric" onChangeText={(t) => setForm({...form, capacity: t})} />
          
          <Text style={styles.label}>Contact Number</Text>
          <TextInput style={styles.input} placeholder="Ex : 0771234567" keyboardType="phone-pad" onChangeText={(t) => setForm({...form, contact: t})} />
        </View>

        <Button title="Book Now" onPress={handleBooking} loading={loading} style={styles.bookBtn} />
      </ScrollView>

      {/* POPUP 1: Currently Booked */}
      <Modal visible={showBookedModal} transparent animationType="fade" onRequestClose={() => setShowBookedModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.bookedModal}>
            <Text style={styles.modalHeader}>Currently Booked Details For <Text style={{color: '#555'}}>{hall.name}</Text></Text>
            
            <View style={styles.table}>
              <View style={[styles.tableRow, styles.tableHeaderRow]}>
                <Text style={styles.tableHeaderText}>Date</Text>
                <Text style={styles.tableHeaderText}>Time</Text>
              </View>
              {/* Dummy Data for Demo */}
              <View style={styles.tableRow}><Text>24/12/2025</Text><Text>13:00 - 15:00</Text></View>
              <View style={styles.tableRow}><Text>24/12/2025</Text><Text>15:00 - 17:00</Text></View>
            </View>

            <Text style={styles.noteText}>
              Note: If you want to book this hall, please choose a time without these reserved times.
            </Text>
            
            <Button title="OK" onPress={() => setShowBookedModal(false)} style={{marginTop: 15}} />
          </View>
        </View>
      </Modal>

      {/* POPUP 2: Success */}
      <Modal visible={showSuccessModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.successModal}>
            <Text style={styles.successText}>
              Your booking request has been successfully created. It will be approved shortly. Check your "My Bookings" details.
            </Text>
            <Button 
              title="OK" 
              onPress={() => { setShowSuccessModal(false); navigation.navigate('MainTabs'); }} 
              style={{marginTop: 20, width: '80%'}} 
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  scrollContainer: { padding: 20, paddingBottom: 50 },
  card: { backgroundColor: 'white', borderRadius: 20, padding: 20, marginBottom: 20, elevation: 3, shadowOpacity: 0.1 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  
  // Text Styles
  hallName: { fontSize: 22, fontWeight: 'bold', marginBottom: 8 },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 5 },
  hallSub: { color: '#555', fontSize: 15, marginLeft: 5 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginLeft: 8 },
  label: { fontWeight: 'bold', marginTop: 12, marginBottom: 6, fontSize: 15 },
  
  // Input Styles
  input: { borderWidth: 1, borderColor: '#bbb', borderRadius: 12, padding: 12, backgroundColor: '#fff', fontSize: 16 },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  linkText: { color: '#DA291C', textDecorationLine: 'underline', textAlign: 'center', marginTop: 20, fontWeight: '600' },
  bookBtn: { marginTop: 10 },

  // Modal Styles
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center' },
  bookedModal: { backgroundColor: 'white', width: '85%', borderRadius: 15, padding: 20, elevation: 5 },
  modalHeader: { fontSize: 18, fontWeight: 'bold', marginBottom: 15, textAlign: 'center' },
  
  table: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, overflow: 'hidden' },
  tableRow: { flexDirection: 'row', justifyContent: 'space-between', padding: 10, borderBottomWidth: 1, borderBottomColor: '#eee' },
  tableHeaderRow: { backgroundColor: '#ddd' },
  tableHeaderText: { fontWeight: 'bold', fontSize: 15 },
  
  noteText: { color: '#DA291C', marginTop: 15, fontSize: 13, textAlign: 'center' },
  
  successModal: { backgroundColor: 'white', width: '85%', borderRadius: 15, padding: 25, alignItems: 'center', elevation: 5 },
  successText: { textAlign: 'center', fontSize: 16, fontWeight: '600', lineHeight: 24 }
});

export default BookingForm;