import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import Button from '../components/Button'; // Reusing your button
import colors from '../constants/colors';

const HallDetailsScreen = ({ route }) => {
  const { hall } = route.params; // Get the data passed from the previous screen

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image source={hall.image} style={styles.image} resizeMode="contain" />
      </View>
      
      <View style={styles.detailsContainer}>
        <Text style={styles.title}>{hall.name}</Text>
        <Text style={styles.capacity}>Capacity: {hall.capacity} Pax</Text>
        
        <Text style={styles.descTitle}>Description</Text>
        <Text style={styles.description}>
          This hall is equipped with a high-quality sound system, projector, and air conditioning. 
          Perfect for large lectures and events.
        </Text>

        <Button 
            title="Book Now" 
            onPress={() => alert('Booking feature coming next!')} 
            style={{ marginTop: 40 }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  imageContainer: { height: 250, backgroundColor: colors.secondary, justifyContent: 'center', alignItems: 'center' },
  image: { width: '80%', height: '80%' },
  detailsContainer: { padding: 25, flex: 1, backgroundColor: '#fff', borderTopLeftRadius: 30, borderTopRightRadius: 30, marginTop: -20 },
  title: { fontSize: 26, fontWeight: 'bold', color: colors.black },
  capacity: { fontSize: 16, color: colors.gray, marginTop: 5, marginBottom: 20 },
  descTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  description: { lineHeight: 22, color: '#444' }
});

export default HallDetailsScreen;