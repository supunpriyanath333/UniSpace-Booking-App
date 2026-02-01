import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  Alert 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

// Firebase
import { db } from '../firebase/firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';

// Components
import Button from '../components/Button';

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

    if (!name || !building || !capacity) {
      Alert.alert("Error", "Please fill in all required fields.");
      return;
    }

    setLoading(true);

    try {
      const tagArray = tags.split(',').map(tag => tag.trim()).filter(tag => tag !== "");

      await addDoc(collection(db, "halls"), {
        building: building,           
        capacity: `${capacity} Students`, 
        isAvailable: true,             
        name: name,                   
        tags: tagArray                
      });

      Alert.alert("Success", "Hall added successfully!", [
        { text: "OK", onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      console.error("Error adding hall:", error);
      Alert.alert("Error", "Failed to add hall.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={GlobalStyles.container}>
      {/* Ensures StatusBar matches the yellow header background */}
      <StatusBar style="dark" backgroundColor={colors.secondary} />
      
      {/* GLOBAL HEADER - Using your exact structure */}
      <View style={GlobalStyles.headerWrapper}>
        <View style={GlobalStyles.headerSection}>
          <View style={GlobalStyles.headerTopRow}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={30} color={colors.black} />
            </TouchableOpacity>
            
            <Text style={GlobalStyles.headerTitle}>Add New Hall</Text>
            
            {/* Balancing view for center alignment */}
            <View style={{ width: 30 }} /> 
          </View>
        </View>
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
          style={[styles.input, styles.textArea]} 
          placeholder="e.g. WiFi, Projector, Audio, AC" 
          multiline={true}
          value={form.tags}
          onChangeText={(txt) => setForm({...form, tags: txt})}
        />

        <View style={styles.buttonWrapper}>
          <Button 
            title={loading ? "Saving..." : "Save Hall"} 
            onPress={handleAddHall}
            loading={loading}
            style={styles.submitBtnStyle}
          />
        </View>

      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  formContainer: { 
    padding: 20, 
    paddingBottom: 40 
  },
  label: { 
    fontSize: 15, 
    fontWeight: 'bold', 
    color: colors.black, 
    marginBottom: 8,
    marginLeft: 4
  },
  input: { 
    backgroundColor: '#FFF', 
    borderWidth: 1, 
    borderColor: '#CCC', 
    borderRadius: 12, 
    padding: 15, 
    marginBottom: 20, 
    fontSize: 16,
    color: colors.black,
    elevation: 1, // Subtle lift
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  buttonWrapper: {
    marginTop: 10,
  },
  submitBtnStyle: {
    backgroundColor: colors.primary,
    height: 55,
    borderRadius: 12,
  }
});

export default AddHall;