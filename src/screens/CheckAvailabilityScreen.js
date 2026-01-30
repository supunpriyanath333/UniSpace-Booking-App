import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  SafeAreaView, Alert, ActivityIndicator, Modal, Platform, StatusBar as RNStatusBar
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';

// Firebase Imports
import { db } from '../firebase/firebaseConfig';
import { collection, getDocs, query, where } from 'firebase/firestore';

// Custom imports
import { GlobalStyles } from '../styles/GlobalStyles';
import HamburgerMenu from '../components/HamburgerMenu';
import HallCard from '../components/HallCard';
import Button from '../components/Button';

const CheckAvailabilityScreen = ({ navigation }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [availableHalls, setAvailableHalls] = useState([]);

  // --- POPUP STATES ---
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedHallForDetails, setSelectedHallForDetails] = useState(null);
  const [hallBookings, setHallBookings] = useState([]);
  const [loadingModal, setLoadingModal] = useState(false);

  const [date, setDate] = useState(new Date());
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [showPicker, setShowPicker] = useState({ mode: 'date', visible: false });

  const formatDate = (d) => {
    return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
  };

  const formatTimeAMPM = (t) => {
    return t.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  const parseTimeString = (timeStr, baseDate) => {
    if (!timeStr) return null;
    const cleanStr = timeStr.trim(); 
    const parts = cleanStr.split(/[\s]+/); 
    if (parts.length < 2) return null; 
    const [timeComponent, modifier] = parts; 
    let [hours, minutes] = timeComponent.split(':').map(Number);
    if (isNaN(hours) || isNaN(minutes)) return null;
    if (modifier.toUpperCase() === 'PM' && hours < 12) hours += 12;
    if (modifier.toUpperCase() === 'AM' && hours === 12) hours = 0;
    const resultDate = new Date(baseDate);
    resultDate.setHours(hours, minutes, 0, 0);
    return resultDate;
  };

  // --- NEW: FETCH DETAILS FOR POPUP ---
  const handleViewBookings = async (hall) => {
    setSelectedHallForDetails(hall);
    setModalVisible(true);
    setLoadingModal(true);
    setHallBookings([]);

    try {
      const q = query(collection(db, 'bookings'), where('hallId', '==', hall.id));
      const querySnapshot = await getDocs(q);
      const bookingData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setHallBookings(bookingData);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoadingModal(false);
    }
  };

  const handleCheck = async () => {
    if (startTime >= endTime) {
      Alert.alert("Invalid Time", "End time must be after start time.");
      return;
    }
    setLoading(true);
    setShowResults(false);

    try {
      const hallsRef = collection(db, 'halls');
      const hallsSnapshot = await getDocs(hallsRef);
      const allHalls = hallsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      const selectedDateStr = formatDate(date);
      const bookingsQuery = query(
        collection(db, 'bookings'), 
        where('date', '==', selectedDateStr)
      );
      const bookingsSnapshot = await getDocs(bookingsQuery);
      const bookingsToday = bookingsSnapshot.docs.map(doc => doc.data());

      const filteredHalls = allHalls.filter(hall => {
        const isHallActive = hall.isAvailable === true || String(hall.isAvailable).toLowerCase() === 'true';
        if (!isHallActive) return false;

        const hasConflict = bookingsToday.some(booking => {
          if (booking.hallId !== hall.id) return false; 
          const bookedStart = parseTimeString(booking.startTime, date);
          const bookedEnd = parseTimeString(booking.endTime, date);
          if (!bookedStart || !bookedEnd) return false; 
          const userStart = new Date(date);
          userStart.setHours(startTime.getHours(), startTime.getMinutes(), 0, 0);
          const userEnd = new Date(date);
          userEnd.setHours(endTime.getHours(), endTime.getMinutes(), 0, 0);
          return (userStart < bookedEnd && userEnd > bookedStart);
        });
        return !hasConflict;
      });

      setAvailableHalls(filteredHalls);
      setShowResults(true);
    } catch (error) {
      console.error("Error checking availability:", error);
      Alert.alert("Error", "Could not check availability.");
    } finally {
      setLoading(false);
    }
  };

  const onPickerChange = (event, selectedValue) => {
    setShowPicker({ ...showPicker, visible: false });
    if (event.type === 'set' && selectedValue) {
      if (showPicker.mode === 'date') setDate(selectedValue);
      else if (showPicker.mode === 'start') setStartTime(selectedValue);
      else if (showPicker.mode === 'end') setEndTime(selectedValue);
    }
  };

  return (
    <View style={GlobalStyles.container}>
      <StatusBar style="dark" backgroundColor="#F9EDB3" />
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
              Currently Booked Details For <Text style={{color: '#666'}}>{selectedHallForDetails?.name}</Text>
            </Text>

            <View style={styles.tableBorder}>
              <View style={styles.tableHeaderRow}>
                <View style={[styles.tableCell, styles.rightBorder]}><Text style={styles.headerText}>Date</Text></View>
                <View style={styles.tableCell}><Text style={styles.headerText}>Time</Text></View>
              </View>

              {loadingModal ? (
                <ActivityIndicator size="small" color="#DA291C" style={{ padding: 20 }} />
              ) : (
                <View>
                  {hallBookings.length > 0 ? (
                    hallBookings.map((item) => (
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
      <View style={GlobalStyles.headerWrapper}>
        <SafeAreaView edges={['top']} style={GlobalStyles.headerSection}>
          <View style={GlobalStyles.headerTopRow}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={30} color="black" />
            </TouchableOpacity>
            <Text style={GlobalStyles.headerTitle}>Check Availability</Text>
            <TouchableOpacity onPress={() => setIsMenuOpen(true)}>
              <Ionicons name="menu" size={38} color="black" />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.introText}>Check the available lecture halls and study rooms for your desired time.</Text>

        {/* SELECTOR CARD */}
        <View style={styles.selectorCard}>
          <View style={styles.cardHeader}>
            <Ionicons name="calendar-outline" size={24} color="black" />
            <Text style={styles.cardHeaderTitle}>Date and Time</Text>
          </View>

          <Text style={styles.inputLabel}>Date</Text>
          <TouchableOpacity style={styles.dateInput} onPress={() => setShowPicker({ mode: 'date', visible: true })}>
            <Text style={styles.inputText}>{formatDate(date)}</Text>
            <Ionicons name="chevron-down" size={18} color="#888" />
          </TouchableOpacity>

          <View style={styles.timeRow}>
            <View style={styles.timeContainer}>
              <Text style={styles.inputLabel}>Start Time</Text>
              <TouchableOpacity style={styles.timeInput} onPress={() => setShowPicker({ mode: 'start', visible: true })}>
                <Text style={styles.inputText}>{formatTimeAMPM(startTime)}</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.timeContainer}>
              <Text style={styles.inputLabel}>End Time</Text>
              <TouchableOpacity style={styles.timeInput} onPress={() => setShowPicker({ mode: 'end', visible: true })}>
                <Text style={styles.inputText}>{formatTimeAMPM(endTime)}</Text>
              </TouchableOpacity>
            </View>
          </View>

          <Button title="Check Availability" onPress={handleCheck} loading={loading} style={styles.mainBtn} />
        </View>

        {showPicker.visible && (
          <DateTimePicker
            value={showPicker.mode === 'date' ? date : (showPicker.mode === 'start' ? startTime : endTime)}
            mode={showPicker.mode === 'date' ? 'date' : 'time'}
            is24Hour={false}
            display="default"
            onChange={onPickerChange}
          />
        )}

        {/* RESULTS SECTION */}
        {showResults && (
          <View style={styles.resultsContainer}>
            <View style={styles.resultsSummary}>
              <Text style={styles.summaryText}>
                Available Halls on <Text style={styles.boldText}>{formatDate(date)}</Text>
                {"\n"}from <Text style={styles.boldText}>{formatTimeAMPM(startTime)} - {formatTimeAMPM(endTime)}</Text>
              </Text>
              <Text style={styles.countText}>({availableHalls.length} Halls Available)</Text>
            </View>

            {availableHalls.length === 0 ? (
              <View style={styles.emptyState}>
                 <Ionicons name="alert-circle-outline" size={50} color="#888" />
                 <Text style={styles.noHalls}>No halls available for this time slot.</Text>
              </View>
            ) : (
              availableHalls.map((hallItem) => (
                <HallCard
                  key={hallItem.id}
                  name={hallItem.name}               
                  location={hallItem.building}      
                  capacity={hallItem.capacity}      
                  tags={hallItem.tags || []}        
                  isAvailable={true} 
                  onBookNow={() => navigation.navigate('BookingForm', { hall: hallItem })}
                  onViewDetails={() => handleViewBookings(hallItem)} // Trigger Pop-up
                />
              ))
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  content: { padding: 20, paddingBottom: 110 },
  introText: { fontSize: 15, fontWeight: '700', marginBottom: 20, lineHeight: 22 },
  selectorCard: { backgroundColor: '#FFF', borderRadius: 20, padding: 20, borderWidth: 1, borderColor: '#BBB', elevation: 4 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  cardHeaderTitle: { fontSize: 20, fontWeight: 'bold', marginLeft: 10 },
  inputLabel: { fontSize: 16, fontWeight: 'bold', marginBottom: 8 },
  dateInput: { height: 48, borderWidth: 1, borderColor: '#999', borderRadius: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 15, marginBottom: 15 },
  timeRow: { flexDirection: 'row', justifyContent: 'space-between' },
  timeContainer: { width: '46%' },
  timeInput: { height: 48, borderWidth: 1, borderColor: '#999', borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  inputText: { color: '#333', fontSize: 16 },
  mainBtn: { marginTop: 25 },
  resultsContainer: { marginTop: 25 },
  resultsSummary: { marginBottom: 20 },
  summaryText: { fontSize: 16, color: '#333', lineHeight: 24 },
  boldText: { fontWeight: 'bold', color: '#000' },
  countText: { fontSize: 16, color: '#666', marginTop: 8, fontWeight: '500' },
  emptyState: { alignItems: 'center', marginTop: 30 },
  noHalls: { textAlign: 'center', marginTop: 10, color: '#666', fontSize: 16, fontWeight: '500' },

  // --- MODAL STYLES ---
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalContainer: { backgroundColor: '#FFF', width: '100%', borderRadius: 20, padding: 20, borderWidth: 1, borderColor: '#000' },
  modalHeader: { fontSize: 16, fontWeight: 'bold', marginBottom: 20 },
  tableBorder: { borderWidth: 1, borderColor: '#000' },
  tableHeaderRow: { flexDirection: 'row', backgroundColor: '#DDD', borderBottomWidth: 1, borderColor: '#000' },
  tableRow: { flexDirection: 'row', borderBottomWidth: 1, borderColor: '#CCC' },
  tableCell: { flex: 1, padding: 8, alignItems: 'center' },
  rightBorder: { borderRightWidth: 1, borderColor: '#000' },
  headerText: { fontWeight: 'bold', fontSize: 14 },
  cellText: { fontSize: 12 },
  noBookings: { padding: 15, textAlign: 'center', color: '#888' },
  noteSection: { marginTop: 20 },
  noteTitle: { fontWeight: 'bold', fontSize: 16 },
  noteDescription: { color: '#DA291C', marginTop: 5, fontSize: 14, fontWeight: '500' },
  okButton: { backgroundColor: '#DA291C', marginTop: 25, paddingVertical: 15, borderRadius: 15, alignItems: 'center', borderWidth: 1, borderColor: '#8b0000' },
  okButtonText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 }
});

export default CheckAvailabilityScreen;