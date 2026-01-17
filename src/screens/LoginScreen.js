import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";

import Button from "../components/Button";
import styles from "../styles/GlobalStyles";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Logo */}
      <View style={[styles.center, { marginTop: 40 }]}>
        <Image
          source={require("../../assets/logo.png")}
          style={{ width: 200, height: 70, resizeMode: "contain" }}
        />
      </View>

      {/* Titles */}
      <Text style={styles.title}>Get Started Now</Text>
      <Text style={styles.subtitle}>Login to your account</Text>

      {/* Email */}
      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your email address"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      {/* Password */}
      <Text style={styles.label}>Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {/* Forgot password */}
      <TouchableOpacity>
        <Text style={styles.forgot}>Forgot Password ?</Text>
      </TouchableOpacity>

      {/* Login Button */}
      <Button title="Log in" onPress={() => console.log("Login pressed")} />

      {/* Register */}
      <Text style={styles.registerText}>
        Are You a New User ?{" "}
        <Text style={styles.registerLink}>Register Now</Text>
      </Text>

      {/* Divider */}
      <Text style={styles.dividerText}>Or Login with</Text>

      {/* Social Login */}
      <View style={styles.socialRow}>
        <TouchableOpacity>
          <Image
            source={require("../../assets/facebook.png")}
            style={styles.socialIcon}
          />
        </TouchableOpacity>

        <TouchableOpacity>
          <Image
            source={require("../../assets/google.png")}
            style={styles.socialIcon}
          />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
