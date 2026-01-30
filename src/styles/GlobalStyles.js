import { StyleSheet, Platform, StatusBar } from 'react-native';
import colors from '../constants/colors';

export const GlobalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background, // Uses '#FFFFFF'
  },
  // This makes the status bar area yellow
  headerWrapper: {
    backgroundColor: colors.secondary, // Uses '#F9EDB3'
    // Adds padding to push content below the clock/signal icons on Android
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    borderBottomWidth: 1,
    borderColor: colors.black, // Uses '#000000'
  },
  headerSection: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 10, 
  },
  headerTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.black, // Uses '#000000'
  },
  // Useful utility for error messages
  errorText: {
    color: colors.error, // Uses '#DA291C'
    fontSize: 14,
    marginTop: 5,
  },
  // Useful utility for secondary/placeholder text
  secondaryText: {
    color: colors.gray, // Uses '#787878'
    fontSize: 14,
  }
});