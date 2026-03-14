import { ShoppingBag, ShoppingCart, Zap } from "lucide-react-native";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 20 }}
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.greetText}>Hello, Thành</Text>
          </View>
          <View style={styles.avatarPlaceholder} />
        </View>

        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Total Balance</Text>
          <Text style={styles.balanceAmount}>$2,150.50</Text>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>7 Days Statistics</Text>
          <TouchableOpacity>
            <Text style={{ color: "#6366f1" }}>See All</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.chartPlaceholder} />

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Expense</Text>
          <TouchableOpacity>
            <Text style={{ color: "#6366f1" }}>See All</Text>
          </TouchableOpacity>
        </View>

        <ExpenseItem
          icon={<ShoppingBag color="#fff" size={20} />}
          color="#4ade80"
          title="Grocery"
          date="Today, 10:45 AM"
          amount="- $45.99"
        />
        <ExpenseItem
          icon={<Zap color="#fff" size={20} />}
          color="#fbbf24"
          title="Electricity Bill"
          date="Yesterday, 3:30 PM"
          amount="- $60.00"
        />
        <ExpenseItem
          icon={<ShoppingCart color="#fff" size={20} />}
          color="#a78bfa"
          title="Shoes Shopping"
          date="Apr 20, 4:11 PM"
          amount="- $120.00"
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const ExpenseItem = ({ icon, title, date, amount, color }: any) => (
  <View style={styles.expenseItem}>
    <View style={[styles.iconContainer, { backgroundColor: color }]}>
      {icon}
    </View>
    <View style={{ flex: 1, marginLeft: 15 }}>
      <Text style={styles.expenseTitle}>{title}</Text>
      <Text style={styles.expenseDate}>{date}</Text>
    </View>
    <Text style={styles.expenseAmount}>{amount}</Text>
  </View>
);

const styles = StyleSheet.create({
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
