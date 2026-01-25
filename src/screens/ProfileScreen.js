import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  TouchableOpacity, 
  ScrollView, 
  SafeAreaView 
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { GlobalStyles } from '../styles/GlobalStyles';
import HamburgerMenu from '../components/HamburgerMenu';

const ProfileScreen = ({ navigation }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <View style={GlobalStyles.container}>
      {/* 1. Fixes the top bar color */}
      <StatusBar style="dark" backgroundColor="#F9EDB3" translucent={true} />

      <HamburgerMenu 
        visible={isMenuOpen} 
        onClose={() => setIsMenuOpen(false)} 
      />

      {/* 2. Seamless Yellow Header Section */}
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
        
        {/* Profile Section */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <Image 
              source={require('../../assets/logo.png')} 
              style={styles.avatar} 
            />
          </View>
          <TouchableOpacity>
            <Text style={styles.editPhotoText}>Edit</Text>
          </TouchableOpacity>
          <Text style={styles.userNameTitle}>Supun Priyanath</Text>
        </View>

        {/* Detail Cards */}
        <View style={styles.detailsContainer}>
          <ProfileField label="Name :" value="Supun Priyanath" />
          <ProfileField label="Contact No :" value="+94786350859" />
          <ProfileField label="Email :" value="supunpriyanath333@gmail.com" />
          
          <TouchableOpacity style={styles.changePassBtn}>
            <Text style={styles.changePassText}>Change Password</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.logoutBtn}>
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
};

const ProfileField = ({ label, value }) => (
  <View style={styles.fieldCard}>
    <View style={styles.fieldTextContainer}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <Text style={styles.fieldValue} numberOfLines={1}>{value}</Text>
    </View>
    <TouchableOpacity>
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
  avatar: { width: '100%', height: '100%' },
  editPhotoText: { color: '#DA291C', textDecorationLine: 'underline', marginTop: 8, fontWeight: '600' },
  userNameTitle: { fontSize: 22, fontWeight: 'bold', marginTop: 10 },
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
  },
  changePassText: { color: '#DA291C', fontWeight: 'bold', fontSize: 16 },
  logoutBtn: {
    backgroundColor: '#DA291C',
    padding: 18,
    borderRadius: 15,
    alignItems: 'center',
    marginTop: 30,
  },
  logoutText: { color: '#FFF', fontWeight: 'bold', fontSize: 18 }
});

export default ProfileScreen;