import React, { useState, useEffect } from 'react';
import { 
  View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, 
  SafeAreaView, Alert, Modal, TextInput, ActivityIndicator 
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { GlobalStyles } from '../styles/GlobalStyles';
import HamburgerMenu from '../components/HamburgerMenu';

// Firebase Imports
import { auth, db } from '../firebase/firebaseConfig';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { signOut, sendPasswordResetEmail } from 'firebase/auth';

const ProfileScreen = ({ navigation }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState({
    name: '',
    phone: '',
    email: '',
    role: ''
  });

  // Edit Modal State
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingField, setEditingField] = useState(null); // 'name' or 'phone'
  const [tempValue, setTempValue] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    const user = auth.currentUser;
    if (user) {
      try {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setUserData(docSnap.data());
        } else {
            // Fallback if no firestore doc exists
          setUserData({ ...userData, email: user.email });
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    }
    setLoading(false);
  };

  const handleLogout = () => {
    Alert.alert(
      "Log Out",
      "Are you sure you want to log out?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Log Out", 
          style: "destructive", 
          onPress: async () => {
            await signOut(auth);
            navigation.replace('Login'); 
          } 
        }
      ]
    );
  };

  const handleChangePassword = () => {
    Alert.alert(
      "Change Password",
      `Send a password reset email to ${userData.email}?`,
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Send Email", 
          onPress: async () => {
            try {
              await sendPasswordResetEmail(auth, userData.email);
              Alert.alert("Success", "Password reset email sent!");
            } catch (error) {
              Alert.alert("Error", error.message);
            }
          } 
        }
      ]
    );
  };

  const openEditModal = (field, currentValue) => {
    setEditingField(field);
    setTempValue(currentValue);
    setEditModalVisible(true);
  };

  const saveEdit = async () => {
    if (!tempValue.trim()) {
      Alert.alert("Error", "Field cannot be empty");
      return;
    }
    setSaving(true);
    try {
      const user = auth.currentUser;
      const userRef = doc(db, 'users', user.uid);
      
      // Update specific field dynamically
      await updateDoc(userRef, {
        [editingField]: tempValue
      });

      // Update local state immediately
      setUserData(prev => ({ ...prev, [editingField]: tempValue }));
      setEditModalVisible(false);
    } catch (error) {
      Alert.alert("Error", "Could not update profile.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={[GlobalStyles.container, {justifyContent:'center', alignItems:'center'}]}>
        <ActivityIndicator size="large" color="#DA291C" />
      </View>
    );
  }

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
              <Text style={GlobalStyles.headerTitle}>Profile</Text>
              <TouchableOpacity onPress={() => setIsMenuOpen(true)}>
                <Ionicons name="menu" size={38} color="black" />
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <Image 
              source={require('../../assets/logo.png')} 
              style={styles.avatar} 
            />
          </View>
          {/* Note: Photo editing usually requires extra library (expo-image-picker), kept as visual for now */}
          <TouchableOpacity onPress={() => Alert.alert("Info", "Photo upload feature coming soon!")}>
            <Text style={styles.editPhotoText}>Edit</Text>
          </TouchableOpacity>
          <Text style={styles.userNameTitle}>{userData.name || "User"}</Text>
          <Text style={styles.roleText}>{userData.role || "Student"}</Text>
        </View>

        {/* Detail Cards */}
        <View style={styles.detailsContainer}>
          <ProfileField 
            label="Name :" 
            value={userData.name} 
            onEdit={() => openEditModal('name', userData.name)} 
          />
          
          <ProfileField 
            label="Contact No :" 
            value={userData.phone} 
            onEdit={() => openEditModal('phone', userData.phone)} 
          />
          
          {/* Email is typically not editable directly to maintain auth integrity */}
          <View style={styles.fieldCard}>
            <View style={styles.fieldTextContainer}>
              <Text style={styles.fieldLabel}>Email :</Text>
              <Text style={styles.fieldValue} numberOfLines={1}>{userData.email}</Text>
            </View>
            <Ionicons name="lock-closed-outline" size={16} color="#999" />
          </View>
          
          <TouchableOpacity style={styles.changePassBtn} onPress={handleChangePassword}>
            <Text style={styles.changePassText}>Change Password</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>

      </ScrollView>

      {/* EDIT MODAL */}
      <Modal visible={editModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Edit {editingField === 'name' ? 'Name' : 'Phone Number'}</Text>
            
            <TextInput 
              style={styles.modalInput} 
              value={tempValue} 
              onChangeText={setTempValue}
              placeholder={editingField === 'name' ? 'Enter Name' : 'Enter Phone Number'}
              keyboardType={editingField === 'phone' ? 'phone-pad' : 'default'}
              autoFocus
            />

            <View style={styles.modalBtnRow}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setEditModalVisible(false)}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.saveBtn} onPress={saveEdit} disabled={saving}>
                {saving ? <ActivityIndicator color="#FFF" /> : <Text style={styles.saveBtnText}>Save</Text>}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </View>
  );
};

