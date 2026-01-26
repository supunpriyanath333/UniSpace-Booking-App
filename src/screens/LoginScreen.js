import React, { useState, useContext } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../constants/colors';
import { AuthContext } from '../context/AuthContext';
import Button from '../components/Button';

// Firebase Import
import { auth } from '../firebase/firebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const { login } = useContext(AuthContext);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter both email and password.");
      return;
    }

    setLoading(true);
    try {
      // 1. Firebase Auth Sign In
      const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
      const user = userCredential.user;

      // 2. Update AuthContext with the user token/info
      // This will trigger the navigator to switch to MainTabs
      login(user.stsTokenManager.accessToken); 
      
    } catch (error) {
      console.log(error.code);
      let errorMessage = "Login failed. Please check your credentials.";
      
      if (error.code === 'auth/invalid-email') errorMessage = "Invalid email format.";
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        errorMessage = "Invalid email or password.";
      }

      Alert.alert("Login Error", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <Image source={require('../../assets/logo.png')} style={styles.logo} resizeMode="contain" />
      
      <View style={styles.header}>
        <Text style={styles.title}>Get Started Now</Text>
        <Text style={styles.subtitle}>Login to your account</Text>
      </View>

      <Text style={styles.label}>Email</Text>
      <TextInput 
        style={styles.input} 
        placeholder="Enter your email address" 
        placeholderTextColor={colors.gray}
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      <Text style={styles.label}>Password</Text>
      <View style={styles.passContainer}>
        <TextInput 
          style={{flex: 1}} 
          placeholder="Enter your password" 
          placeholderTextColor={colors.gray}
          secureTextEntry={!passwordVisible} 
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
          <Ionicons name={passwordVisible ? "eye-outline" : "eye-off-outline"} size={20} color={colors.black} />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.forgot}>
        <Text style={styles.forgotText}>Forgot Password ?</Text>
      </TouchableOpacity>

      <Button 
        title="Log in" 
        onPress={handleLogin} 
        loading={loading}
        style={{marginTop: 20}} 
      />

      <View style={styles.footer}>
        <Text style={styles.footerText}>Are You a New User ? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={styles.boldText}>Register Now</Text>
        </TouchableOpacity>
      </View>

      {/* Social Login Section */}
      <View style={styles.socialSection}>
        <Text style={styles.orText}>Or Login with</Text>
        <View style={styles.socialIconsRow}>
          <TouchableOpacity style={styles.socialBtn}>
            <Image source={require('../../assets/facebook.png')} style={styles.socialIcon} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialBtn}>
            <Image source={require('../../assets/google.png')} style={styles.socialIcon} />
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 30, backgroundColor: colors.white, flexGrow: 1, justifyContent: 'center' },
  logo: { width: 220, height: 70, alignSelf: 'center', marginBottom: 20 },
  header: { marginBottom: 20 },
  title: { fontSize: 26, fontWeight: 'bold' },
  subtitle: { color: colors.gray, fontSize: 16 },
  label: { fontWeight: 'bold', marginTop: 15, marginBottom: 8, fontSize: 14 },
  input: { borderWidth: 1, borderColor: colors.gray, borderRadius: 12, height: 55, paddingHorizontal: 15 },
  passContainer: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: colors.gray, borderRadius: 12, height: 55, paddingHorizontal: 15 },
  forgot: { alignSelf: 'flex-end', marginVertical: 12 },
  forgotText: { fontWeight: 'bold' },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 25 },
  footerText: { fontSize: 14, fontWeight: 'bold' },
  boldText: { fontWeight: 'bold', color: colors.gray, fontSize: 14 },
  socialSection: { alignItems: 'center', marginTop: 40 },
  orText: { fontSize: 14, fontWeight: 'bold', marginBottom: 20 },
  socialIconsRow: { flexDirection: 'row', gap: 30 },
  socialBtn: { padding: 5 },
  socialIcon: { width: 50, height: 50 },
});

export default LoginScreen;