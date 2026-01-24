import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  cardShadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  homeCard: {
    backgroundColor: '#F9EDB3', // Pale yellow
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#000000',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    marginBottom: 15,
  }
});