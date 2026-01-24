import React, { useContext } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, SafeAreaView } from 'react-native';
import { Ionicons, Feather, AntDesign } from '@expo/vector-icons';
import { AuthContext } from '../context/AuthContext';

const HamburgerMenu = ({ onClose, navigation }) => {
  const { logout } = useContext(AuthContext);

  const navigateTo = (screen) => {
    onClose();
    navigation.navigate(screen);
  };

  return (
    <View style={styles.overlay}>
      <SafeAreaView style={styles.menuContainer}>
        {/* PROFILE SECTION */}
        <View style={styles.profileSection}>
          <Image 
            source={require('../../assets/logo.png')} 
            style={styles.profilePic} 
          />
          <Text style={styles.profileName}>Supun Priyanath</Text>
        </View>

        {/* MENU ITEMS */}
        <View style={styles.itemsContainer}>
          <MenuItem icon={<Feather name="user" size={24} />} title="Profile" onPress={() => navigateTo('Profile')} />
          <MenuItem icon={<Ionicons name="accessibility-outline" size={24} />} title="Accessibility" />
          <MenuItem icon={<AntDesign name="infocirlceo" size={24} />} title="About Us" />
          <MenuItem icon={<AntDesign name="setting" size={24} />} title="Settings" />
        </View>

        {/* LOGOUT BUTTON */}
        <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>

        {/* CLOSE BUTTON */}
        <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
          <Ionicons name="close" size={30} color="black" />
        </TouchableOpacity>
      </SafeAreaView>
      <TouchableOpacity style={styles.outside} onPress={onClose} />
    </View>
  );
};

const MenuItem = ({ icon, title, onPress }) => (
  <TouchableOpacity style={styles.item} onPress={onPress}>
    <View style={styles.iconBox}>{icon}</View>
    <Text style={styles.itemText}>{title}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  overlay: { flex: 1, flexDirection: 'row', backgroundColor: 'rgba(0,0,0,0.5)' },
  menuContainer: { width: '80%', backgroundColor: '#F8F8F8', height: '100%', padding: 20 },
  outside: { width: '20%', height: '100%' },
  profileSection: { alignItems: 'center', marginTop: 40, marginBottom: 30 },
  profilePic: { width: 120, height: 120, borderRadius: 60, borderWidth: 2, borderColor: '#ccc' },
  profileName: { fontSize: 20, fontWeight: 'bold', marginTop: 15 },
  itemsContainer: { flex: 1 },
  item: { 
    flexDirection: 'row', 
    backgroundColor: '#fff', 
    padding: 15, 
    borderRadius: 15, 
    alignItems: 'center', 
    marginBottom: 10,
    elevation: 2
  },
  iconBox: { marginRight: 15 },
  itemText: { fontSize: 18, fontWeight: '600' },
  logoutBtn: { backgroundColor: '#E3242B', padding: 15, borderRadius: 15, alignItems: 'center', marginBottom: 20 },
  logoutText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  closeBtn: { position: 'absolute', top: 50, right: 20 }
});

export default HamburgerMenu;