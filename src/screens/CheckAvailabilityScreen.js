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
import { collection, getDocs } from 'firebase/firestore';

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

  // Date and Time States
  const [date, setDate] = useState(new Date());
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [showPicker, setShowPicker] = useState({ mode: 'date', visible: false });

  // Formatters
  const formatDate = (d) => `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
  
  // AM/PM Formatter
  const formatTimeAMPM = (t) => {
    return t.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  const onPickerChange = (event, selectedValue) => {
    setShowPicker({ ...showPicker, visible: false });
    if (event.type === 'set' && selectedValue) {
      if (showPicker.mode === 'date') setDate(selectedValue);
      else if (showPicker.mode === 'start') setStartTime(selectedValue);
      else if (showPicker.mode === 'end') setEndTime(selectedValue);
    }
  };

  const handleCheck = async () => {
    if (startTime >= endTime) {
      Alert.alert("Invalid Time", "End time must be after start time.");
      return;
    }

    setLoading(true);
    try {
      const hallsRef = collection(db, 'halls');
      const querySnapshot = await getDocs(hallsRef);
      const allHalls = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      const filtered = allHalls.filter(hall => {
        const status = hall.isAvailable;
        return (status === true || String(status).toLowerCase().trim() === "true");
      });

      setAvailableHalls(filtered);
      setShowResults(true);
    } catch (error) {
      Alert.alert("Error", "Could not fetch hall data.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={GlobalStyles.container}>
      <StatusBar style="dark" backgroundColor="#F9EDB3" translucent={true} />
      <HamburgerMenu visible={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      <View style={GlobalStyles.headerWrapper}>
        <SafeAreaView edges={['top']}>
          <View style={GlobalStyles.headerSection}>
            <View style={GlobalStyles.headerTopRow}>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Ionicons name="arrow-back" size={30} color="black" />
              </TouchableOpacity>
              <Text style={GlobalStyles.headerTitle}>Check Availability</Text>
              <TouchableOpacity onPress={() => setIsMenuOpen(true)}>
                <Ionicons name="menu" size={38} color="black" />
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.introText}>Check the available lecture halls and study rooms for your desired time.</Text>

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
            value={showPicker.mode === 'date' ? date : showPicker.mode === 'start' ? startTime : endTime}
            mode={showPicker.mode === 'date' ? 'date' : 'time'}
            is24Hour={false} // Enables AM/PM picker style
            onChange={onPickerChange}
          />
        )}

        {showResults && (
          <View style={styles.resultsContainer}>
            <View style={styles.resultsSummary}>
              <Text style={styles.summaryText}>
                Available Halls on <Text style={styles.boldText}>{formatDate(date)}</Text>
                {"\n"}from <Text style={styles.boldText}>{formatTimeAMPM(startTime)} - {formatTimeAMPM(endTime)}</Text>
              </Text>
              <Text style={styles.countText}>({availableHalls.length} Halls Available)</Text>
            </View>

            {availableHalls.map((hallItem) => (
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
            ))}
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
});

export default CheckAvailabilityScreen;