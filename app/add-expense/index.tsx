import { useLocalSearchParams, useRouter } from "expo-router";
import { ChevronLeft, Save } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
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

  const [isDataLoaded, setIsDataLoaded] = useState(false);

  useEffect(() => {
    if (isEdit && !isDataLoaded) {
      setTitle((params.title as string) || "");
      setAmount(params.amount?.toString() || "");
      setCategory((params.category as string) || "Shopping");

      setIsDataLoaded(true);
    }
  }, [isEdit, isDataLoaded]);

  const handleSave = async () => {
    if (!title || !amount) {
      Alert.alert("Thông báo", "Vui lòng nhập tên khoản chi và số tiền");
      return;
    }

    const payload = {
      title: title,
      amount: parseFloat(amount),
      category: category,
      date: isEdit ? params.date : new Date().toISOString(),
    };

    setLoading(true);
    try {
      if (isEdit) {
        await apiClient.put(`/Expense/${expenseId}`, payload);
        Alert.alert("Thành công", "Đã cập nhật khoản chi tiêu", [
          { text: "Xong", onPress: () => router.dismissAll() },
        ]);
      } else {
        await apiClient.post("/Expense", payload);
        Alert.alert("Thành công", "Đã lưu khoản chi tiêu mới", [
          { text: "Xong", onPress: () => router.back() },
        ]);
      }
    } catch (error) {
      console.error("Lỗi khi lưu:", error);
      Alert.alert("Lỗi", "Không thể lưu dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
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
            placeholder="Ví dụ: Ăn trưa..."
            value={title}
            onChangeText={setTitle}
            placeholderTextColor="#94a3b8"
          />

          <Text style={styles.label}>Số tiền (VNĐ)</Text>
          <TextInput
            style={styles.input}
            placeholder="0"
            value={amount ? formatVisualAmount(amount) : ""}
            onChangeText={(text) => {
              const rawNumber = text.replace(/[^0-9]/g, "");
              setAmount(rawNumber);
            }}
            keyboardType="numeric"
            placeholderTextColor="#94a3b8"
          />

          <Text style={styles.label}>Danh mục</Text>
          <View style={styles.categoryGroup}>
            {["Food", "Shopping", "Bills", "Transport"].map((cat) => (
              <TouchableOpacity
                key={cat}
                style={[styles.catBtn, category === cat && styles.catBtnActive]}
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
            style={[styles.saveBtn, loading && { opacity: 0.7 }]}
            onPress={handleSave}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Save size={20} color="#fff" style={{ marginRight: 8 }} />
                <Text style={styles.saveBtnText}>
                  {isEdit ? "Cập nhật thay đổi" : "Lưu giao dịch"}
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const formatVisualAmount = (val: string) => {
  if (!val || val === "0") return "";
  const number = val.replace(/[^0-9]/g, "");
  return new Intl.NumberFormat("vi-VN").format(parseInt(number));
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#f8fafc",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: { fontSize: 18, fontWeight: "700", color: "#1e293b" },
  form: { padding: 20 },
  label: { fontSize: 14, fontWeight: "600", color: "#64748b", marginBottom: 8 },
  input: {
    backgroundColor: "#f8fafc",
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    color: "#1e293b",
  },
  categoryGroup: {
    flexDirection: "row",
    marginBottom: 10,
    justifyContent: "space-between",
  },
  catBtn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 15,
    backgroundColor: "#f1f5f9",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    minWidth: "22%",
    alignItems: "center",
  },
  catBtnActive: { backgroundColor: "#3b82f6", borderColor: "#3b82f6" },
  catText: { color: "#64748b", fontWeight: "600" },
  catTextActive: { color: "#fff" },
  saveBtn: {
    backgroundColor: "#3b82f6",
    padding: 18,
    borderRadius: 18,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    marginTop: 10,
  },
  saveBtnText: { color: "#fff", fontSize: 16, fontWeight: "700" },
});
