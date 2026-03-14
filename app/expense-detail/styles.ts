import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
  card: {
    backgroundColor: "#fff",
    margin: 20,
    borderRadius: 24,
    padding: 25,
    alignItems: "center",
    elevation: 3,
  },
  iconContainer: {
    backgroundColor: "#e0f2f1",
    padding: 15,
    borderRadius: 20,
    marginBottom: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1e293b",
  },
  date: {
    color: "#94a3b8",
    marginBottom: 25,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 15,
  },
  label: {
    color: "#94a3b8",
  },
  amount: {
    fontWeight: "bold",
    fontSize: 18,
    color: "#059669",
  },
  value: {
    fontWeight: "600",
  },
  actionButtons: {
    flexDirection: "row",
    padding: 20,
    gap: 15,
  },
  editBtn: {
    flex: 1,
    backgroundColor: "#4db6ac",
    flexDirection: "row",
    padding: 15,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  deleteBtn: {
    flex: 1,
    backgroundColor: "#ff8a80",
    flexDirection: "row",
    padding: 15,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  btnText: {
    fontWeight: "bold",
    color: "#fff",
  },
});
