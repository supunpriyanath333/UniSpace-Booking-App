import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 24,
  },

  logoContainer: {
    alignItems: "center",
    marginTop: 40,
    marginBottom: 30,
  },

  logo: {
    width: 180,
    height: 60,
    resizeMode: "contain",
  },

  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#000",
    marginBottom: 6,
  },

  subtitle: {
    fontSize: 15,
    color: "#666",
    marginBottom: 30,
  },

  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 6,
    color: "#000",
  },

  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    marginBottom: 16,
  },

  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingHorizontal: 14,
    marginBottom: 10,
  },

  passwordInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 15,
  },

  forgotText: {
    alignSelf: "flex-end",
    fontSize: 13,
    color: "#000",
    marginBottom: 25,
  },

  loginButton: {
    backgroundColor: "#D91C1C",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 25,
  },

  loginButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },

  registerText: {
    textAlign: "center",
    fontSize: 14,
    marginBottom: 30,
  },

  registerLink: {
    fontWeight: "700",
  },

  dividerText: {
    textAlign: "center",
    fontSize: 14,
    color: "#666",
    marginBottom: 20,
  },

  socialContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
  },

  socialButton: {
    width: 120,
    height: 50,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },

  socialIcon: {
    width: 28,
    height: 28,
    resizeMode: "contain",
  },
});
