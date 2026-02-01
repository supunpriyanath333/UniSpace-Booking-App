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
import { useNavigation } from '@react-navigation/native';

// Firebase & Context
import { auth, db } from '../firebase/firebaseConfig';
import { signOut } from 'firebase/auth';
import { doc, getDoc, collection, query, where, onSnapshot } from 'firebase/firestore';
import { AuthContext } from '../context/AuthContext';

// Custom Configuration
import colors from '../constants/colors';

const { width, height } = Dimensions.get('window');

const HamburgerMenu = ({ visible, onClose }) => {
  const navigation = useNavigation();
  const { logout } = useContext(AuthContext);
  const [userName, setUserName] = useState('Loading...');
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    let unsubscribeUser = () => {};
    let unsubscribeNotify = () => {};

    if (visible && auth.currentUser) {
      // 1. Fetch User Data
      const fetchUserData = async () => {
        try {
          const userDoc = await getDoc(doc(db, "users", auth.currentUser.uid));
          if (userDoc.exists()) {
            setUserName(userDoc.data().name);
          }
        } catch (error) {
          setUserName("User");
        }
      };
      fetchUserData();

      // 2. Real-time Unread Notification Count
      const q = query(
        collection(db, 'notifications'),
        where('userId', '==', auth.currentUser.uid),
        where('isRead', '==', false)
      );

      unsubscribeNotify = onSnapshot(q, (snapshot) => {
        setUnreadCount(snapshot.size);
      });
    }

    return () => {
      unsubscribeNotify();
    };
  }, [visible]);

  if (!visible) return null;

  const handleNavigation = (screenName) => {
    onClose();
    navigation.navigate(screenName);
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
          <MenuTab 
            icon="notifications-outline" 
            title="Notifications" 
            onPress={() => handleNavigation('Notifications')} 
            badgeCount={unreadCount} // Added badgeCount prop
          />
          
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

// Updated MenuTab with Badge Support
const MenuTab = ({ icon, title, onPress, badgeCount }) => (
  <TouchableOpacity style={styles.tab} onPress={onPress}>
    <View style={styles.iconContainer}>
      <Ionicons name={icon} size={22} color={colors.black} />
      {badgeCount > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{badgeCount > 9 ? '9+' : badgeCount}</Text>
        </View>
      )}
    </View>
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
  iconContainer: {
    width: 25,
    alignItems: 'center',
    justifyContent: 'center'
  },
  tabText: { 
    marginLeft: 15, 
    fontWeight: '500', 
    fontSize: 16, 
    color: colors.text 
  },
  badge: {
    position: 'absolute',
    top: -8,
    right: -10,
    backgroundColor: 'red',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
    borderWidth: 1,
    borderColor: colors.white
  },
  badgeText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: 'bold'
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