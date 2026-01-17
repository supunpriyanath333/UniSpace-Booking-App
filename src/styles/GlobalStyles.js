import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 25,
  },

  center: {
    alignItems: "center",
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    marginTop: 20,
  },

  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 30,
  },

  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 6,
  },

  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 12,
    padding: 14,
    marginBottom: 18,
    fontSize: 16,
  },

  forgot: {
    alignSelf: "flex-end",
    marginBottom: 20,
    color: "#000",
    fontWeight: "600",
  },

  dividerText: {
    textAlign: "center",
    marginVertical: 20,
    color: "#777",
  },

  socialRow: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginTop: 10,
  },

  socialIcon: {
    width: 60,
    height: 60,
    resizeMode: "contain",
  },

  registerText: {
    textAlign: "center",
    marginTop: 20,
  },

  registerLink: {
    fontWeight: "700",
  },
});
