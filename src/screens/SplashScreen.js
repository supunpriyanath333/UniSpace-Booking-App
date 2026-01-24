import React, { useEffect, useRef } from 'react';
import { View, Image, StyleSheet, Animated, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import colors from '../constants/colors';

// Get screen dimensions for responsive sizing
const { width } = Dimensions.get('window');

const SplashScreen = ({ navigation }) => {
  // Animation Value: Starts at scale 1
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current; // To fade in the logo initially

  useEffect(() => {
    // 1. Start the Animation Loop (Pulse Effect)
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 0.85, // Scale down to 85%
          duration: 1000, // Takes 1 second
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1, // Scale back to 100%
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    
    // Start Fade In immediately
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();

    pulseAnimation.start();

    // 2. Navigate to Login after 3 seconds
    // We use setTimeout to simulate a loading process
    const timer = setTimeout(() => {
      navigation.replace('Login'); // Use 'replace' so user can't go back to Splash
    }, 3000);

    return () => {
      clearTimeout(timer);
      pulseAnimation.stop();
    };
  }, [navigation, scaleAnim, fadeAnim]);

  return (
    <LinearGradient
      // Gradient colors based on your UI (Top Light Orange -> Bottom Darker Orange)
      colors={['#F9EDB3', '#FFBA5A', '#FF9A44']} 
      style={styles.container}
    >
      <Animated.View
        style={[
          styles.logoContainer,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        {/* Replace this with your actual local image */}
        <Image
          source={require('../../assets/logo.png')} 
          style={styles.logo}
          resizeMode="contain"
        />
      </Animated.View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: width * 0.6, // Logo takes 60% of screen width
    height: width * 0.4, // Adjust height based on your image aspect ratio
  },
});

export default SplashScreen;