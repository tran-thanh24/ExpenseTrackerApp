import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  header: {
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  card: {
    backgroundColor: "#fff",
    margin: 20,
    borderRadius: 24,
    padding: 20,
    alignItems: "center",
  },
  iconWrapper: {
    width: 60,
    height: 60,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1e293b",
  },
  date: {
    fontSize: 13,
    color: "#94a3b8",
    marginTop: 4,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  label: {
    color: "#94a3b8",
    fontSize: 14,
  },
  value: {
    fontWeight: "600",
    color: "#1e293b",
  },
  btnGroup: {
    flexDirection: "row",
    padding: 20,
    gap: 15,
  },
  editBtn: {
    flex: 1,
    backgroundColor: "#4db6ac",
    padding: 15,
    borderRadius: 15,
    alignItems: "center",
  },
  deleteBtn: {
    flex: 1,
    backgroundColor: "#ff8a80",
    padding: 15,
    borderRadius: 15,
    alignItems: "center",
  },
});
