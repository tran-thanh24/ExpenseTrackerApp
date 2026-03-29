import { useFocusEffect } from "@react-navigation/native";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  ShoppingBag,
  ShoppingCart,
  Zap,
} from "lucide-react-native";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { PieChart } from "react-native-gifted-charts";
import { SafeAreaView } from "react-native-safe-area-context";
import apiClient from "../services/api";

// 1. IMPORT THƯ VIỆN GỐC CHỌN NGÀY
import DateTimePicker from "@react-native-community/datetimepicker";

// Hàm lấy icon theo tên danh mục
const getIcon = (categoryName: string) => {
  const name = categoryName?.toLowerCase() || "";
  if (name.includes("food") || name.includes("ăn"))
    return <ShoppingBag color="#fff" size={18} />;
  if (name.includes("shop") || name.includes("mua"))
    return <ShoppingCart color="#fff" size={18} />;
  return <Zap color="#fff" size={18} />;
};

export default function StatisticsScreen() {
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState("week");

  // State phân biệt đang xem "Expense" hay "Income"
  const [statsType, setStatsType] = useState<"Expense" | "Income">("Expense");

  // State đóng mở lịch và lưu ngày
  const [showPicker, setShowPicker] = useState(false);
  const [customDate, setCustomDate] = useState<Date | null>(null);

  // MỚI: Biến lưu trữ ngày hiện tại đang xem cho các tab Day, Week, Month, Year
  const [currentViewDate, setCurrentViewDate] = useState(new Date());

  const [stats, setStats] = useState({
    totalIncome: 0,
    totalExpense: 0,
    expenseChartData: [] as any[], // Lưu danh mục chi tiêu
    incomeChartData: [] as any[], // Lưu danh mục thu nhập
  });

  useFocusEffect(
    useCallback(() => {
      fetchStats();
    }, [selectedTab, customDate, currentViewDate]) // Lắng nghe thêm currentViewDate
  );

  const fetchStats = async () => {
    try {
      setLoading(true);
      let url = `/Expense/statistics/${selectedTab}`;

      // Nếu là tab Custom và có ngày thì đính kèm ngày vào Query Param
      if (selectedTab === "custom" && customDate) {
        url += `?customDate=${customDate.toISOString()}`;
      } else if (selectedTab !== "custom") {
        // Gửi kèm ngày đang xem hiện tại lên API để Backend biết đường lùi ngày
        url += `?customDate=${currentViewDate.toISOString()}`;
      }

      const response = await apiClient.get(url);
      const data = response.data;

      const colors = ["#4ade80", "#a78bfa", "#fbbf24", "#f472b6", "#60a5fa"];

      // ĐÃ SỬA: Thêm Math.abs() để xử lý số tiền âm cho biểu đồ CHI TIÊU
      const formattedExpenseChart = (data.categoryData || []).map(
        (item: any, index: number) => ({
          value: Math.abs(item.amount), // Biến số âm thành số dương
          color: colors[index % colors.length],
          text: item.name,
          focused: index === 0,
        })
      );

      // ĐÃ SỬA: Thêm Math.abs() cho biểu đồ THU NHẬP cho đồng bộ
      const formattedIncomeChart = (data.incomeCategoryData || []).map(
        (item: any, index: number) => ({
          value: Math.abs(item.amount),
          color: colors[index % colors.length],
          text: item.name,
          focused: index === 0,
        })
      );

      setStats({
        totalIncome: data.totalIncome,
        totalExpense: data.totalExpense,
        expenseChartData: formattedExpenseChart,
        incomeChartData: formattedIncomeChart,
      });
    } catch (error) {
      console.error("Lỗi lấy dữ liệu thống kê:", error);
    } finally {
      setLoading(false);
    }
  };

  // MỚI: Hàm xử lý khi bấm mũi tên lùi/tiến thời gian
  const handleNavigateDate = (direction: "prev" | "next") => {
    const newDate = new Date(currentViewDate);
    const step = direction === "prev" ? -1 : 1;

    if (selectedTab === "day") {
      newDate.setDate(newDate.getDate() + step);
    } else if (selectedTab === "week") {
      newDate.setDate(newDate.getDate() + step * 7);
    } else if (selectedTab === "month") {
      newDate.setMonth(newDate.getMonth() + step);
    } else if (selectedTab === "year") {
      newDate.setFullYear(newDate.getFullYear() + step);
    } else if (selectedTab === "custom" && customDate) {
      const newCustom = new Date(customDate);
      newCustom.setDate(newCustom.getDate() + step);
      setCustomDate(newCustom);
      return;
    }

    // Không cho phép tiến tới tương lai quá ngày hôm nay
    if (newDate > new Date()) return;
    setCurrentViewDate(newDate);
  };

  const getDateRangeText = () => {
    if (selectedTab === "day") {
      return currentViewDate.toDateString() === new Date().toDateString()
        ? "Today"
        : currentViewDate.toLocaleDateString("vi-VN");
    }
    if (selectedTab === "week") {
      const start = new Date(currentViewDate);
      start.setDate(start.getDate() - 7);
      return `${start.toLocaleDateString(
        "vi-VN"
      )} - ${currentViewDate.toLocaleDateString("vi-VN")}`;
    }
    if (selectedTab === "month") {
      return `${currentViewDate.toLocaleString("default", {
        month: "long",
      })} ${currentViewDate.getFullYear()}`;
    }
    if (selectedTab === "year") {
      return `Year ${currentViewDate.getFullYear()}`;
    }
    if (selectedTab === "custom" && customDate) {
      return customDate.toLocaleDateString("vi-VN");
    }
    return "Date Range";
  };

  const currentChartData =
    statsType === "Expense" ? stats.expenseChartData : stats.incomeChartData;

  // ĐÃ SỬA: Lấy giá trị tuyệt đối cho tổng số hiển thị ở giữa biểu đồ
  const currentTotal =
    statsType === "Expense"
      ? Math.abs(stats.totalExpense)
      : Math.abs(stats.totalIncome);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 20 }}
      >
        {/* Header */}
        <View style={styles.headerRow}>
          <Text style={styles.title}>Statistics</Text>
          <TouchableOpacity style={styles.filterIcon}>
            <LayoutGrid size={20} color="#1e293b" />
          </TouchableOpacity>
        </View>

        {/* Bộ lọc Thời gian */}
        <View style={styles.filterContainer}>
          {["day", "week", "month", "year"].map((tabKey) => {
            const labelMap: { [key: string]: string } = {
              day: "Daily",
              week: "Weekly",
              month: "Monthly",
              year: "Yearly",
            };
            return (
              <TouchableOpacity
                key={tabKey}
                style={[
                  styles.filterBtn,
                  selectedTab === tabKey && styles.activeFilter,
                ]}
                onPress={() => {
                  setCustomDate(null);
                  setCurrentViewDate(new Date()); // Reset về ngày hôm nay
                  setSelectedTab(tabKey);
                }}
              >
                <Text
                  style={
                    selectedTab === tabKey
                      ? styles.activeFilterText
                      : styles.filterText
                  }
                >
                  {labelMap[tabKey]}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* THANH GẠT: Chọn xem Thu nhập hoặc Khoản chi */}
        <View style={styles.subTabContainer}>
          <TouchableOpacity
            style={[
              styles.subTabBtn,
              statsType === "Expense" && styles.activeSubTabExpense,
            ]}
            onPress={() => setStatsType("Expense")}
          >
            <Text
              style={
                statsType === "Expense"
                  ? styles.activeSubTabText
                  : styles.subTabText
              }
            >
              Khoản chi
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.subTabBtn,
              statsType === "Income" && styles.activeSubTabIncome,
            ]}
            onPress={() => setStatsType("Income")}
          >
            <Text
              style={
                statsType === "Income"
                  ? styles.activeSubTabText
                  : styles.subTabText
              }
            >
              Thu nhập
            </Text>
          </TouchableOpacity>
        </View>

        {/* Bộ chọn Ngày tháng (Có hỗ trợ bấm nút lùi tiến) */}
        <View style={styles.dateSelector}>
          <TouchableOpacity onPress={() => handleNavigateDate("prev")}>
            <ChevronLeft size={20} color="#94a3b8" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.dateInfo}
            onPress={() => setShowPicker(true)}
          >
            <Calendar size={16} color="#64748b" style={{ marginRight: 8 }} />
            <Text style={styles.dateText}>{getDateRangeText()}</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => handleNavigateDate("next")}>
            <ChevronRight size={20} color="#94a3b8" />
          </TouchableOpacity>
        </View>

        {showPicker && (
          <DateTimePicker
            value={customDate || new Date()}
            mode="date"
            display="default"
            maximumDate={new Date()}
            onChange={(event, selectedDate) => {
              setShowPicker(false);
              if (selectedDate) {
                setCustomDate(selectedDate);
                setSelectedTab("custom");
              }
            }}
          />
        )}

        {loading ? (
          <View style={{ height: 200, justifyContent: "center" }}>
            <ActivityIndicator size="large" color="#3b82f6" />
          </View>
        ) : (
          <>
            {/* Thẻ chứa biểu đồ */}
            <View style={styles.chartCard}>
              <Text style={styles.chartLabel}>
                {statsType === "Expense" ? "Total Expenses" : "Total Income"}
              </Text>

              <View style={styles.chartWrapper}>
                {currentChartData.length > 0 ? (
                  <PieChart
                    donut
                    sectionAutoFocus
                    radius={90}
                    innerRadius={65}
                    data={currentChartData}
                    centerLabelComponent={() => (
                      <View
                        style={{
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 16,
                            fontWeight: "700",
                            color: "#1e293b",
                          }}
                        >
                          {new Intl.NumberFormat("vi-VN").format(currentTotal)}{" "}
                          đ
                        </Text>
                        <Text
                          style={{
                            fontSize: 12,
                            color: "#94a3b8",
                            marginTop: 2,
                          }}
                        >
                          {statsType === "Expense"
                            ? "Total Spent"
                            : "Total Received"}
                        </Text>
                      </View>
                    )}
                  />
                ) : (
                  <View style={{ height: 180, justifyContent: "center" }}>
                    <Text style={{ color: "#94a3b8" }}>
                      No data for this period
                    </Text>
                  </View>
                )}
              </View>
            </View>

            {/* Danh sách thống kê danh mục */}
            <View style={styles.listHeader}>
              <Text style={styles.listTitle}>
                {statsType === "Expense" ? "Top Spending" : "Income Sources"}
              </Text>
              <TouchableOpacity>
                <Text style={styles.viewMoreText}>View All</Text>
              </TouchableOpacity>
            </View>

            {currentChartData.length > 0 ? (
              currentChartData.map((item, index) => (
                <SpendingItem
                  key={index}
                  icon={getIcon(item.text)}
                  color={item.color}
                  title={item.text}
                  amount={`${
                    statsType === "Expense" ? "-" : "+"
                  }${new Intl.NumberFormat("vi-VN").format(item.value)} đ`}
                  isIncome={statsType === "Income"}
                />
              ))
            ) : (
              <Text
                style={{ textAlign: "center", color: "#94a3b8", marginTop: 20 }}
              >
                No records found.
              </Text>
            )}
          </>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const SpendingItem = ({ icon, color, title, amount, isIncome }: any) => (
  <View style={styles.item}>
    <View style={[styles.iconBox, { backgroundColor: color }]}>{icon}</View>
    <Text style={styles.itemTitle}>{title}</Text>
    <Text
      style={[styles.itemAmount, { color: isIncome ? "#10b981" : "#dc2626" }]}
    >
      {amount}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  // Giữ nguyên toàn bộ Object styles bên dưới của bạn...
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
    marginBottom: 15,
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
  subTabContainer: {
    flexDirection: "row",
    backgroundColor: "#e2e8f0",
    borderRadius: 12,
    padding: 3,
    marginBottom: 20,
  },
  subTabBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
    borderRadius: 10,
  },
  activeSubTabExpense: { backgroundColor: "#ef4444" },
  activeSubTabIncome: { backgroundColor: "#10b981" },
  activeSubTabText: { color: "#fff", fontWeight: "600" },
  subTabText: { color: "#64748b", fontWeight: "500" },
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
