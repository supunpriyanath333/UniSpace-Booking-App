import React, { useEffect, useRef } from "react";
import { StyleSheet, Animated } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export default function OnboardingLogo({ navigation }) {
  const scaleAnim = useRef(new Animated.Value(0.3)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1.4,
          friction: 4,
          useNativeDriver: true,
        }),
      ]),
      Animated.spring(scaleAnim, {
        toValue: 1.1,
        friction: 5,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setTimeout(() => {
        navigation.replace("Login");
      }, 800);
    });
  }, [navigation]);

  return (
    <LinearGradient
      colors={["#F4D35E", "#F08A5D"]}
      style={styles.container}
    >
      <Animated.Image
        source={require("../../assets/unispace-logo.png")}
        style={[
          styles.logo,
          {
            resizeMode: "contain", // ✅ FIXED: must be inside style
            transform: [{ scale: scaleAnim }],
            opacity: opacityAnim,
          },
        ]}
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
    width: 450,
    height: 300,
  },
});
