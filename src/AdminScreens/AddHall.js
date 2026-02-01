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
import { collection, addDoc } from 'firebase/firestore';

// Custom Config
import colors from '../constants/colors';
import { GlobalStyles } from '../styles/GlobalStyles';

const AddHall = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    building: '',
    capacity: '',
    tags: '', 
  });

  const handleAddHall = async () => {
    const { name, building, capacity, tags } = form;

    // Basic Validation
    if (!name || !building || !capacity) {
      Alert.alert("Error", "Please fill in all required fields (Name, Building, Capacity).");
      return;
    }

    setLoading(true);

    try {
      // Process tags into an array
      const tagArray = tags.split(',').map(tag => tag.trim()).filter(tag => tag !== "");

      // Adding to 'halls' collection with your exact field names and types
      await addDoc(collection(db, "halls"), {
        building: building,           // e.g., "Sumangala Building - Floor 1"
        capacity: `${capacity} Students`, // e.g., "100 Students"
        isAvailable: true,            // Boolean
        name: name,                   // String
        tags: tagArray                // Array of strings
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
          placeholder="e.g. Lecture Hall 102" 
          value={form.name}
          onChangeText={(txt) => setForm({...form, name: txt})}
        />

        <Text style={styles.label}>Building & Floor *</Text>
        <TextInput 
          style={styles.input} 
          placeholder="e.g. Sumangala Building - Floor 1" 
          value={form.building}
          onChangeText={(txt) => setForm({...form, building: txt})}
        />

        <Text style={styles.label}>Capacity (Number Only) *</Text>
        <TextInput 
          style={styles.input} 
          placeholder="e.g. 100" 
          keyboardType="numeric"
          value={form.capacity}
          onChangeText={(txt) => setForm({...form, capacity: txt})}
        />

        <Text style={styles.label}>Facilities / Tags (comma separated)</Text>
        <TextInput 
          style={styles.input} 
          placeholder="e.g. WiFi, Projector, Audio, AC" 
          value={form.tags}
          onChangeText={(txt) => setForm({...form, tags: txt})}
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
    fontSize: 15,
    color: colors.black
  },
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