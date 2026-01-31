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
import { useNavigation } from '@react-navigation/native'; // Import useNavigation hook

// Firebase & Context
import { auth, db } from '../firebase/firebaseConfig';
import { signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { AuthContext } from '../context/AuthContext';

// Custom Configuration
import colors from '../constants/colors';

const { width, height } = Dimensions.get('window');

const HamburgerMenu = ({ visible, onClose }) => {
  const navigation = useNavigation(); // Hook to access navigation
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

  // Navigation Handler
  const handleNavigation = (screenName) => {
    onClose(); // Close the menu first
    navigation.navigate(screenName); // Navigate to target screen
  };

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      { 
        text: "Logout", 
        style: "destructive", 
        onPress: async () => {
          try {
            await signOut(auth);
            if (logout) logout(); 
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
      <TouchableOpacity 
        style={styles.backgroundClose} 
        activeOpacity={1} 
        onPress={onClose} 
      />
      <View style={styles.menuPanel}>
        <TouchableOpacity style={styles.closeIcon} onPress={onClose}>
          <Ionicons name="close" size={32} color={colors.black} />
        </TouchableOpacity>

        <View style={styles.profileArea}>
          <View style={styles.avatarContainer}>
             <Image source={require('../../assets/logo.png')} style={styles.avatar} resizeMode="contain" />
          </View>
          <Text style={styles.userName}>{userName}</Text>
        </View>

        <View style={styles.menuItems}>
          {/* Linked to Notifications Screen */}
          <MenuTab 
            icon="notifications-outline" 
            title="Notifications" 
            onPress={() => handleNavigation('Notifications')} 
          />
          
          {/* Linked to Profile Screen */}
          <MenuTab 
            icon="person-outline" 
            title="Profile" 
            onPress={() => handleNavigation('Profile')} 
          />

          <MenuTab icon="accessibility-outline" title="Accessibility" onPress={() => {}} />
          <MenuTab icon="information-circle-outline" title="About Us" onPress={() => {}} />
          <MenuTab icon="settings-outline" title="Settings" onPress={() => {}} />
        </View>

        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const MenuTab = ({ icon, title, onPress }) => (
  <TouchableOpacity style={styles.tab} onPress={onPress}>
    <Ionicons name={icon} size={22} color={colors.black} />
    <Text style={styles.tabText}>{title}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  overlay: { 
    position: 'absolute', 
    top: 0, 
    left: 0, 
    right: 0, 
    bottom: 0, 
    backgroundColor: 'rgba(0,0,0,0.6)', 
    flexDirection: 'row', 
    zIndex: 2000 
  },
  backgroundClose: { flex: 1 },
  menuPanel: { 
    width: width * 0.75, 
    backgroundColor: '#F8F8F8', 
    height: height, 
    padding: 20, 
    paddingTop: 50,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
  },
  closeIcon: { alignSelf: 'flex-end', padding: 5 },
  profileArea: { alignItems: 'center', marginBottom: 30 },
  avatarContainer: { 
    width: 90, 
    height: 90, 
    borderRadius: 45, 
    backgroundColor: colors.white, 
    elevation: 4, 
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#EEE',
    justifyContent: 'center',
    alignItems: 'center'
  },
  avatar: { width: '80%', height: '80%' },
  userName: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    marginTop: 12, 
    color: colors.text 
  },
  menuItems: { flex: 1 },
  tab: { 
    flexDirection: 'row', 
    backgroundColor: colors.white, 
    padding: 15, 
    borderRadius: 12, 
    marginBottom: 12, 
    alignItems: 'center', 
    elevation: 1,
    borderWidth: 0.5,
    borderColor: '#EEE'
  },
  tabText: { 
    marginLeft: 15, 
    fontWeight: '500', 
    fontSize: 16, 
    color: colors.text 
  },
  logoutBtn: { 
    backgroundColor: colors.primary, 
    padding: 16, 
    borderRadius: 12, 
    alignItems: 'center', 
    marginBottom: 40,
    elevation: 3 
  },
  logoutText: { 
    color: colors.white, 
    fontWeight: 'bold', 
    fontSize: 16 
  }
});

export default HamburgerMenu;