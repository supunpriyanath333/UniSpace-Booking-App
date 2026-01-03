import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { GlobalStyles, Colors } from "../styles/GlobalStyles";

export default function LoginScreen({ navigation }) {
  const [passwordVisible, setPasswordVisible] = useState(false);

  return (
    <View style={GlobalStyles.screen}>
      {/* Logo */}
      <Image
        source={require("../../assets/unispace-logo.png")}
        style={styles.logo}
        resizeMode="contain"
      />

      {/* Headings */}
      <Text style={GlobalStyles.title}>Get Started Now</Text>
      <Text style={GlobalStyles.subtitle}>Login to your account</Text>

      {/* Email */}
      <Text style={GlobalStyles.label}>Email</Text>
      <TextInput
        placeholder="Enter your email address"
        style={GlobalStyles.input}
        keyboardType="email-address"
      />

      {/* Password */}
      <Text style={GlobalStyles.label}>Password</Text>
      <View style={styles.passwordContainer}>
        <TextInput
          placeholder="Enter your password"
          style={styles.passwordInput}
          secureTextEntry={!passwordVisible}
        />
        <TouchableOpacity
          onPress={() => setPasswordVisible(!passwordVisible)}
        >
          <Ionicons
            name={passwordVisible ? "eye-off" : "eye"}
            size={22}
            color="#777"
          />
        </TouchableOpacity>
      </View>

      {/* Forgot password */}
      <TouchableOpacity style={styles.forgotContainer}>
        <Text style={styles.forgotText}>Forgot Password ?</Text>
      </TouchableOpacity>

      {/* Login button */}
      <TouchableOpacity style={GlobalStyles.buttonPrimary}>
        <Text style={GlobalStyles.buttonText}>Log in</Text>
      </TouchableOpacity>

      {/* Register */}
      <Text style={styles.registerText}>
        Are You a New User ?{" "}
        <Text
          style={styles.registerLink}
          onPress={() => navigation.navigate("Register")}
        >
          Register Now
        </Text>
      </Text>

      {/* Social login */}
      <View style={styles.socialContainer}>
        <TouchableOpacity style={styles.socialButton}>
          <Image
            source={require("../../assets/facebook.png")}
            style={styles.socialIcon}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.socialButton}>
          <Image
            source={require("../../assets/google.png")}
            style={styles.socialIcon}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  logo: {
    width: 180,
    height: 80,
    alignSelf: "center",
    marginBottom: 20,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 10,
    paddingHorizontal: 12,
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 12,
  },
  forgotContainer: {
    alignItems: "flex-end",
    marginTop: 8,
  },
  forgotText: {
    color: Colors.textDark,
    fontWeight: "500",
  },
  registerText: {
    textAlign: "center",
    marginTop: 20,
  },
  registerLink: {
    fontWeight: "700",
  },
  socialContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginTop: 20,
  },
  socialButton: {
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#EEE",
  },
  socialIcon: {
    width: 36,
    height: 36,
  },
});
