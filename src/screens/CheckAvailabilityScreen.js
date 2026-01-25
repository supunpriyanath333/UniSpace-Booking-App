import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  SafeAreaView 
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

// Import your custom assets and components
import { GlobalStyles } from '../styles/GlobalStyles';
import HamburgerMenu from '../components/HamburgerMenu';
import HallCard from '../components/HallCard';
import Button from '../components/Button'; // Your specific Button.js

const CheckAvailabilityScreen = ({ navigation }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Mock function to simulate a search
  const handleCheck = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1500);
  };

  return (
    <View style={GlobalStyles.container}>
      {/* Seamless Status Bar: Matches Header Yellow */}
      <StatusBar style="dark" backgroundColor="#F9EDB3" translucent={true} />

      <HamburgerMenu 
        visible={isMenuOpen} 
        onClose={() => setIsMenuOpen(false)} 
      />

      {/* HEADER SECTION */}
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
        <Text style={styles.introText}>
          Check the available lecture halls and study rooms for your desired time.
        </Text>

        {/* 1. Selection Card */}
        <View style={styles.selectorCard}>
          <View style={styles.cardHeader}>
            <Ionicons name="calendar-outline" size={24} color="black" />
            <Text style={styles.cardHeaderTitle}>Date and Time</Text>
          </View>

          <Text style={styles.inputLabel}>Date</Text>
          <View style={styles.dateInput}>
            <Text style={styles.inputText}>12/01/2026</Text>
          </View>

          <View style={styles.timeRow}>
            <View style={styles.timeContainer}>
              <Text style={styles.inputLabel}>Start Time</Text>
              <View style={styles.timeInput}>
                <Text style={styles.inputText}>13 : 00</Text>
              </View>
            </View>

            <View style={styles.timeContainer}>
              <Text style={styles.inputLabel}>End Time</Text>
              <View style={styles.timeInput}>
                <Text style={styles.inputText}>15 : 00</Text>
              </View>
            </View>
          </View>

          {/* Using your specific Button component */}
          <Button 
            title="Check Availability" 
            onPress={handleCheck} 
            loading={loading}
            style={styles.mainCheckBtn}
          />
        </View>

        {/* 2. Results Summary Section */}
        <View style={styles.resultsSummary}>
          <Text style={styles.summaryText}>
            Available Halls and Rooms on <Text style={styles.boldText}>12.01.2026</Text> 
            {"\n"}from <Text style={styles.boldText}>13:00 - 15:00</Text>
          </Text>
          <Text style={styles.countText}>(20 Halls and Rooms Available)</Text>
        </View>

        {/* 3. Results List using HallCard component */}
        <HallCard 
          name="Lecture Hall 102"
          location="Sumangala Building - Floor 1"
          capacity="100 Students"
          tags={['WiFi', 'Projector', 'Audio', 'AC']}
          isAvailable={true}
          onBookNow={() => console.log("Booking 102")}
          onViewDetails={() => console.log("Details 102")}
        />

        <HallCard 
          name="Lecture Hall 103"
          location="Sumangala Building - Floor 1"
          capacity="50 Students"
          tags={['Projector', 'Audio', 'AC']}
          isAvailable={true}
          onBookNow={() => console.log("Booking 103")}
          onViewDetails={() => console.log("Details 103")}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  content: { 
    padding: 20, 
    paddingBottom: 110 
  },
  introText: { 
    fontSize: 15, 
    fontWeight: '700', 
    marginBottom: 20,
    lineHeight: 22 
  },
  
  // Selection Card Styling
  selectorCard: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#BBB',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardHeader: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 20 
  },
  cardHeaderTitle: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    marginLeft: 10 
  },
  inputLabel: { 
    fontSize: 16, 
    fontWeight: 'bold', 
    marginBottom: 8 
  },
  dateInput: {
    height: 48,
    borderWidth: 1,
    borderColor: '#999',
    borderRadius: 12,
    justifyContent: 'center',
    paddingHorizontal: 15,
    marginBottom: 15
  },
  timeRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between' 
  },
  timeContainer: { 
    width: '46%' 
  },
  timeInput: {
    height: 48,
    borderWidth: 1,
    borderColor: '#999',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center'
  },
  inputText: { 
    color: '#555', 
    fontSize: 16 
  },
  mainCheckBtn: {
    marginTop: 25, // Providing clear separation for the main action
  },

  // Results Section Styling
  resultsSummary: { 
    marginVertical: 25 
  },
  summaryText: { 
    fontSize: 16, 
    color: '#333',
    lineHeight: 24 
  },
  boldText: { 
    fontWeight: 'bold', 
    color: '#000' 
  },
  countText: { 
    fontSize: 16, 
    color: '#666', 
    marginTop: 10, 
    fontWeight: '500' 
  }
});

export default CheckAvailabilityScreen;