import { View, StyleSheet, Animated, Dimensions } from "react-native";
import { useEffect, useRef } from "react";
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get("window");

export default function SplashScreen({ navigation }) {
  const scaleAnim = useRef(new Animated.Value(0.4)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      // Step 1: fade + small logo
      Animated.parallel([
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 0.6,
          friction: 6,
          useNativeDriver: true,
        }),
      ]),

      // Step 2: medium logo
      Animated.spring(scaleAnim, {
        toValue: 0.8,
        friction: 5,
        useNativeDriver: true,
      }),

      // Step 3: full logo (final)
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      }),
    ]).start();

    // Navigate after animation
    setTimeout(() => {
      navigation.replace("Login");
    }, 2800);
  }, []);

  return (
    <LinearGradient
      colors={["#F6E27A", "#F29C63"]}
      style={styles.container}
    >
      <Animated.Image
        source={require("../../../assets/logo.png")}
        style={[
          styles.logo,
          {
            opacity: opacityAnim,
            transform: [{ scale: scaleAnim }],
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
    width: width * 0.55,
    height: width * 0.55,
    resizeMode: "contain",
  },
});
