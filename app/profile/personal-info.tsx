import { useRouter } from "expo-router";
import { jwtDecode } from "jwt-decode";
import { ArrowLeft, Mail, Phone, User } from "lucide-react-native";
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
import { useAuth } from "../contexts/AuthContext";
import { updateProfileApi } from "../services/userService";

const PHONE_REGEX = /^(0\d{9,10}|\+84\d{9,10})$/;

export default function PersonalInfoScreen() {
  // LẤY THÊM HÀM LOGIN (HOẶC SETTOKEN) TỪ AUTHCONTEXT ĐỂ CẬP NHẬT LẠI TOKEN MỚI
  const { token, login } = useAuth();
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token) {
      try {
        const decoded: any = jwtDecode(token);

        const extractedName =
          decoded[
            "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"
          ] ||
          decoded["unique_name"] ||
          decoded["name"] ||
          decoded["fullName"] ||
          "";
        setFullName(extractedName);

        const extractedEmail =
          decoded[
            "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"
          ] ||
          decoded[
            "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/email"
          ] ||
          decoded["email"] ||
          "";
        setEmail(extractedEmail);

        const extractedPhone =
          decoded[
            "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/mobilephone"
          ] ||
          decoded["phoneNumber"] ||
          decoded["phone"] ||
          "";
        setPhoneNumber(extractedPhone);
      } catch (e) {
        console.log("Lỗi giải mã token", e);
      }
    }
  }, [token]);

  const handleUpdate = async () => {
    const normalizedFullName = fullName.trim().replace(/\s+/g, " ");
    const normalizedPhone = phoneNumber.trim().replace(/\s+/g, "");

    if (!normalizedFullName) {
      Alert.alert("Thông báo", "Vui lòng điền đầy đủ họ tên");
      return;
    }

    if (normalizedPhone && !PHONE_REGEX.test(normalizedPhone)) {
      Alert.alert("Lỗi", "Số điện thoại không đúng định dạng");
      return;
    }

    setLoading(true);
    try {
      // 1. GỌI API VÀ LẤY DỮ LIỆU TRẢ VỀ TỪ BACKEND
      const responseData = await updateProfileApi({
        fullName: normalizedFullName,
        email: email,
        phoneNumber: normalizedPhone,
      });

      // 2. TRÍCH XUẤT TOKEN MỚI TOANH TỪ KẾT QUẢ
      const newToken = responseData?.token;

      if (newToken && typeof login === "function") {
        // 3. ĐÈ TOKEN MỚI VÀO CONTEXT ĐỂ GIAO DIỆN TỰ ĐỘNG THAY ĐỔI
        await login(newToken);
        console.log("Đã cập nhật token mới vào AuthContext thành công!");
      }

      Alert.alert("Thành công", "Cập nhật thông tin thành công!", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (error: any) {
      const detailedError =
        error.response?.data?.message || error.message || "Gặp lỗi kết nối!";
      Alert.alert("Lỗi", detailedError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.backButton}
            >
              <ArrowLeft size={24} color="#2d3436" />
            </TouchableOpacity>
            <Text style={styles.title}>Thông tin cá nhân</Text>
            <Text style={styles.subtitle}>
              Chỉnh sửa thông tin tài khoản của bạn
            </Text>
          </View>

          <View style={styles.form}>
            <Text style={styles.label}>Họ và tên</Text>
            <View style={styles.inputWrapper}>
              <User size={20} color="#636e72" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Nhập họ tên"
                value={fullName}
                onChangeText={setFullName}
              />
            </View>

            <Text style={styles.label}>Email (Không thể thay đổi)</Text>
            <View
              style={[
                styles.inputWrapper,
                { opacity: 0.6, backgroundColor: "#eaedf0" },
              ]}
            >
              <Mail size={20} color="#636e72" style={styles.inputIcon} />
              <TextInput style={styles.input} value={email} editable={false} />
            </View>

            <Text style={styles.label}>Số điện thoại</Text>
            <View style={styles.inputWrapper}>
              <Phone size={20} color="#636e72" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Nhập số điện thoại"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                keyboardType="phone-pad"
              />
            </View>

            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleUpdate}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.buttonText}>Lưu Thay Đổi</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  scrollContent: { flexGrow: 1, padding: 24 },
  header: { marginBottom: 32 },
  backButton: { marginBottom: 15 },
  title: { fontSize: 24, fontWeight: "800", color: "#2d3436", marginBottom: 6 },
  subtitle: { fontSize: 14, color: "#636e72" },
  form: { width: "100%" },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#2d3436",
    marginBottom: 8,
    marginLeft: 4,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f6f7",
    borderRadius: 12,
    marginBottom: 16,
    paddingHorizontal: 16,
    height: 52,
    borderWidth: 1,
    borderColor: "#f5f6f7",
  },
  inputIcon: { marginRight: 12 },
  input: { flex: 1, fontSize: 16, color: "#2d3436" },
  button: {
    backgroundColor: "#4db6ac",
    height: 54,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    shadowColor: "#4db6ac",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonDisabled: { opacity: 0.7 },
  buttonText: { color: "white", fontSize: 16, fontWeight: "bold" },
});
