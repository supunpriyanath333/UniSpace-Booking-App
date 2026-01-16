import { StyleSheet, Animated, Dimensions } from "react-native";
import { useEffect, useRef } from "react";
import { LinearGradient } from "expo-linear-gradient";

// ✅ SAFE image import (assets at root)
import logo from "../../assets/logo.png";

const { width } = Dimensions.get("window");

export default function SplashScreen({ navigation }) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      // Fade in
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),

      // Normal → Big
      Animated.timing(scaleAnim, {
        toValue: 1.3,
        duration: 1700,
        useNativeDriver: true,
      }),

      // Big → Normal
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 1700,
        useNativeDriver: true,
      }),
    ]).start();

    setTimeout(() => {
      navigation.replace("Login");
    }, 5000);
  }, []);

  return (
    <LinearGradient
      colors={["#F6E27A", "#F29C63"]}
      style={styles.container}
    >
      <Animated.Image
        source={logo}
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
