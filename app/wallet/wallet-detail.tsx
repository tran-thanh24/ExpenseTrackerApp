import { useLocalSearchParams, useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
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
    const transactionTitle = title.trim();
    const rawAmount = parseFloat(amount.replace(/\./g, ""));
    const walletId = Number(id);

    if (!amount || !transactionTitle) {
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ nội dung và số tiền");
      return;
    }

    if (!Number.isFinite(rawAmount) || rawAmount <= 0) {
      Alert.alert("Lỗi", "Số tiền phải là số lớn hơn 0");
      return;
    }

    if (transactionTitle.length < 2) {
      Alert.alert("Lỗi", "Nội dung giao dịch phải có ít nhất 2 ký tự");
      return;
    }

    if (!Number.isFinite(walletId) || walletId <= 0) {
      Alert.alert("Lỗi", "Không xác định được ví giao dịch");
      return;
    }

    try {
      if (!isDeposit && rawAmount > currentBalance) {
        Alert.alert("Cảnh báo", "Bạn đã vượt quá chi tiêu");
        return;
      }

      const kind = isDeposit ? "Income" : "Expense";
      const balanceDelta = isDeposit ? rawAmount : -rawAmount;

      await apiClient.post("/Expense", {
        title: transactionTitle,
        amount: rawAmount,
        walletId,
        category: isDeposit ? "Income" : "Outcome",
        kind,
        date: new Date().toISOString(),
      });

      setCurrentBalance((prev) => prev + balanceDelta);
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
        <LinearGradient
          colors={["#0f172a", "#1e293b", "#334155"]}
          style={styles.topSection}
        >
          {/* HEADER */}
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.backBtn}
              activeOpacity={0.85}
            >
              <ArrowLeft color="#f8fafc" size={22} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Chi tiết tài khoản</Text>
            <View style={styles.headerSpacer} />
          </View>

          {/* THẺ VÍ */}
          <View style={styles.cardHighlight}>
            <View style={styles.iconCircle}>
              <CreditCard color="#fff" size={26} />
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
        </LinearGradient>

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
  topSection: {
    borderBottomLeftRadius: 38,
    borderBottomRightRadius: 38,
    paddingBottom: 28,
    marginBottom: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 12,
  },
  backBtn: {
    width: 42,
    height: 42,
    backgroundColor: "rgba(148,163,184,0.28)",
    borderRadius: 13,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(226,232,240,0.3)",
  },
  headerTitle: { fontSize: 18, fontWeight: "800", color: "#f8fafc" },
  headerSpacer: { width: 42 },
  cardHighlight: {
    alignItems: "center",
    marginHorizontal: 18,
    marginTop: 8,
    borderRadius: 26,
    paddingVertical: 22,
    paddingHorizontal: 16,
    backgroundColor: "rgba(148,163,184,0.18)",
    borderWidth: 1,
    borderColor: "rgba(226,232,240,0.22)",
  },
  iconCircle: {
    width: 48,
    height: 48,
    backgroundColor: "rgba(15,23,42,0.55)",
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  walletName: { fontSize: 15, color: "#e2e8f0", fontWeight: "600" },
  balanceValue: { fontSize: 31, fontWeight: "900", color: "#fff", marginTop: 3 },
  actionRow: { flexDirection: "row", gap: 12, marginTop: 20 },
  depositBtn: {
    flexDirection: "row",
    backgroundColor: "#16a34a",
    paddingVertical: 11,
    paddingHorizontal: 18,
    borderRadius: 13,
    alignItems: "center",
    gap: 6,
    shadowColor: "#166534",
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  withdrawBtn: {
    flexDirection: "row",
    backgroundColor: "#dc2626",
    paddingVertical: 11,
    paddingHorizontal: 18,
    borderRadius: 13,
    alignItems: "center",
    gap: 6,
    shadowColor: "#991b1b",
    shadowOpacity: 0.24,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  actionText: { color: "#fff", fontWeight: "700", fontSize: 14 },
  historyBox: {
    flex: 1,
    backgroundColor: "#fff",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingTop: 22,
    shadowColor: "#0f172a",
    shadowOpacity: 0.08,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: -4 },
  },
  historyTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 20,
  },
  historyTitleText: { fontSize: 17, fontWeight: "700", color: "#1e293b" },
  tranRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    backgroundColor: "#f8fafc",
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: "#eef2ff",
  },
  tranIconBg: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  tranNote: { fontSize: 15, fontWeight: "700", color: "#1e293b" },
  tranDate: { fontSize: 11, color: "#94a3b8", marginTop: 2 },
  tranAmount: { fontSize: 15, fontWeight: "800" },
  emptyContainer: { alignItems: "center", marginTop: 40 },
  emptyText: { color: "#94a3b8" },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(2,6,23,0.62)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 22,
    paddingTop: 20,
    paddingBottom: 34,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: { fontSize: 21, fontWeight: "800", color: "#0f172a" },
  label: {
    fontSize: 14,
    fontWeight: "700",
    color: "#475569",
    marginBottom: 8,
    marginTop: 15,
  },
  input: {
    backgroundColor: "#f8fafc",
    paddingVertical: 13,
    paddingHorizontal: 14,
    borderRadius: 14,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  confirmBtn: {
    padding: 16,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 26,
  },
  confirmBtnText: { color: "#fff", fontWeight: "800", fontSize: 16 },
});
