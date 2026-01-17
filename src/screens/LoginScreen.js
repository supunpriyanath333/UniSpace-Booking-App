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
import { Ionicons } from "@expo/vector-icons";

import GlobalStyles from "../styles/GlobalStyles";
import Button from "../components/Button";

export default function LoginScreen() {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const navigation = useNavigation();

  return (
    <View style={GlobalStyles.container}>
      {/* Logo */}
      <View style={pageStyles.logoContainer}>
        <Image
          source={require("../../assets/logo.png")}
          style={pageStyles.logo}
        />
      </View>

      {/* Title */}
      <Text style={GlobalStyles.title}>Get Started Now</Text>
      <Text style={GlobalStyles.subtitle}>Login to your account</Text>

      {/* Email */}
      <Text style={GlobalStyles.label}>Email</Text>
      <TextInput
        placeholder="Enter your email address"
        style={GlobalStyles.input}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      {/* Password */}
      <Text style={GlobalStyles.label}>Password</Text>
      <View style={pageStyles.passwordContainer}>
        <TextInput
          placeholder="Enter your password"
          secureTextEntry={!passwordVisible}
          style={pageStyles.passwordInput}
        />
        <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
          <Ionicons
            name={passwordVisible ? "eye-off-outline" : "eye-outline"}
            size={22}
            color="#555"
          />
        </TouchableOpacity>
      </View>

      {/* Forgot password */}
      <TouchableOpacity>
        <Text style={GlobalStyles.forgotText}>Forgot Password ?</Text>
      </TouchableOpacity>

      {/* Login button */}
      <Button
        title="Log in"
        onPress={() => navigation.replace("Home")}
      />

      {/* Register */}
      <Text style={GlobalStyles.registerText}>
        Are You a New User ?{" "}
        <Text
          style={GlobalStyles.registerLink}
          onPress={() => navigation.navigate("Register")}
        >
          Register Now
        </Text>
      </Text>

      {/* Divider */}
      <Text style={GlobalStyles.dividerText}>Or Login with</Text>

      {/* Social login */}
      <View style={GlobalStyles.socialContainer}>
        <TouchableOpacity style={pageStyles.socialButton}>
          <Image
            source={require("../../assets/facebook.png")}
            style={GlobalStyles.socialIcon}
          />
        </TouchableOpacity>

        <TouchableOpacity style={pageStyles.socialButton}>
          <Image
            source={require("../../assets/google.png")}
            style={GlobalStyles.socialIcon}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

// 🟢 Page-level CSS
const pageStyles = StyleSheet.create({
  // Logo styles now in page-level CSS
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

  // Password container
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#CCC",
    borderRadius: 10,
    paddingHorizontal: 15,
    height: 50,
    marginTop: 8,
  },
  passwordInput: {
    flex: 1,
    height: "100%",
  },

  // Social buttons
  socialButton: {
    padding: 5,
  },
});
