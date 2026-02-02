import React, { useState, useContext } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import colors from '../constants/colors';
import { AuthContext } from '../context/AuthContext';
import Button from '../components/Button';

// Firebase Imports
import { auth, db } from '../firebase/firebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

const RegisterScreen = ({ navigation }) => {
  const { login } = useContext(AuthContext);
  
  // State Management
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    // 1. Validation
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      Alert.alert("Error", "Password should be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      // 2. Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
      const user = userCredential.user;

      // 3. Save additional user info (Name) to Firestore
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name: name,
        email: email.toLowerCase(),
        createdAt: new Date().toISOString(),
        role: 'student' // Default role
      });

      // 4. Log the user in via Context
      login(user.stsTokenManager.accessToken);
      
    } catch (error) {
      console.log(error.code);
      let msg = "Registration failed.";
      if (error.code === 'auth/email-already-in-use') msg = "That email is already registered.";
      if (error.code === 'auth/invalid-email') msg = "Invalid email format.";
      
      Alert.alert("Registration Error", msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <Image source={require('../../assets/logo 1.png')} style={styles.logo} resizeMode="contain" />
      
      <View style={styles.header}>
        <Text style={styles.title}>Register Now</Text>
        <Text style={styles.subtitle}>Create Your New Account</Text>
      </View>

      <Text style={styles.label}>Name</Text>
      <TextInput 
        style={styles.input} 
        placeholder="Enter your name" 
        value={name}
        onChangeText={setName}
      />

      <Text style={styles.label}>Email</Text>
      <TextInput 
        style={styles.input} 
        placeholder="Enter your email address" 
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      <Text style={styles.label}>Password</Text>
      <TextInput 
        style={styles.input} 
        placeholder="Enter your password" 
        secureTextEntry 
        value={password}
        onChangeText={setPassword}
      />

      <Text style={styles.label}>Confirm Password</Text>
      <TextInput 
        style={styles.input} 
        placeholder="Confirm your password" 
        secureTextEntry 
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />

      <TouchableOpacity style={styles.loginLink} onPress={() => navigation.navigate('Login')}>
        <Text style={styles.boldText}>Already have an account ?</Text>
      </TouchableOpacity>

      <Button 
        title="Sign up" 
        onPress={handleRegister} 
        loading={loading}
        style={{marginTop: 20}} 
      />

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
  logo: { width: 200, height: 100, alignSelf: 'center', marginBottom: 20 },
  header: { marginBottom: 0 },
  title: { fontSize: 26, fontWeight: 'bold' },
  subtitle: { color: colors.gray, fontSize: 16 },
  label: { fontWeight: 'bold', marginTop: 12, marginBottom: 8 },
  input: { borderWidth: 1, borderColor: colors.gray, borderRadius: 12, height: 50, paddingHorizontal: 15 },
  loginLink: { alignSelf: 'flex-end', marginVertical: 10 },
  boldText: { fontWeight: 'bold'},
  socialSection: { alignItems: 'center', marginTop: 30 },
  orText: { fontSize: 14, fontWeight: 'bold', marginBottom: 15 },
  socialIconsRow: { flexDirection: 'row', gap: 30 },
  socialIcon: { width: 100, height: 100 },
});

export default RegisterScreen;