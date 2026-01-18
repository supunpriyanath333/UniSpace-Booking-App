import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 25,
  },

  logoContainer: {
    alignItems: "center",
    marginVertical: 40,
  },

  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#000",
  },

  subtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 10,
  },

  label: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: 20,
  },

  input: {
    borderWidth: 1,
    borderColor: "#CCC",
    borderRadius: 10,
    paddingHorizontal: 15,
    height: 50,
    marginTop: 8,
  },

  forgotText: {
    alignSelf: "flex-end",
    marginTop: 10,
    marginBottom: 20,
    color: "#000",
    fontWeight: "500",
  },

  registerText: {
    textAlign: "center",
    marginTop: 20,
    marginBottom: 20,
  },

  registerLink: {
    color: "#D91C1C",
    fontWeight: "600",
  },

  dividerText: {
    textAlign: "center",
    marginVertical: 20,
    marginBottom: 10,

    color: "#777",
  },

  socialContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginTop: 5,
  },

  socialIcon: {
    width: 100,
    height: 100,
  },
});