// Reusable Field Component
const ProfileField = ({ label, value, onEdit }) => (
  <View style={styles.fieldCard}>
    <View style={styles.fieldTextContainer}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <Text style={styles.fieldValue} numberOfLines={1}>{value || "Not Set"}</Text>
    </View>
    <TouchableOpacity onPress={onEdit}>
      <Text style={styles.editText}>Edit</Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  content: { padding: 20, paddingBottom: 110 },
  profileHeader: { alignItems: 'center', marginVertical: 20 },
  avatarContainer: {
    width: 130, height: 130, borderRadius: 65,
    borderWidth: 1, borderColor: '#000',
    overflow: 'hidden', backgroundColor: '#FFF',
    elevation: 5,
  },
  avatar: { width: '100%', height: '100%', resizeMode: 'contain' },
  editPhotoText: { color: '#DA291C', textDecorationLine: 'underline', marginTop: 8, fontWeight: '600' },
  userNameTitle: { fontSize: 22, fontWeight: 'bold', marginTop: 10 },
  roleText: { fontSize: 14, color: '#666', marginTop: 2 },
  
  detailsContainer: { marginTop: 10 },
  fieldCard: {
    backgroundColor: '#FFF',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#DDD',
    elevation: 3,
  },
  fieldTextContainer: { flex: 1, flexDirection: 'row', alignItems: 'center' },
  fieldLabel: { fontWeight: 'bold', fontSize: 15, color: '#000', marginRight: 8 },
  fieldValue: { fontSize: 14, color: '#666', flex: 1 },
  editText: { color: '#DA291C', fontWeight: 'bold', textDecorationLine: 'underline' },
  
  changePassBtn: {
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#DDD',
    elevation: 2,
    alignItems: 'center'
  },
  changePassText: { color: '#DA291C', fontWeight: 'bold', fontSize: 16 },
  
  logoutBtn: {
    backgroundColor: '#DA291C',
    padding: 18,
    borderRadius: 15,
    alignItems: 'center',
    marginTop: 30,
  },
  logoutText: { color: '#FFF', fontWeight: 'bold', fontSize: 18 },

  // Modal Styles
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContainer: { backgroundColor: '#FFF', width: '85%', padding: 25, borderRadius: 15, elevation: 5 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15, textAlign: 'center' },
  modalInput: { borderWidth: 1, borderColor: '#CCC', borderRadius: 8, padding: 10, fontSize: 16, marginBottom: 20 },
  modalBtnRow: { flexDirection: 'row', justifyContent: 'space-between' },
  cancelBtn: { flex: 1, padding: 12, marginRight: 10, alignItems: 'center', backgroundColor: '#EEE', borderRadius: 8 },
  cancelBtnText: { color: '#333', fontWeight: 'bold' },
  saveBtn: { flex: 1, padding: 12, marginLeft: 10, alignItems: 'center', backgroundColor: '#DA291C', borderRadius: 8 },
  saveBtnText: { color: '#FFF', fontWeight: 'bold' }
});

export default ProfileScreen;