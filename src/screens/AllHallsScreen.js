import React from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../constants/colors';

const HALLS_DATA = [
  { id: '1', name: 'Main Auditorium', capacity: '1000', image: require('../../assets/logo.png') }, // Replace with real images later
  { id: '2', name: 'Science Faculty Hall', capacity: '250', image: require('../../assets/logo.png') },
  { id: '3', name: 'Engineering Lecture Theatre', capacity: '150', image: require('../../assets/logo.png') },
];

const AllHallsScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={colors.gray} />
        <TextInput style={styles.input} placeholder="Search for halls..." />
      </View>

      <FlatList
        data={HALLS_DATA}
        keyExtractor={item => item.id}
        contentContainerStyle={{ padding: 20 }}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.card} 
            onPress={() => navigation.navigate('HallDetails', { hall: item })}
          >
            <Image source={item.image} style={styles.cardImage} resizeMode="contain" />
            <View style={styles.cardInfo}>
              <Text style={styles.cardTitle}>{item.name}</Text>
              <Text style={styles.cardSub}>Capacity: {item.capacity} Seats</Text>
              <Text style={styles.moreText}>Tap for details</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color={colors.primary} />
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  searchContainer: {
    flexDirection: 'row',
    backgroundColor: colors.lightGray,
    margin: 20,
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#eee'
  },
  input: { marginLeft: 10, flex: 1, fontSize: 16 },
  card: {
    flexDirection: 'row',
    backgroundColor: colors.secondary, // Pale Yellow
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#eee',
    elevation: 3,
  },
  cardImage: { width: 60, height: 60, marginRight: 15 },
  cardInfo: { flex: 1 },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: colors.black },
  cardSub: { fontSize: 14, color: '#555', marginTop: 4 },
  moreText: { fontSize: 12, color: colors.primary, marginTop: 4, fontWeight: 'bold' }
});

export default AllHallsScreen;