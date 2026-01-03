import React, { useEffect, useRef } from "react";
import { StyleSheet, Animated } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native"; // ✅ useNavigation hook

export default function OnboardingLogo() {
  const navigation = useNavigation(); // ✅ get navigation safely

  // Animation refs
  const scaleAnim = useRef(new Animated.Value(0.3)).current; // start small
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Parallel animation: fade-in + zoom
    Animated.sequence([
      Animated.parallel([
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1.4, // zoom bigger
          friction: 4,
          useNativeDriver: true,
        }),
      ]),
      // Settle slightly smaller for smooth effect
      Animated.spring(scaleAnim, {
        toValue: 1.1,
        friction: 5,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Navigate to Login after short delay
      setTimeout(() => {
        navigation.replace("Login");
      }, 800);
    });
  }, []);

  return (
    <LinearGradient
      colors={["#F4D35E", "#F08A5D"]}
      style={styles.container}
    >
      <Animated.Image
        source={require("../../assets/unispace-logo.png")} // make sure this exists
        style={[
          styles.logo,
          { transform: [{ scale: scaleAnim }], opacity: opacityAnim },
        ]}
        resizeMode="contain"
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 260,
    height: 120,
  },
});
