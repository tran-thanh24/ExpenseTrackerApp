import { useLocalSearchParams, useRouter } from "expo-router";
import {
  Calendar,
  Car,
  ChevronLeft,
  Edit3,
  HelpCircle,
  ShoppingBag,
  Trash2,
  Utensils,
  Zap,
} from "lucide-react-native";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import apiClient from "../services/api";

export default function ExpenseDetail() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [loading, setLoading] = useState(false);

  const getCategoryConfig = (category: string) => {
    const configs: any = {
      Food: {
        icon: <Utensils size={28} color="#10b981" />,
        bg: "#ecfdf5",
        color: "#10b981",
      },
      Shopping: {
        icon: <ShoppingBag size={28} color="#3b82f6" />,
        bg: "#eff6ff",
        color: "#3b82f6",
      },
      Bills: {
        icon: <Zap size={28} color="#f59e0b" />,
        bg: "#fffbe6",
        color: "#f59e0b",
      },
      Transport: {
        icon: <Car size={28} color="#8b5cf6" />,
        bg: "#f5f3ff",
        color: "#8b5cf6",
      },
    };
    return (
      configs[category] || {
        icon: <HelpCircle size={32} color="#64748b" />,
        bg: "#f8fafc",
        color: "#64748b",
      }
    );
  };

  const config = getCategoryConfig(params.category as string);

  const formatCurrency = (amount: any) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const handleDelete = () => {
    Alert.alert("Xác nhận", "Bạn có muốn xóa khoản chi này không?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Xóa",
        style: "destructive",
        onPress: async () => {
          setLoading(true);
          try {
            await apiClient.delete(`/Expense/${params.id}`);
            router.back();
          } catch (error) {
            Alert.alert("Lỗi", "Không thể xóa giao dịch này");
          } finally {
            setLoading(false);
          }
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Custom Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <ChevronLeft size={24} color="#1e293b" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chi tiết giao dịch</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.card}>
        {/* Dynamic Icon Section */}
        <View style={[styles.iconWrapper, { backgroundColor: config.bg }]}>
          {config.icon}
        </View>

        <Text style={styles.title}>{params.title}</Text>

        {/* Date Badge */}
        <View style={styles.dateBadge}>
          <Calendar size={14} color="#64748b" style={{ marginRight: 6 }} />
          <Text style={styles.dateText}>
            {new Date(params.date as string).toLocaleDateString("vi-VN", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            })}
          </Text>
        </View>

        {/* Amount Highlight */}
        <View style={styles.amountContainer}>
          <Text style={styles.amountLabel}>Số tiền đã chi</Text>
          <Text style={styles.amountValue}>
            {formatCurrency(params.amount)}
          </Text>
        </View>

        <View style={styles.infoSection}>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Danh mục</Text>
            <View style={[styles.pill, { backgroundColor: config.bg }]}>
              <Text style={[styles.pillText, { color: config.color }]}>
                {params.category}
              </Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Trạng thái</Text>
            <View style={[styles.pill, { backgroundColor: "#f0fdf4" }]}>
              <Text style={[styles.pillText, { color: "#16a34a" }]}>
                Thành công
              </Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.btnGroup}>
        <TouchableOpacity
          style={styles.editBtn}
          activeOpacity={0.8}
          onPress={() =>
            router.push({
              pathname: "/add-expense",
              params: { ...params, mode: "edit" },
            })
          }
        >
          <Edit3 size={20} color="#fff" />
          <Text style={styles.editBtnText}>Chỉnh sửa</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.deleteBtn}
          activeOpacity={0.8}
          onPress={handleDelete}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#ef4444" />
          ) : (
            <>
              <Trash2 size={20} color="#ef4444" />
              <Text style={styles.deleteBtnText}>Xóa</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFC" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  headerTitle: { fontSize: 18, fontWeight: "700", color: "#1e293b" },
  card: {
    backgroundColor: "#fff",
    margin: 20,
    borderRadius: 32,
    padding: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 5,
  },
  iconWrapper: {
    width: 80,
    height: 80,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  title: { fontSize: 22, fontWeight: "800", color: "#1e293b", marginBottom: 8 },
  dateBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f1f5f9",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginBottom: 24,
  },
  dateText: { fontSize: 13, color: "#64748b", fontWeight: "600" },
  amountContainer: {
    alignItems: "center",
    marginBottom: 32,
  },
  amountLabel: {
    fontSize: 13,
    color: "#94a3b8",
    fontWeight: "600",
    marginBottom: 4,
  },
  amountValue: { fontSize: 32, fontWeight: "900", color: "#1e293b" },
  infoSection: {
    width: "100%",
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
    paddingTop: 8,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
  },
  label: { fontSize: 15, color: "#64748b", fontWeight: "500" },
  pill: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10 },
  pillText: { fontSize: 14, fontWeight: "700" },
  btnGroup: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginTop: "auto",
    marginBottom: 20,
    gap: 12,
  },
  editBtn: {
    flex: 2, // Nút sửa to hơn vì là hành động chính
    backgroundColor: "#3b82f6",
    flexDirection: "row",
    height: 60,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#3b82f6",
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 4,
  },
  editBtnText: {
    color: "#fff",
    marginLeft: 8,
    fontWeight: "700",
    fontSize: 16,
  },
  deleteBtn: {
    flex: 1,
    backgroundColor: "#fee2e2",
    flexDirection: "row",
    height: 60,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  deleteBtnText: {
    color: "#ef4444",
    marginLeft: 8,
    fontWeight: "700",
    fontSize: 16,
  },
});
