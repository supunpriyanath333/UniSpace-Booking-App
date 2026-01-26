import React, { useContext, useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Image, 
  Dimensions,
  Alert 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Firebase & Context
import { auth, db } from '../firebase/firebaseConfig';
import { signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { AuthContext } from '../context/AuthContext';

const { width, height } = Dimensions.get('window');

const HamburgerMenu = ({ visible, onClose }) => {
  const { logout } = useContext(AuthContext);
  const [userName, setUserName] = useState('Loading...');

  useEffect(() => {
    const fetchUserData = async () => {
      if (auth.currentUser) {
        try {
          const userDoc = await getDoc(doc(db, "users", auth.currentUser.uid));
          if (userDoc.exists()) {
            setUserName(userDoc.data().name);
          }
        } catch (error) {
          console.error("Error fetching user name:", error);
          setUserName("User");
        }
      }
    };

    if (visible) fetchUserData();
  }, [visible]);

  if (!visible) return null;

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      { 
        text: "Logout", 
        style: "destructive", 
        onPress: async () => {
          try {
            await signOut(auth);
            logout(); 
            onClose();
          } catch (error) {
            Alert.alert("Error", "Failed to log out.");
          }
        } 
      }
    ]);
  };

  return (
    <View style={styles.overlay}>
      <TouchableOpacity style={styles.backgroundClose} activeOpacity={1} onPress={onClose} />
      <View style={styles.menuPanel}>
        <TouchableOpacity style={styles.closeIcon} onPress={onClose}>
          <Ionicons name="close" size={30} color="black" />
        </TouchableOpacity>

        <View style={styles.profileArea}>
          <View style={styles.avatarContainer}>
             <Image source={require('../../assets/logo.png')} style={styles.avatar} />
          </View>
          <Text style={styles.userName}>{userName}</Text>
        </View>

        <View style={styles.menuItems}>
          <MenuTab icon="person-outline" title="Profile" />
          <MenuTab icon="accessibility-outline" title="Accessibility" />
          <MenuTab icon="information-circle-outline" title="About Us" />
          <MenuTab icon="settings-outline" title="Settings" />
        </View>

        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const MenuTab = ({ icon, title }) => (
  <TouchableOpacity style={styles.tab}>
    <Ionicons name={icon} size={22} color="black" />
    <Text style={styles.tabText}>{title}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  overlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', flexDirection: 'row', zIndex: 2000 },
  backgroundClose: { flex: 1 },
  menuPanel: { width: width * 0.75, backgroundColor: '#F5F5F5', height: height, padding: 20, paddingTop: 50 },
  closeIcon: { alignSelf: 'flex-end' },
  profileArea: { alignItems: 'center', marginBottom: 30 },
  avatarContainer: { width: 100, height: 100, borderRadius: 50, backgroundColor: 'white', elevation: 5, overflow: 'hidden' },
  avatar: { width: '100%', height: '100%' },
  userName: { fontSize: 18, fontWeight: 'bold', marginTop: 10 },
  menuItems: { flex: 1 },
  tab: { flexDirection: 'row', backgroundColor: 'white', padding: 15, borderRadius: 12, marginBottom: 12, alignItems: 'center', elevation: 2 },
  tabText: { marginLeft: 15, fontWeight: '500' },
  logoutBtn: { backgroundColor: '#DA291C', padding: 15, borderRadius: 12, alignItems: 'center', marginBottom: 40 },
  logoutText: { color: 'white', fontWeight: 'bold' }
});

export default HamburgerMenu;