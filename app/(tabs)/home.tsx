import { useFocusEffect, useRouter } from "expo-router";
import { jwtDecode } from "jwt-decode";
import {
  Car,
  ShoppingBag,
  TrendingDown,
  Utensils,
  Wallet,
  Zap,
} from "lucide-react-native";
import React, { useCallback, useState } from "react";
import {
  Dimensions,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { PieChart } from "react-native-chart-kit";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../contexts/AuthContext";
import apiClient from "../services/api";
import { isIncomeTransaction } from "../utils/transactionCategory";

const screenWidth = Dimensions.get("window").width;

export default function HomeScreen() {
  const { token } = useAuth();
  const router = useRouter();
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("Thành");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  useFocusEffect(
    useCallback(() => {
      if (token) {
        try {
          const decoded: any = jwtDecode(token);
          setUserName(decoded.unique_name || "Thành");
        } catch (e) {
          console.log("Lỗi giải mã token", e);
        }
        fetchExpenses();
      }
    }, [token])
  );

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get("/Expense");
      setExpenses(response.data);
    } catch (error) {
      console.log("Lỗi lấy danh sách chi tiêu:", error);
    } finally {
      setLoading(false);
    }
  };

  /** Chỉ cộng các khoản chi — không tính nạp tiền (Income) vào "tổng chi tiêu". */
  const totalSpending = expenses
    .filter((e: any) => !isIncomeTransaction(e))
    .reduce(
      (sum: number, item: any) => sum + Math.abs(Number(item.amount)),
      0
    );

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN").format(amount) + " đ";
  };

  const chartData = [
    { key: "Food", name: "Ăn uống", color: "#4ade80" },
    { key: "Shopping", name: "Mua sắm", color: "#a78bfa" },
    { key: "Bills", name: "Hóa đơn", color: "#fbbf24" },
    { key: "Transport", name: "Di chuyển", color: "#3b82f6" },
  ]
    .map((cat) => ({
      name: cat.name,
      population: expenses
        .filter((e: any) => e.category === cat.key)
        .reduce((sum, e: any) => sum + Math.abs(Number(e.amount)), 0),
      color: cat.color,
      legendFontColor: "transparent",
      legendFontSize: 0,
    }))
    .filter((item) => item.population > 0);

  /** Icon chi tiêu theo danh mục — khoản thu/nạp tiền xử lý riêng qua isIncomeTransaction. */
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Outcome":
        return {
          icon: <TrendingDown color="#fff" size={20} />,
          color: "#dc2626",
        };
      case "Food":
        return { icon: <Utensils color="#fff" size={20} />, color: "#4ade80" };
      case "Bills":
        return { icon: <Zap color="#fff" size={20} />, color: "#fbbf24" };
      case "Transport":
        return { icon: <Car color="#fff" size={20} />, color: "#3b82f6" };
      default:
        return {
          icon: <ShoppingBag color="#fff" size={20} />,
          color: "#a78bfa",
        };
    }
  };

  const getIncomeIcon = () => ({
    icon: <Wallet color="#fff" size={20} />,
    color: "#16a34a",
  });

  const filteredExpenses = expenses.filter((item: any) => {
    const matchSearch = item.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchCategory =
      selectedCategory === "All" ||
      selectedCategory === "" ||
      item.category === selectedCategory;
    return matchSearch && matchCategory;
  });

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={filteredExpenses}
        keyExtractor={(item: any) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <>
            <View style={styles.headerSection}>
              <View style={styles.header}>
                <View>
                  <Text style={styles.greetText}>Chào buổi sáng,</Text>
                  <Text style={styles.userName}>{userName} 👋</Text>
                </View>
                <View style={styles.avatarPlaceholder}>
                  <Text style={{ fontWeight: "bold", color: "#64748b" }}>
                    {userName.charAt(0)}
                  </Text>
                </View>
              </View>

              <View style={styles.balanceCard}>
                <Text style={styles.balanceLabel}>Tổng chi tiêu tháng này</Text>
                <Text style={styles.balanceAmount}>
                  {formatCurrency(totalSpending)}
                </Text>
              </View>
            </View>

            {/* PHẦN BIỂU ĐỒ TỰ CUSTOM CHÚ THÍCH */}
            {expenses.length > 0 && (
              <View style={styles.chartSection}>
                <Text style={styles.sectionTitle}>Phân tích chi tiêu</Text>
                <View style={styles.chartRow}>
                  <PieChart
                    data={chartData}
                    width={screenWidth / 2}
                    height={160}
                    chartConfig={{
                      color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                    }}
                    accessor={"population"}
                    backgroundColor={"transparent"}
                    paddingLeft={"15"}
                    hasLegend={false}
                  />
                  {/* TỰ VẼ CHÚ THÍCH BÊN PHẢI */}
                  <View style={styles.customLegend}>
                    {chartData.map((item, index) => (
                      <View key={index} style={styles.legendItem}>
                        <View
                          style={[styles.dot, { backgroundColor: item.color }]}
                        />
                        <Text style={styles.legendText} numberOfLines={1}>
                          <Text style={{ fontWeight: "700" }}>
                            {formatCurrency(item.population)}
                          </Text>
                          {` - ${item.name}`}
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>
              </View>
            )}

            <View style={{ paddingHorizontal: 20, marginBottom: 10 }}>
              <TextInput
                style={styles.searchInput}
                placeholder="Tìm kiếm giao dịch ..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholderTextColor="#94a3b8"
              />
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={{ marginTop: 10 }}
              >
                {["All", "Food", "Shopping", "Bills", "Transport"].map(
                  (cat) => (
                    <TouchableOpacity
                      key={cat}
                      onPress={() => setSelectedCategory(cat)}
                      style={[
                        styles.filterBtn,
                        selectedCategory === cat && styles.filterBtnActive,
                      ]}
                    >
                      <Text
                        style={[
                          styles.filterText,
                          selectedCategory === cat && styles.filterTextActive,
                        ]}
                      >
                        {cat === "All" ? "Tất cả" : cat}
                      </Text>
                    </TouchableOpacity>
                  )
                )}
              </ScrollView>
            </View>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Giao dịch gần đây</Text>
              <TouchableOpacity onPress={fetchExpenses}>
                <Text style={{ color: "#3b82f6", fontWeight: "600" }}>
                  Làm mới
                </Text>
              </TouchableOpacity>
            </View>
          </>
        }
        renderItem={({ item }) => {
          const income = isIncomeTransaction(item);
          const config = income
            ? getIncomeIcon()
            : getCategoryIcon(item.category);
          const absAmount = Math.abs(Number(item.amount));
          const amountLabel = income
            ? `+ ${formatCurrency(absAmount)}`
            : `- ${formatCurrency(absAmount)}`;
          const amountColor = income ? "#16a34a" : "#ef4444";
          return (
            <TouchableOpacity
              onPress={() =>
                router.push({
                  pathname: "/expense-detail",
                  params: { ...item },
                })
              }
              style={{ paddingHorizontal: 20 }}
            >
              <ExpenseItem
                icon={config.icon}
                color={config.color}
                title={item.title}
                date={new Date(item.date).toLocaleDateString("vi-VN")}
                amount={amountLabel}
                amountColor={amountColor}
              />
            </TouchableOpacity>
          );
        }}
        ListFooterComponent={<View style={{ height: 100 }} />}
      />
    </SafeAreaView>
  );
}

const ExpenseItem = ({
  icon,
  title,
  date,
  amount,
  color,
  amountColor = "#ef4444",
}: any) => (
  <View style={styles.expenseItem}>
    <View style={[styles.iconContainer, { backgroundColor: color }]}>
      {icon}
    </View>
    <View style={{ flex: 1, marginLeft: 15 }}>
      <Text style={styles.expenseTitle}>{title}</Text>
      <Text style={styles.expenseDate}>{date}</Text>
    </View>
    <Text style={[styles.expenseAmount, { color: amountColor }]}>{amount}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFC" },
  headerSection: {
    padding: 20,
    backgroundColor: "#fff",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    marginBottom: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    alignItems: "center",
  },
  greetText: { fontSize: 13, color: "#64748b" },
  userName: { fontSize: 18, fontWeight: "700", color: "#1e293b" },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f1f5f9",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  balanceCard: {
    backgroundColor: "#1e293b",
    padding: 20,
    borderRadius: 20,
    elevation: 5,
  },
  balanceLabel: { color: "rgba(255,255,255,0.6)", fontSize: 12 },
  balanceAmount: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "700",
    marginTop: 5,
  },

  // Style cho phần Biểu đồ
  chartSection: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginTop: 10,
    padding: 15,
    borderRadius: 20,
  },
  chartRow: { flexDirection: "row", alignItems: "center" },
  customLegend: { flex: 1, marginLeft: 10 },
  legendItem: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  dot: { width: 10, height: 10, borderRadius: 5, marginRight: 8 },
  legendText: { fontSize: 11, color: "#475569", flex: 1 },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginVertical: 15,
    alignItems: "center",
  },
  sectionTitle: { fontSize: 15, fontWeight: "700", color: "#1e293b" },
  expenseItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 15,
    marginBottom: 10,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  expenseTitle: { fontSize: 14, fontWeight: "600", color: "#1e293b" },
  expenseDate: { fontSize: 11, color: "#94a3b8", marginTop: 2 },
  expenseAmount: { fontSize: 14, fontWeight: "700", color: "#ef4444" },
  searchInput: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    fontSize: 14,
    color: "#1e293b",
  },
  filterBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#f1f5f9",
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  filterBtnActive: {
    backgroundColor: "#3b82f6",
    borderColor: "#3b82f6",
  },
  filterText: { fontSize: 12, color: "#64748b", fontWeight: "600" },
  filterTextActive: { color: "#fff" },
});
