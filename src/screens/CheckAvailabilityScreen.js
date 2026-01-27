import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  SafeAreaView, Alert, ActivityIndicator
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

  // Default: Today's date
  const [date, setDate] = useState(new Date());
  
  // Default Times
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  
  const [showPicker, setShowPicker] = useState({ mode: 'date', visible: false });

  // Format Date for UI and Firebase Query (e.g., "28/01/2026")
  const formatDate = (d) => {
    return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
  };

  // Format Time for UI (e.g., "10:30 AM")
  const formatTimeAMPM = (t) => {
    return t.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  // --- CRITICAL: PARSE STRING TIME TO DATE OBJECT ---
  // Converts "08:30 AM" -> Date Object on the *selected date*
  const parseTimeString = (timeStr, baseDate) => {
    if (!timeStr) return null;
    
    // clean string
    const cleanStr = timeStr.trim(); 
    
    // Split "10:30 AM" or "10:30AM"
    const parts = cleanStr.split(/[\s]+/); 
    if (parts.length < 2) return null; // Invalid format

    const [timeComponent, modifier] = parts; // "10:30", "AM"
    let [hours, minutes] = timeComponent.split(':').map(Number);

    if (isNaN(hours) || isNaN(minutes)) return null;

    // Convert to 24-hour format for comparison
    if (modifier.toUpperCase() === 'PM' && hours < 12) hours += 12;
    if (modifier.toUpperCase() === 'AM' && hours === 12) hours = 0;

    // Create a new date object based on the USER'S selected date
    const resultDate = new Date(baseDate);
    resultDate.setHours(hours, minutes, 0, 0);
    return resultDate;
  };

  const handleCheck = async () => {
    // 1. Validate Input
    if (startTime >= endTime) {
      Alert.alert("Invalid Time", "End time must be after start time.");
      return;
    }

    setLoading(true);
    setShowResults(false);

    try {
      // 2. Fetch ALL halls (to filter them later)
      const hallsRef = collection(db, 'halls');
      const hallsSnapshot = await getDocs(hallsRef);
      const allHalls = hallsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      // 3. Fetch bookings ONLY for the selected date
      const selectedDateStr = formatDate(date);
      const bookingsQuery = query(
        collection(db, 'bookings'), 
        where('date', '==', selectedDateStr)
      );
      const bookingsSnapshot = await getDocs(bookingsQuery);
      const bookingsToday = bookingsSnapshot.docs.map(doc => doc.data());

      // 4. MAIN LOGIC: Filter Halls
      const filteredHalls = allHalls.filter(hall => {
        // A. Check if Hall is Active/Available generally
        const isHallActive = hall.isAvailable === true || String(hall.isAvailable).toLowerCase() === 'true';
        if (!isHallActive) return false;

        // B. Check for Conflicts with Existing Bookings
        // We look for ANY booking for this hall that overlaps with user requested time.
        const hasConflict = bookingsToday.some(booking => {
          if (booking.hallId !== hall.id) return false; // Skip bookings for other halls

          // Parse booking times to Date objects
          const bookedStart = parseTimeString(booking.startTime, date);
          const bookedEnd = parseTimeString(booking.endTime, date);

          if (!bookedStart || !bookedEnd) return false; // Skip invalid data

          // Normalize User Times to the same date context for accurate comparison
          const userStart = new Date(date);
          userStart.setHours(startTime.getHours(), startTime.getMinutes(), 0, 0);

          const userEnd = new Date(date);
          userEnd.setHours(endTime.getHours(), endTime.getMinutes(), 0, 0);

          // OVERLAP FORMULA: (UserStart < BookedEnd) AND (UserEnd > BookedStart)
          const isOverlapping = (userStart < bookedEnd && userEnd > bookedStart);
          
          return isOverlapping;
        });

        // If there is a conflict, DO NOT include this hall (return false)
        return !hasConflict;
      });

      setAvailableHalls(filteredHalls);
      setShowResults(true);

    } catch (error) {
      console.error("Error checking availability:", error);
      Alert.alert("Error", "Could not check availability. Please try again.");
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

        {/* DATE PICKER COMPONENT */}
        {showPicker.visible && (
          <DateTimePicker
            value={showPicker.mode === 'date' ? date : (showPicker.mode === 'start' ? startTime : endTime)}
            mode={showPicker.mode === 'date' ? 'date' : 'time'}
            is24Hour={false} // Ensures AM/PM selector
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
                  onViewDetails={() => {}}
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
  noHalls: { textAlign: 'center', marginTop: 10, color: '#666', fontSize: 16, fontWeight: '500' }
});

export default CheckAvailabilityScreen;