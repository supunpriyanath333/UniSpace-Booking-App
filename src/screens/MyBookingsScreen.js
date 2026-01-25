import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { GlobalStyles } from '../styles/GlobalStyles';
import BookingCard from '../components/BookingCard';
import HamburgerMenu from '../components/HamburgerMenu';

const MyBookingsScreen = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('All');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <View style={GlobalStyles.container}>
      <StatusBar style="dark" backgroundColor="#F9EDB3" translucent={true} />
      
      <HamburgerMenu visible={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      {/* Header */}
      <View style={GlobalStyles.headerWrapper}>
        <SafeAreaView edges={['top']}>
          <View style={GlobalStyles.headerSection}>
            <View style={GlobalStyles.headerTopRow}>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Ionicons name="arrow-back" size={30} color="black" />
              </TouchableOpacity>
              <Text style={GlobalStyles.headerTitle}>My Bookings</Text>
              <TouchableOpacity onPress={() => setIsMenuOpen(true)}>
                <Ionicons name="menu" size={38} color="black" />
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Tab Filters */}
        <View style={styles.tabContainer}>
          {['All (3)', 'Pending (2)', 'Approved (1)'].map((tab) => {
            const label = tab.split(' ')[0];
            return (
              <TouchableOpacity 
                key={label}
                style={[styles.tab, activeTab === label && styles.activeTab]}
                onPress={() => setActiveTab(label)}
              >
                <Text style={[styles.tabText, activeTab === label && styles.activeTabText]}>
                  {tab}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Bookings List */}
        <BookingCard 
          hallName="Lecture Hall 102"
          location="Sumangala Building - Floor 1"
          date="12.12.2025"
          time="13:00 hr - 15:00 hr"
          subject="ICT 3243 UX & UI Lecture"
          students="30"
          status="Pending"
          onCancel={() => alert('Cancel 102')}
        />

        <BookingCard 
          hallName="Lecture Hall 103"
          location="Sumangala Building - Floor 1"
          date="24.12.2025"
          time="08:00 hr - 10:00 hr"
          subject="JPN 3242 Japanese Culture"
          students="40"
          status="Approved"
          onCancel={() => alert('Cancel 103')}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  content: { padding: 20, paddingBottom: 100 },
  tabContainer: { flexDirection: 'row', marginBottom: 20, justifyContent: 'space-between' },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#000',
    backgroundColor: '#FFF',
  },
  activeTab: { backgroundColor: '#F9EDB3' },
  tabText: { fontWeight: 'bold', fontSize: 13 },
  activeTabText: { color: '#000' },
});

export default MyBookingsScreen;