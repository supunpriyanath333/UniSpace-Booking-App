import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
} from "react-native";
import { useState } from "react";
import GlobalStyles from "../styles/GlobalStyles";
import { Ionicons } from "@expo/vector-icons";

export default function LoginScreen() {
  const [passwordVisible, setPasswordVisible] = useState(false);

  return (
    <View style={GlobalStyles.container}>
      {/* Logo */}
      <View style={GlobalStyles.logoContainer}>
        <Image
          source={require("../../assets/logo.png")}
          style={GlobalStyles.logo}
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
      <View style={GlobalStyles.passwordContainer}>
        <TextInput
          placeholder="Enter your password"
          secureTextEntry={!passwordVisible}
          style={GlobalStyles.passwordInput}
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
      <TouchableOpacity style={GlobalStyles.loginButton}>
        <Text style={GlobalStyles.loginButtonText}>Log in</Text>
      </TouchableOpacity>

      {/* Register */}
      <Text style={GlobalStyles.registerText}>
        Are You a New User ?{" "}
        <Text style={GlobalStyles.registerLink}>Register Now</Text>
      </Text>

      {/* Divider */}
      <Text style={GlobalStyles.dividerText}>Or Login with</Text>

      {/* Social login */}
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
