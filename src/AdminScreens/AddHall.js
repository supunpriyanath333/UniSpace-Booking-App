import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  Alert, 
  ActivityIndicator 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

// Firebase
import { db } from '../firebase/firebaseConfig';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

// Custom Config
import colors from '../constants/colors';
import { GlobalStyles } from '../styles/GlobalStyles';

const AddHall = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    location: '',
    capacity: '',
    description: '',
    tags: '', // Will be stored as an array
  });

  const handleAddHall = async () => {
    const { name, location, capacity, description, tags } = form;

    // Basic Validation
    if (!name || !location || !capacity) {
      Alert.alert("Error", "Please fill in all required fields (Name, Location, Capacity).");
      return;
    }

    setLoading(true);

    try {
      // Process tags into an array
      const tagArray = tags.split(',').map(tag => tag.trim()).filter(tag => tag !== "");

      await addDoc(collection(db, "halls"), {
        name,
        location,
        capacity: parseInt(capacity),
        description,
        tags: tagArray,
        isAvailable: true, // Default to available
        createdAt: serverTimestamp(),
        imageUrl: "https://via.placeholder.com/300" // Placeholder until you add image upload
      });

      Alert.alert("Success", "Hall added successfully!", [
        { text: "OK", onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      console.error("Error adding hall:", error);
      Alert.alert("Error", "Failed to add hall. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={GlobalStyles.container}>
      <StatusBar style="dark" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={28} color={colors.black} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add New Hall</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView contentContainerStyle={styles.formContainer} showsVerticalScrollIndicator={false}>
        
        <Text style={styles.label}>Hall Name *</Text>
        <TextInput 
          style={styles.input} 
          placeholder="e.g. Lecture Hall 01" 
          value={form.name}
          onChangeText={(txt) => setForm({...form, name: txt})}
        />

        <Text style={styles.label}>Location / Building *</Text>
        <TextInput 
          style={styles.input} 
          placeholder="e.g. Faculty of Engineering" 
          value={form.location}
          onChangeText={(txt) => setForm({...form, location: txt})}
        />

        <View style={styles.row}>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>Capacity *</Text>
            <TextInput 
              style={styles.input} 
              placeholder="e.g. 150" 
              keyboardType="numeric"
              value={form.capacity}
              onChangeText={(txt) => setForm({...form, capacity: txt})}
            />
          </View>
        </View>

        <Text style={styles.label}>Facilities / Tags (comma separated)</Text>
        <TextInput 
          style={styles.input} 
          placeholder="e.g. AC, Projector, Wi-Fi" 
          value={form.tags}
          onChangeText={(txt) => setForm({...form, tags: txt})}
        />

        <Text style={styles.label}>Description (Optional)</Text>
        <TextInput 
          style={[styles.input, styles.textArea]} 
          placeholder="Add details about the hall..." 
          multiline 
          numberOfLines={4}
          value={form.description}
          onChangeText={(txt) => setForm({...form, description: txt})}
        />

        <TouchableOpacity 
          style={[styles.submitBtn, loading && { backgroundColor: '#CCC' }]} 
          onPress={handleAddHall}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.submitText}>Save Hall</Text>
          )}
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingHorizontal: 20, 
    paddingTop: 60, 
    paddingBottom: 20,
    backgroundColor: colors.secondary 
  },
  headerTitle: { fontSize: 20, fontWeight: 'bold' },
  formContainer: { padding: 20, paddingBottom: 40 },
  label: { fontSize: 14, fontWeight: 'bold', color: colors.text, marginBottom: 8 },
  input: { 
    backgroundColor: '#FFF', 
    borderWidth: 1, 
    borderColor: '#DDD', 
    borderRadius: 12, 
    padding: 12, 
    marginBottom: 20, 
    fontSize: 15 
  },
  textArea: { height: 100, textAlignVertical: 'top' },
  row: { flexDirection: 'row', gap: 15 },
  submitBtn: { 
    backgroundColor: '#4CAF50', 
    padding: 16, 
    borderRadius: 12, 
    alignItems: 'center', 
    marginTop: 10,
    elevation: 3 
  },
  submitText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 }
});

export default AddHall;
