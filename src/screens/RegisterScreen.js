import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";
import { GlobalStyles } from "../styles/GlobalStyles";

export default function RegisterScreen({ navigation }) {
  const [passwordVisible, setPasswordVisible] = useState(false);

  return (
    <View style={GlobalStyles.screen}>
      <Image
        source={require("../../assets/unispace-logo.png")}
        style={{ width: 180, height: 80, alignSelf: "center", marginBottom: 20 }}
        resizeMode="contain"
      />
      <Text style={GlobalStyles.title}>Create Account</Text>
      <Text style={GlobalStyles.subtitle}>Register to continue</Text>

      <Text style={GlobalStyles.label}>Name</Text>
      <TextInput placeholder="Enter your name" style={GlobalStyles.input} />

      <Text style={GlobalStyles.label}>Email</Text>
      <TextInput placeholder="Enter your email" style={GlobalStyles.input} />

      <Text style={GlobalStyles.label}>Password</Text>
      <TextInput
        placeholder="Enter your password"
        style={GlobalStyles.input}
        secureTextEntry={!passwordVisible}
      />

      <TouchableOpacity style={GlobalStyles.buttonPrimary}>
        <Text style={GlobalStyles.buttonText}>Register</Text>
      </TouchableOpacity>

      <Text style={{ textAlign: "center", marginTop: 20 }}>
        Already have an account?{" "}
        <Text
          style={{ fontWeight: "700" }}
          onPress={() => navigation.navigate("Login")}
        >
          Login
        </Text>
      </Text>
    </View>
  );
}
