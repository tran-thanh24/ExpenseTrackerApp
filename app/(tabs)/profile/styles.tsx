import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
    padding: 20,
  },
  header: {
    alignItems: "center",
    marginTop: 50,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#cbd5e1",
  },
  name: {
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 15,
  },
  email: {
    fontSize: 14,
    color: "#64748b",
  },
});
