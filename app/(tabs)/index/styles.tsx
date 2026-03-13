import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },

  greetText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1e293b",
  },

  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#cbd5e1",
  },

  balanceCard: {
    backgroundColor: "#3b82f6",
    padding: 20,
    borderRadius: 24,
    marginBottom: 25,
    shadowColor: "#3b82f6",
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },

  balanceLabel: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 14,
  },

  balanceAmount: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "700",
    marginTop: 5,
  },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 15,
    alignItems: "center",
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1e293b",
  },

  chartPlaceholder: {
    height: 120,
    backgroundColor: "#fff",
    borderRadius: 20,
    marginBottom: 10,
  },

  expenseItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 18,
    marginBottom: 12,
  },

  iconContainer: {
    width: 45,
    height: 45,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },

  expenseTitle: {
    fontSize: 15,
    fontWeight: "600",
  },

  expenseDate: {
    fontSize: 12,
    color: "#64748b",
    marginTop: 2,
  },

  expenseAmount: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1e293b",
  },
});
