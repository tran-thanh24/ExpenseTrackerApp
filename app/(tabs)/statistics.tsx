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
  Modal,
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
  const [selectedTab, setSelectedTab] = useState<
    "day" | "week" | "month" | "year"
  >("month");

  const [statsType, setStatsType] = useState<"Expense" | "Income">("Expense");

  const [showPicker, setShowPicker] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(false);

  const [currentViewDate, setCurrentViewDate] = useState(new Date());

  const [stats, setStats] = useState({
    totalIncome: 0,
    totalExpense: 0,
    expenseChartData: [] as any[],
    incomeChartData: [] as any[],
  });

  useFocusEffect(
    useCallback(() => {
      fetchStats();
    }, [selectedTab, currentViewDate])
  );

  const fetchStats = async () => {
    try {
      setLoading(true);
      const url = `/Expense/statistics/${selectedTab}?customDate=${currentViewDate.toISOString()}`;

      const response = await apiClient.get(url);
      const data = response.data;

      const colors = ["#4ade80", "#a78bfa", "#fbbf24", "#f472b6", "#60a5fa"];

      const formattedExpenseChart = (data.categoryData || []).map(
        (item: any, index: number) => ({
          value: Math.abs(item.amount),
          color: colors[index % colors.length],
          text: item.name,
          focused: index === 0,
        })
      );

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
    }

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
      const end = new Date(currentViewDate);
      const start = new Date(currentViewDate);
      start.setDate(start.getDate() - 6);
      return `${start.toLocaleDateString("vi-VN")} - ${end.toLocaleDateString(
        "vi-VN"
      )}`;
    }
    if (selectedTab === "month") {
      return `${currentViewDate.toLocaleString("default", {
        month: "long",
      })} ${currentViewDate.getFullYear()}`;
    }
    if (selectedTab === "year") {
      return `Year ${currentViewDate.getFullYear()}`;
    }
    return "Date Range";
  };

  const currentChartData =
    statsType === "Expense" ? stats.expenseChartData : stats.incomeChartData;

  const currentTotal =
    statsType === "Expense"
      ? Math.abs(stats.totalExpense)
      : Math.abs(stats.totalIncome);

  const applyQuickFilter = (tab: "day" | "week" | "month" | "year") => {
    setSelectedTab(tab);
    setCurrentViewDate(new Date());
    setShowQuickActions(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 20 }}
      >
        {/* Header */}
        <View style={styles.headerRow}>
          <Text style={styles.title}>Statistics</Text>
          <TouchableOpacity
            style={styles.filterIcon}
            onPress={() => setShowQuickActions(true)}
          >
            <LayoutGrid size={20} color="#1e293b" />
          </TouchableOpacity>
        </View>

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
            value={currentViewDate}
            mode="date"
            display="default"
            maximumDate={new Date()}
            onChange={(event, selectedDate) => {
              setShowPicker(false);
              if (selectedDate) {
                setCurrentViewDate(selectedDate);
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

      <Modal
        visible={showQuickActions}
        transparent
        animationType="fade"
        onRequestClose={() => setShowQuickActions(false)}
      >
        <View style={styles.sheetOverlay}>
          <TouchableOpacity
            style={styles.overlayTouchArea}
            activeOpacity={1}
            onPress={() => setShowQuickActions(false)}
          />
          <View style={styles.sheetContainer}>
            <View style={styles.sheetHandle} />
            <Text style={styles.sheetTitle}>Quick Statistics Actions</Text>

            <Text style={styles.sheetSectionTitle}>Khoảng thời gian nhanh</Text>
            <View style={styles.sheetRow}>
              <TouchableOpacity
                style={styles.sheetChip}
                onPress={() => applyQuickFilter("day")}
              >
                <Text style={styles.sheetChipText}>Hôm nay</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.sheetChip}
                onPress={() => applyQuickFilter("week")}
              >
                <Text style={styles.sheetChipText}>7 ngày</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.sheetChip}
                onPress={() => applyQuickFilter("month")}
              >
                <Text style={styles.sheetChipText}>Tháng này</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.sheetChip}
                onPress={() => applyQuickFilter("year")}
              >
                <Text style={styles.sheetChipText}>Năm nay</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.sheetSectionTitle}>Loại thống kê</Text>
            <View style={styles.sheetRow}>
              <TouchableOpacity
                style={[
                  styles.sheetSegmentBtn,
                  statsType === "Expense" && styles.sheetSegmentBtnExpense,
                ]}
                onPress={() => setStatsType("Expense")}
              >
                <Text
                  style={[
                    styles.sheetSegmentText,
                    statsType === "Expense" && styles.sheetSegmentTextActive,
                  ]}
                >
                  Khoản chi
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.sheetSegmentBtn,
                  statsType === "Income" && styles.sheetSegmentBtnIncome,
                ]}
                onPress={() => setStatsType("Income")}
              >
                <Text
                  style={[
                    styles.sheetSegmentText,
                    statsType === "Income" && styles.sheetSegmentTextActive,
                  ]}
                >
                  Thu nhập
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.sheetCloseBtn}
              onPress={() => setShowQuickActions(false)}
            >
              <Text style={styles.sheetCloseText}>Đóng</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  sheetOverlay: {
    flex: 1,
    backgroundColor: "rgba(2, 6, 23, 0.45)",
    justifyContent: "flex-end",
  },
  overlayTouchArea: { flex: 1 },
  sheetContainer: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 30,
  },
  sheetHandle: {
    width: 44,
    height: 5,
    borderRadius: 999,
    backgroundColor: "#cbd5e1",
    alignSelf: "center",
    marginBottom: 14,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0f172a",
    marginBottom: 14,
  },
  sheetSectionTitle: {
    fontSize: 13,
    color: "#64748b",
    fontWeight: "600",
    marginBottom: 8,
    marginTop: 6,
  },
  sheetRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 10,
  },
  sheetChip: {
    backgroundColor: "#eff6ff",
    borderWidth: 1,
    borderColor: "#dbeafe",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  sheetChipText: { color: "#1d4ed8", fontWeight: "600", fontSize: 13 },
  sheetSegmentBtn: {
    flex: 1,
    backgroundColor: "#f1f5f9",
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: "center",
  },
  sheetSegmentBtnExpense: { backgroundColor: "#fee2e2" },
  sheetSegmentBtnIncome: { backgroundColor: "#dcfce7" },
  sheetSegmentText: { color: "#334155", fontWeight: "600" },
  sheetSegmentTextActive: { color: "#0f172a" },
  sheetCloseBtn: {
    marginTop: 6,
    backgroundColor: "#0f172a",
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: "center",
  },
  sheetCloseText: { color: "#fff", fontWeight: "700", fontSize: 15 },
});
