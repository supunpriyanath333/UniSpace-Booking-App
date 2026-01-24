import React, { useContext } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import colors from '../constants/colors';
import { AuthContext } from '../context/AuthContext';
import Button from '../components/Button';

const RegisterScreen = ({ navigation }) => {
  const { login } = useContext(AuthContext);

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <Image source={require('../../assets/logo.png')} style={styles.logo} resizeMode="contain" />
      
      <View style={styles.header}>
        <Text style={styles.title}>Register Now</Text>
        <Text style={styles.subtitle}>Create Your New Account</Text>
      </View>

      <Text style={styles.label}>Name</Text>
      <TextInput style={styles.input} placeholder="Enter your name" />

      <Text style={styles.label}>Email</Text>
      <TextInput style={styles.input} placeholder="Enter your email address" />

      <Text style={styles.label}>Password</Text>
      <TextInput style={styles.input} placeholder="Enter your password" secureTextEntry />

      <Text style={styles.label}>Confirm Password</Text>
      <TextInput style={styles.input} placeholder="Confirm your password" secureTextEntry />

      <TouchableOpacity style={styles.loginLink} onPress={() => navigation.navigate('Login')}>
        <Text style={styles.boldText}>Already have an account ?</Text>
      </TouchableOpacity>

      <Button title="Sign up" onPress={login} style={{marginTop: 30}} />

      {/* Social Sign Up Section */}
      <View style={styles.socialSection}>
        <Text style={styles.orText}>Or Sign up with</Text>
        <View style={styles.socialIconsRow}>
          <TouchableOpacity>
            <Image source={require('../../assets/facebook.png')} style={styles.socialIcon} />
          </TouchableOpacity>
          <TouchableOpacity>
            <Image source={require('../../assets/google.png')} style={styles.socialIcon} />
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 30, backgroundColor: colors.white, flexGrow: 1 },
  logo: { width: 200, height: 60, alignSelf: 'center', marginBottom: 15 },
  header: { marginBottom: 15 },
  title: { fontSize: 26, fontWeight: 'bold' },
  subtitle: { color: colors.gray, fontSize: 16 },
  label: { fontWeight: 'bold', marginTop: 12, marginBottom: 8 },
  input: { borderWidth: 1, borderColor: colors.gray, borderRadius: 12, height: 50, paddingHorizontal: 15 },
  loginLink: { alignSelf: 'flex-end', marginVertical: 10 },
  boldText: { fontWeight: 'bold' },
  socialSection: { alignItems: 'center', marginTop: 30 },
  orText: { fontSize: 14, fontWeight: 'bold', marginBottom: 15 },
  socialIconsRow: { flexDirection: 'row', gap: 30 },
  socialIcon: { width: 50, height: 50 },
});

export default RegisterScreen;