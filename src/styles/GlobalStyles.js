import { StyleSheet, Platform, StatusBar } from 'react-native';

export const GlobalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF', // Content area stays white
  },
  // This makes the status bar area yellow
  headerWrapper: {
    backgroundColor: '#F9EDB3',
    // Adds padding to push content below the clock/signal icons on Android
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    borderBottomWidth: 1,
    borderColor: '#000',
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
    color: '#000',
  },
});