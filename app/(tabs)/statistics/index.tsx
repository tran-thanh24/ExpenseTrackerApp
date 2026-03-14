import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  ShoppingBag,
  ShoppingCart,
  Zap,
} from "lucide-react-native";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { PieChart } from "react-native-gifted-charts";
import { SafeAreaView } from "react-native-safe-area-context";

const pieData = [
  { value: 145, color: "#4ade80", text: "Food" },
  { value: 105.25, color: "#a78bfa", text: "Shopping" },
  { value: 100, color: "#fbbf24", text: "Bill" },
];

export default function StatisticsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 20 }}
      >
        <View style={styles.headerRow}>
          <Text style={styles.title}>Statistics</Text>
          <TouchableOpacity style={styles.filterIcon}>
            <LayoutGrid size={20} color="#1e293b" />
          </TouchableOpacity>
        </View>

        {/* Tab Filter */}
        <View style={styles.filterContainer}>
          <TouchableOpacity style={[styles.filterBtn, styles.activeFilter]}>
            <Text style={styles.activeFilterText}>Weekly</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterBtn}>
            <Text style={styles.filterText}>Monthly</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterBtn}>
            <Text style={styles.filterText}>Yearly</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.dateSelector}>
          <ChevronLeft size={20} color="#94a3b8" />
          <View style={styles.dateInfo}>
            <Calendar size={16} color="#64748b" style={{ marginRight: 8 }} />
            <Text style={styles.dateText}>April 2024</Text>
          </View>
          <ChevronRight size={20} color="#94a3b8" />
        </View>

        <View style={styles.chartCard}>
          <Text style={styles.chartLabel}>Total Expenses</Text>
          <View style={styles.chartWrapper}>
            <PieChart
              donut
              sectionAutoFocus
              radius={90}
              innerRadius={65}
              data={pieData}
              centerLabelComponent={() => (
                <View
                  style={{ alignItems: "center", justifyContent: "center" }}
                >
                  <Text
                    style={{
                      fontSize: 22,
                      fontWeight: "700",
                      color: "#1e293b",
                    }}
                  >
                    $350.25
                  </Text>
                  <Text style={{ fontSize: 12, color: "#94a3b8" }}>
                    Total Total
                  </Text>
                </View>
              )}
            />
          </View>
        </View>

        <View style={styles.listHeader}>
          <Text style={styles.listTitle}>Top Spending</Text>
          <TouchableOpacity>
            <Text style={styles.viewMoreText}>View All</Text>
          </TouchableOpacity>
        </View>

        <SpendingItem
          icon={<ShoppingBag color="#fff" size={18} />}
          color="#4ade80"
          title="Food"
          amount="$145.00"
        />
        <SpendingItem
          icon={<ShoppingCart color="#fff" size={18} />}
          color="#a78bfa"
          title="Shopping"
          amount="$105.25"
        />
        <SpendingItem
          icon={<Zap color="#fff" size={18} />}
          color="#fbbf24"
          title="Bill"
          amount="$100.00"
        />

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const SpendingItem = ({ icon, color, title, amount }: any) => (
  <View style={styles.item}>
    <View style={[styles.iconBox, { backgroundColor: color }]}>{icon}</View>
    <Text style={styles.itemTitle}>{title}</Text>
    <Text style={styles.itemAmount}>{amount}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFC" },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: { fontSize: 24, fontWeight: "700", color: "#1e293b" },
  filterContainer: {
    flexDirection: "row",
    backgroundColor: "#e2e8f0",
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
  },
  filterBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
    borderRadius: 10,
  },
  activeFilter: { backgroundColor: "#3b82f6" },
  activeFilterText: { color: "#fff", fontWeight: "600" },
  filterText: { color: "#64748b", fontWeight: "500" },
  dateSelector: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  dateInfo: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#f1f5f9",
  },
  dateText: { fontWeight: "600", color: "#1e293b" },
  chartCard: {
    backgroundColor: "#fff",
    borderRadius: 30,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 15,
    elevation: 2,
  },
  chartLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 10,
  },
  chartWrapper: { alignItems: "center", paddingVertical: 10 },
  listHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 25,
    marginBottom: 15,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1e293b",
  },
  viewMoreText: { color: "#6366f1", fontWeight: "600" },
  item: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 20,
    marginBottom: 10,
  },
  iconBox: {
    width: 45,
    height: 45,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  itemTitle: { flex: 1, marginLeft: 15, fontSize: 16, fontWeight: "600" },
  itemAmount: { fontSize: 16, fontWeight: "700" },
  filterIcon: {
    padding: 8,
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#f1f5f9",
  },
});
