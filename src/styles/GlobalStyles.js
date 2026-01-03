import { StyleSheet } from "react-native";

export const Colors = {
  primary: "#E02424",
  secondary: "#F4D35E",
  textDark: "#000000",
  textLight: "#777777",
  border: "#CCCCCC",
  background: "#FFFFFF",
};

export const GlobalStyles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: 24,
    backgroundColor: Colors.background,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: Colors.textDark,
  },
  subtitle: {
    color: Colors.textLight,
    marginBottom: 20,
  },
  label: {
    fontWeight: "600",
    marginTop: 10,
    marginBottom: 6,
    color: Colors.textDark,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 10,
    padding: 12,
  },
  buttonPrimary: {
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "700",
  },
  center: {
    justifyContent: "center",
    alignItems: "center",
  },
});
