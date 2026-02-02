import { StyleSheet, Platform, StatusBar } from 'react-native';
import colors from '../constants/colors';

export const GlobalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  headerWrapper: {
    backgroundColor: colors.secondary, 
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(12, 1, 1, 0.15)',
    elevation: 8, 
    // ----------------------------
  },
  headerSection: {
    paddingHorizontal: 20,
    paddingBottom: 15,
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
    color: colors.black, 
  },
  errorText: {
    color: colors.error, 
    fontSize: 14,
    marginTop: 5,
  },
  secondaryText: {
    color: colors.gray, 
    fontSize: 14,
  }
});