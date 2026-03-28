import { useLocalSearchParams, useRouter } from "expo-router";
import {
  ArrowLeft,
  CreditCard,
  History,
  TrendingDown,
  TrendingUp,
  X,
} from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import apiClient from "../services/api";
import { isIncomeTransaction } from "../utils/transactionCategory";

export default function WalletDetailScreen() {
  const { id, name, balance } = useLocalSearchParams();
  const router = useRouter();

  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentBalance, setCurrentBalance] = useState(Number(balance));

  const [modalVisible, setModalVisible] = useState(false);
  const [isDeposit, setIsDeposit] = useState(true);
  const [amount, setAmount] = useState("");
  const [title, setTitle] = useState("");

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(`/Expense/wallet/${id}`);
      setTransactions(response.data);
    } catch (error) {
      console.log("Lỗi tải giao dịch:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [id]);

  const formatVisualNumber = (val: string) => {
    const number = val.replace(/[^0-9]/g, "");
    return number.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const handleTransaction = async () => {
    if (!amount || !title) {
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ nội dung và số tiền");
      return;
    }

    try {
      const rawAmount = parseFloat(amount.replace(/\./g, ""));
      // Gửi số âm nếu là chi tiêu, số dương nếu là nạp tiền
      const finalAmount = isDeposit ? rawAmount : -rawAmount;

      await apiClient.post("/Expense", {
        title: title,
        amount: finalAmount,
        walletId: Number(id),
        category: isDeposit ? "Income" : "Outcome",
        date: new Date().toISOString(),
      });

      setCurrentBalance((prev) => prev + finalAmount);
      setModalVisible(false);
      setAmount("");
      setTitle("");
      fetchTransactions();

      Alert.alert(
        "Thành công",
        isDeposit ? "Đã cộng tiền vào ví" : "Đã trừ tiền khỏi ví"
      );
    } catch (error) {
      Alert.alert("Lỗi", "Không thể thực hiện giao dịch");
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backBtn}
          >
            <ArrowLeft color="#1e293b" size={24} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Chi tiết tài khoản</Text>
          <View style={{ width: 45 }} />
        </View>

        {/* THẺ VÍ */}
        <View style={styles.cardHighlight}>
          <View style={styles.iconCircle}>
            <CreditCard color="#fff" size={28} />
          </View>
          <Text style={styles.walletName}>{name}</Text>
          <Text style={styles.balanceValue}>
            {new Intl.NumberFormat("vi-VN").format(currentBalance)} đ
          </Text>

          <View style={styles.actionRow}>
            <TouchableOpacity
              style={styles.depositBtn}
              onPress={() => {
                setIsDeposit(true);
                setModalVisible(true);
              }}
            >
              <TrendingUp color="#fff" size={18} />
              <Text style={styles.actionText}>Nạp tiền</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.withdrawBtn}
              onPress={() => {
                setIsDeposit(false);
                setModalVisible(true);
              }}
            >
              <TrendingDown color="#fff" size={18} />
              <Text style={styles.actionText}>Chi tiêu</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* DANH SÁCH LỊCH SỬ */}
        <View style={styles.historyBox}>
          <View style={styles.historyTitleRow}>
            <History size={20} color="#64748b" />
            <Text style={styles.historyTitleText}>Lịch sử thu chi</Text>
          </View>

          {loading ? (
            <ActivityIndicator
              size="large"
              color="#3b82f6"
              style={{ marginTop: 50 }}
            />
          ) : (
            <FlatList
              data={transactions}
              keyExtractor={(item: any) => item.id.toString()}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => {
                const isIncome = isIncomeTransaction(item);
                const absAmount = Math.abs(Number(item.amount));

                return (
                  <View style={styles.tranRow}>
                    <View
                      style={[
                        styles.tranIconBg,
                        { backgroundColor: isIncome ? "#dcfce7" : "#fee2e2" },
                      ]}
                    >
                      {isIncome ? (
                        <TrendingUp size={20} color="#16a34a" />
                      ) : (
                        <TrendingDown size={20} color="#dc2626" />
                      )}
                    </View>

                    <View style={{ flex: 1, marginLeft: 15 }}>
                      <Text style={styles.tranNote} numberOfLines={1}>
                        {item.title}
                      </Text>
                      <Text style={styles.tranDate}>{item.date}</Text>
                    </View>

                    <Text
                      style={[
                        styles.tranAmount,
                        { color: isIncome ? "#16a34a" : "#dc2626" },
                      ]}
                    >
                      {isIncome ? "+" : "-"}
                      {new Intl.NumberFormat("vi-VN").format(absAmount)} đ
                    </Text>
                  </View>
                );
              }}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>Chưa có giao dịch nào.</Text>
                </View>
              }
            />
          )}
        </View>
      </SafeAreaView>

      {/* MODAL NHẬP LIỆU */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.modalContent}
          >
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {isDeposit ? "Nạp tiền" : "Chi tiêu"}
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <X color="#94a3b8" size={24} />
              </TouchableOpacity>
            </View>
            <Text style={styles.label}>Nội dung</Text>
            <TextInput
              style={styles.input}
              placeholder="Tên giao dịch..."
              value={title}
              onChangeText={setTitle}
            />
            <Text style={styles.label}>Số tiền (đ)</Text>
            <TextInput
              style={styles.input}
              placeholder="0"
              keyboardType="numeric"
              value={amount}
              onChangeText={(t) => setAmount(formatVisualNumber(t))}
            />
            <TouchableOpacity
              style={[
                styles.confirmBtn,
                { backgroundColor: isDeposit ? "#16a34a" : "#dc2626" },
              ]}
              onPress={handleTransaction}
            >
              <Text style={styles.confirmBtnText}>Xác nhận</Text>
            </TouchableOpacity>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  backBtn: {
    width: 45,
    height: 45,
    backgroundColor: "#fff",
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
  },
  headerTitle: { fontSize: 18, fontWeight: "800", color: "#1e293b" },
  cardHighlight: { alignItems: "center", paddingVertical: 30 },
  iconCircle: {
    width: 50,
    height: 50,
    backgroundColor: "#1e293b",
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  walletName: { fontSize: 16, color: "#64748b", fontWeight: "600" },
  balanceValue: { fontSize: 32, fontWeight: "900", color: "#1e293b" },
  actionRow: { flexDirection: "row", gap: 12, marginTop: 20 },
  depositBtn: {
    flexDirection: "row",
    backgroundColor: "#16a34a",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: "center",
    gap: 6,
    elevation: 2,
  },
  withdrawBtn: {
    flexDirection: "row",
    backgroundColor: "#dc2626",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: "center",
    gap: 6,
    elevation: 2,
  },
  actionText: { color: "#fff", fontWeight: "700", fontSize: 14 },
  historyBox: {
    flex: 1,
    backgroundColor: "#fff",
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    padding: 25,
    elevation: 15,
  },
  historyTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 20,
  },
  historyTitleText: { fontSize: 17, fontWeight: "700", color: "#1e293b" },
  tranRow: { flexDirection: "row", alignItems: "center", marginBottom: 20 },
  tranIconBg: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  tranNote: { fontSize: 15, fontWeight: "700", color: "#1e293b" },
  tranDate: { fontSize: 11, color: "#94a3b8" },
  tranAmount: { fontSize: 15, fontWeight: "800" },
  emptyContainer: { alignItems: "center", marginTop: 40 },
  emptyText: { color: "#94a3b8" },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 25,
    paddingBottom: 40,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: { fontSize: 20, fontWeight: "800", color: "#1e293b" },
  label: {
    fontSize: 14,
    fontWeight: "700",
    color: "#64748b",
    marginBottom: 8,
    marginTop: 15,
  },
  input: {
    backgroundColor: "#f1f5f9",
    padding: 15,
    borderRadius: 15,
    fontSize: 16,
  },
  confirmBtn: {
    padding: 18,
    borderRadius: 15,
    alignItems: "center",
    marginTop: 30,
  },
  confirmBtnText: { color: "#fff", fontWeight: "800", fontSize: 16 },
});
