import { useLocalSearchParams, useRouter } from "expo-router";
import { ChevronLeft, Wallet } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import apiClient from "../services/api";

export default function AddExpenseScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const isEdit = params.mode === "edit";
  const expenseId = params.id;

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Shopping");
  const [loading, setLoading] = useState(false);

  const [wallets, setWallets] = useState<any[]>([]);
  const [selectedWalletId, setSelectedWalletId] = useState<number | null>(null);

  useEffect(() => {
    fetchWallets();
    if (isEdit) {
      setTitle((params.title as string) || "");
      setAmount(params.amount?.toString() || "");
      setCategory((params.category as string) || "Shopping");
      setSelectedWalletId(Number(params.walletId));
    }
  }, [isEdit]);

  const fetchWallets = async () => {
    try {
      const res = await apiClient.get("/Wallet");
      setWallets(res.data);
      if (!isEdit && res.data.length > 0) {
        setSelectedWalletId(res.data[0].id);
      }
    } catch (err) {
      console.error("Lỗi lấy danh sách ví:", err);
    }
  };

  const handleSave = async () => {
    if (!title || !amount || !selectedWalletId) {
      Alert.alert(
        "Thông báo",
        "Vui lòng nhập đầy đủ thông tin và chọn ví thanh toán"
      );
      return;
    }

    const payload = {
      title: title,
      amount: parseFloat(amount),
      category: category,
      walletId: selectedWalletId,
      date: isEdit ? params.date : new Date().toISOString(),
    };

    setLoading(true);
    try {
      if (isEdit) {
        await apiClient.put(`/Expense/${expenseId}`, payload);
        Alert.alert("Thành công", "Đã cập nhật khoản chi tiêu");
      } else {
        await apiClient.post("/Expense", payload);
        Alert.alert("Thành công", "Đã lưu khoản chi tiêu mới");
      }
      router.back();
    } catch (error) {
      console.error("Lỗi khi lưu:", error);
      Alert.alert("Lỗi", "Không thể lưu dữ liệu (Lỗi 400: Kiểm tra WalletId)");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView>
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backBtn}
              onPress={() => router.back()}
            >
              <ChevronLeft size={24} color="#1e293b" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>
              {isEdit ? "Chỉnh Sửa Chi Tiêu" : "Thêm Chi Tiêu"}
            </Text>
            <View style={{ width: 40 }} />
          </View>

          <View style={styles.form}>
            <Text style={styles.label}>Tên khoản chi</Text>
            <TextInput
              style={styles.input}
              value={title}
              onChangeText={setTitle}
              placeholder="Ví dụ: Ăn trưa..."
            />

            <Text style={styles.label}>Số tiền (VNĐ)</Text>
            <TextInput
              style={styles.input}
              value={
                amount
                  ? new Intl.NumberFormat("vi-VN").format(parseInt(amount))
                  : ""
              }
              onChangeText={(text) => setAmount(text.replace(/[^0-9]/g, ""))}
              keyboardType="numeric"
              placeholder="0"
            />

            {/* --- PHẦN CHỌN VÍ --- */}
            <Text style={styles.label}>Chọn ví thanh toán</Text>
            <View style={styles.walletGroup}>
              {wallets.map((w) => (
                <TouchableOpacity
                  key={w.id}
                  style={[
                    styles.walletItem,
                    selectedWalletId === w.id && styles.walletActive,
                  ]}
                  onPress={() => setSelectedWalletId(w.id)}
                >
                  <Wallet
                    size={16}
                    color={selectedWalletId === w.id ? "#fff" : "#64748b"}
                  />
                  <Text
                    style={[
                      styles.walletName,
                      selectedWalletId === w.id && styles.walletTextActive,
                    ]}
                  >
                    {w.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.label}>Danh mục</Text>
            <View style={styles.categoryGroup}>
              {["Food", "Shopping", "Bills", "Transport"].map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={[
                    styles.catBtn,
                    category === cat && styles.catBtnActive,
                  ]}
                  onPress={() => setCategory(cat)}
                >
                  <Text
                    style={[
                      styles.catText,
                      category === cat && styles.catTextActive,
                    ]}
                  >
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              style={styles.saveBtn}
              onPress={handleSave}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.saveBtnText}>Lưu giao dịch</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#f8fafc",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: { fontSize: 18, fontWeight: "700" },
  form: { padding: 20 },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#64748b",
    marginBottom: 8,
    marginTop: 10,
  },
  input: {
    backgroundColor: "#f8fafc",
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  walletGroup: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 15,
  },
  walletItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#f1f5f9",
    gap: 6,
  },
  walletActive: { backgroundColor: "#10b981" },
  walletName: { fontSize: 13, fontWeight: "600", color: "#64748b" },
  walletTextActive: { color: "#fff" },
  categoryGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  catBtn: {
    padding: 10,
    borderRadius: 12,
    backgroundColor: "#f1f5f9",
    minWidth: "22%",
    alignItems: "center",
  },
  catBtnActive: { backgroundColor: "#3b82f6" },
  catText: { fontWeight: "600", color: "#64748b" },
  catTextActive: { color: "#fff" },
  saveBtn: {
    backgroundColor: "#3b82f6",
    padding: 18,
    borderRadius: 15,
    alignItems: "center",
  },
  saveBtnText: { color: "#fff", fontWeight: "700", fontSize: 16 },
});
