import React, { useState, useEffect } from 'react';
import { 
  View, Text, StyleSheet, ScrollView, TouchableOpacity, 
  TextInput, Modal, Alert 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import DateTimePicker from '@react-native-community/datetimepicker';

// Firebase Imports
import { db, auth } from '../firebase/firebaseConfig';
import { collection, addDoc, serverTimestamp, query, where, getDocs } from 'firebase/firestore';

// Custom Configuration
import colors from '../constants/colors'; // Added color constants
import { GlobalStyles } from '../styles/GlobalStyles';
import HamburgerMenu from '../components/HamburgerMenu';
import Button from '../components/Button';

const BookingForm = ({ route, navigation }) => {
  const hall = route.params?.hall;

  // Form States
  const [date, setDate] = useState(new Date());
  const [startTime, setStartTime] = useState(null); 
  const [endTime, setEndTime] = useState(null);    
  const [eventName, setEventName] = useState('');
  const [lecturerName, setLecturerName] = useState('');
  const [capacity, setCapacity] = useState('');
  const [contact, setContact] = useState('');

  // UI States
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showPicker, setShowPicker] = useState({ mode: 'date', visible: false });
  const [showBookedModal, setShowBookedModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [existingBookings, setExistingBookings] = useState([]);

  useEffect(() => { 
    if (hall?.id) fetchHallBookings(); 
  }, [hall]);

  const fetchHallBookings = async () => {
    try {
      const q = query(collection(db, 'bookings'), where('hallId', '==', hall.id || 'JClKB5tOvypOHY6ole'));
      const querySnapshot = await getDocs(q);
      const bookedData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setExistingBookings(bookedData);
    } catch (e) { console.error("Error fetching bookings:", e); }
  };

  const formatDate = (d) => `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
  
  const formatTimeAMPM = (t) => {
    if (!t) return "-- : --";
    return t.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  const handleBooking = async () => {
    const user = auth.currentUser;
    if (!user) {
      Alert.alert("Error", "Please log in first.");
      return;
    }

    if (!startTime || !endTime) {
        Alert.alert("Error", "Please select start and end times.");
        return;
    }

    setLoading(true);
    try {
      await addDoc(collection(db, 'bookings'), {
        userId: user.uid, 
        hallId: hall?.id || 'JClKB5tOvypOHY6ole',
        hallName: hall?.name || 'Lecture Hall 102',
        location: hall?.building || 'Sumangala Building - Floor 1',
        date: formatDate(date),
        startTime: formatTimeAMPM(startTime),
        endTime: formatTimeAMPM(endTime),
        eventName, 
        lecturerName, 
        capacity, 
        contact,
        status: 'Pending', 
        createdAt: serverTimestamp()
      });
      setShowSuccessModal(true);
    } catch (e) {
      Alert.alert("Error", "Booking failed.");
    }
    setLoading(false);
  };

  return (
    <View style={GlobalStyles.container}>
      {/* Background matches headerWrapper */}
      <StatusBar style="dark" backgroundColor={colors.secondary} />
      <HamburgerMenu visible={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      <View style={GlobalStyles.headerWrapper}>
        <SafeAreaView edges={['top']} style={GlobalStyles.headerSection}>
          <View style={GlobalStyles.headerTopRow}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={30} color={colors.black} />
            </TouchableOpacity>
            <Text style={GlobalStyles.headerTitle}>Book Lecture Hall</Text>
            <TouchableOpacity onPress={() => setIsMenuOpen(true)}>
              <Ionicons name="menu" size={38} color={colors.black} />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>

      <ScrollView contentContainerStyle={styles.scrollBody} showsVerticalScrollIndicator={false}>
        {/* Hall Info Card */}
        <View style={styles.card}>
          <Text style={styles.hallTitle}>{hall?.name || "Lecture Hall 102"}</Text>
          <View style={styles.iconRow}>
            <Ionicons name="location-outline" size={16} color={colors.gray} />
            <Text style={styles.infoText}> {hall?.building || "Sumangala Building - Floor 1"}</Text>
          </View>
          <View style={styles.iconRow}>
            <Ionicons name="people-outline" size={16} color={colors.gray} />
            <Text style={styles.infoText}> Capacity - {hall?.capacity || "100"} Students</Text>
          </View>
        </View>

        {/* Date & Time Selection Card */}
        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <Ionicons name="calendar-outline" size={20} color={colors.black} />
            <Text style={styles.sectionTitle}> Date and Time</Text>
          </View>
          
          <Text style={styles.label}>Date</Text>
          <TouchableOpacity style={styles.inputBox} onPress={() => setShowPicker({ mode: 'date', visible: true })}>
            <Text style={styles.placeholderText}>{formatDate(date)}</Text>
          </TouchableOpacity>

          <View style={styles.timeRow}>
            <View style={{flex: 1}}>
              <Text style={styles.label}>Start Time</Text>
              <TouchableOpacity style={styles.inputBox} onPress={() => setShowPicker({ mode: 'start', visible: true })}>
                <Text style={styles.placeholderText}>{formatTimeAMPM(startTime)}</Text>
              </TouchableOpacity>
            </View>
            <View style={{flex: 1, marginLeft: 15}}>
              <Text style={styles.label}>End Time</Text>
              <TouchableOpacity style={styles.inputBox} onPress={() => setShowPicker({ mode: 'end', visible: true })}>
                <Text style={styles.placeholderText}>{formatTimeAMPM(endTime)}</Text>
              </TouchableOpacity>
            </View>
          </View>
          
          <TouchableOpacity onPress={() => setShowBookedModal(true)}>
            <Text style={styles.redLink}>View Currently Booked Details</Text>
          </TouchableOpacity>
        </View>

        {/* Purpose Form Card */}
        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <Ionicons name="reader-outline" size={20} color={colors.black} />
            <Text style={styles.sectionTitle}> Purpose</Text>
          </View>
          <Text style={styles.label}>Lecture/Event Name</Text>
          <TextInput style={styles.inputBox} placeholder="Ex : ICT 3243 UX & UI" placeholderTextColor={colors.gray} onChangeText={setEventName} />
          
          <Text style={styles.label}>Lecturer Name</Text>
          <TextInput style={styles.inputBox} placeholder="Ex : Dr. Sapumal Perera" placeholderTextColor={colors.gray} onChangeText={setLecturerName} />
          
          <Text style={styles.label}>Capacity</Text>
          <TextInput style={styles.inputBox} placeholder="Ex : 30" placeholderTextColor={colors.gray} keyboardType="numeric" onChangeText={setCapacity} />
          
          <Text style={styles.label}>Contact Number</Text>
          <TextInput style={styles.inputBox} placeholder="Ex : 0771234567" placeholderTextColor={colors.gray} keyboardType="phone-pad" onChangeText={setContact} />
        </View>

        <Button title="Book Now" onPress={handleBooking} loading={loading} style={styles.bookNowBtn} />
      </ScrollView>

      {/* Booked Details Modal */}
      <Modal visible={showBookedModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.tableModal}>
            <Text style={styles.modalHeaderTitle}>Currently Booked Details For <Text style={{color: colors.gray}}>{hall?.name || "Lecture Hall xxxx"}</Text></Text>
            <View style={styles.table}>
              <View style={styles.tableHeader}>
                <Text style={styles.tableHeaderText}>Date</Text>
                <Text style={styles.tableHeaderText}>Time</Text>
              </View>
              {existingBookings.map((b, i) => (
                <View key={i} style={styles.tableRow}>
                  <Text style={styles.cell}>{b.date}</Text>
                  <Text style={styles.cell}>{b.startTime} - {b.endTime}</Text>
                </View>
              ))}
            </View>
            <Text style={styles.noteLabel}>Note</Text>
            <Text style={styles.noteText}>If you want to book this hall, please choose a time without these reserved times.</Text>
            <TouchableOpacity style={styles.redOkBtn} onPress={() => setShowBookedModal(false)}>
              <Text style={styles.okBtnText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Success Modal */}
      <Modal visible={showSuccessModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.successModal}>
            <Text style={styles.successMsgText}>
              Your booking request has been successfully created. It will be approved shortly. Check your "My Bookings" details.
            </Text>
            <TouchableOpacity style={styles.redOkBtn} onPress={() => { setShowSuccessModal(false); navigation.navigate('MainTabs'); }}>
              <Text style={styles.okBtnText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {showPicker.visible && (
        <DateTimePicker 
          value={showPicker.mode === 'date' ? date : (showPicker.mode === 'start' ? (startTime || new Date()) : (endTime || new Date()))} 
          mode={showPicker.mode === 'date' ? 'date' : 'time'} 
          is24Hour={false} 
          onChange={(e, val) => {
            setShowPicker({...showPicker, visible: false});
            if(val) {
              if(showPicker.mode === 'date') setDate(val);
              else if(showPicker.mode === 'start') setStartTime(val);
              else setEndTime(val);
            }
          }} 
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  scrollBody: { padding: 15, paddingBottom: 40 },
  card: { 
    backgroundColor: colors.white, 
    borderRadius: 15, 
    padding: 15, 
    marginBottom: 20, 
    elevation: 4, 
    shadowColor: colors.black, 
    shadowOpacity: 0.1, 
    shadowRadius: 5 
  },
  hallTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 5, color: colors.text },
  iconRow: { flexDirection: 'row', alignItems: 'center', marginTop: 3 },
  infoText: { color: colors.gray, fontSize: 13 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: colors.text },
  label: { fontSize: 14, fontWeight: 'bold', marginBottom: 5, color: colors.text },
  inputBox: { borderWidth: 1, borderColor: colors.gray, borderRadius: 10, padding: 10, marginBottom: 15 },
  placeholderText: { color: colors.gray, textAlign: 'center' },
  timeRow: { flexDirection: 'row' },
  redLink: { color: colors.primary, textAlign: 'center', textDecorationLine: 'underline', fontSize: 13, fontWeight: 'bold' },
  bookNowBtn: { backgroundColor: colors.primary, borderRadius: 10, marginTop: 10 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  tableModal: { backgroundColor: colors.white, width: '90%', borderRadius: 20, padding: 20 },
  modalHeaderTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 20, color: colors.text },
  table: { borderWidth: 1, borderColor: colors.black },
  tableHeader: { flexDirection: 'row', backgroundColor: '#D1D1D1', borderBottomWidth: 1 },
  tableHeaderText: { flex: 1, padding: 8, fontWeight: 'bold', textAlign: 'center', borderRightWidth: 1, color: colors.black },
  tableRow: { flexDirection: 'row', borderBottomWidth: 1, borderColor: colors.black },
  cell: { flex: 1, padding: 8, textAlign: 'center', borderRightWidth: 1, fontSize: 12, color: colors.text },
  noteLabel: { fontWeight: 'bold', marginTop: 15, fontSize: 16, color: colors.text },
  noteText: { color: colors.error, fontSize: 12, marginTop: 5, fontWeight: '500' },
  redOkBtn: { backgroundColor: colors.primary, borderRadius: 10, padding: 12, marginTop: 20, width: '80%', alignSelf: 'center' },
  okBtnText: { color: colors.white, textAlign: 'center', fontWeight: 'bold', fontSize: 16 },
  successModal: { backgroundColor: colors.white, width: '85%', borderRadius: 20, padding: 25 },
  successMsgText: { textAlign: 'center', fontWeight: 'bold', fontSize: 15, lineHeight: 22, color: colors.text }
});

export default BookingForm;