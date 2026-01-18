import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useState } from "react";
import { useNavigation } from "@react-navigation/native";

import GlobalStyles from "../styles/GlobalStyles";
import Button from "../components/Button"; 
export default function RegisterScreen() {
  const navigation = useNavigation();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  return (
    <View style={GlobalStyles.container}>
      <View style={pageStyles.logoContainer}>
        <Image
          source={require("../../assets/logo.png")}
          style={pageStyles.logo}
        />
      </View>

      {/* Title */}
      <Text style={GlobalStyles.title}>Register Now</Text>
      <Text style={GlobalStyles.subtitle}>
        Create Your New Account
      </Text>

      {/* Name */}
      <Text style={GlobalStyles.label}>Name</Text>
      <TextInput
        placeholder="Enter your name"
        style={GlobalStyles.input}
        value={name}
        onChangeText={setName}
      />

      {/* Email */}
      <Text style={GlobalStyles.label}>Email</Text>
      <TextInput
        placeholder="Enter your email"
        style={GlobalStyles.input}
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      {/* Password */}
      <Text style={GlobalStyles.label}>Password</Text>
      <TextInput
        placeholder="Enter your password"
        style={GlobalStyles.input}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      {/* Confirm Password */}
      <Text style={GlobalStyles.label}>Confirm Password</Text>
      <TextInput
        placeholder="Confirm your password"
        style={GlobalStyles.input}
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />

      {/* Already have account */}
      <Text style={GlobalStyles.registerText}>
        Already have an account ? {" "}
        <Text
          style={GlobalStyles.registerLink}
          onPress={() => navigation.goBack()}
        >
          Login
        </Text>
      </Text>

      <Button
        title="Sign up"
        onPress={() => navigation.replace("Home")}
      />

      {/* Divider */}
      <Text style={GlobalStyles.dividerText}>
        Or Sign up with
      </Text>

      {/* Social signup */}
      <View style={GlobalStyles.socialContainer}>
        <TouchableOpacity style={GlobalStyles.socialButton}>
          <Image
            source={require("../../assets/facebook.png")}
            style={GlobalStyles.socialIcon}
          />
        </TouchableOpacity>

        <TouchableOpacity style={GlobalStyles.socialButton}>
          <Image
            source={require("../../assets/google.png")}
            style={GlobalStyles.socialIcon}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

/* 🔹 PAGE-LEVEL CSS */
const pageStyles = StyleSheet.create({
  logoContainer: {
    alignItems: "center",
    marginTop: 10,
    marginBottom: 0,
  },
  logo: {
    width: 250,
    height: 150,
    resizeMode: "contain",
  },
});
