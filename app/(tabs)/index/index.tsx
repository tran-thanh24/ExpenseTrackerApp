import { ShoppingBag, ShoppingCart, Zap } from "lucide-react-native";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import styles from "./styles";

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
