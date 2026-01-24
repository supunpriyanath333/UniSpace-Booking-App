import React, { useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import Button from '../components/Button';
import colors from '../constants/colors';

const ProfileScreen = () => {
  const { logout } = useContext(AuthContext);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Your Profile</Text>
      
      {/* Reusable Button we created earlier */}
      <Button 
        title="Logout" 
        onPress={logout} 
        style={{ width: '80%', backgroundColor: colors.gray }} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  }
});

export default ProfileScreen; // MUST have this line