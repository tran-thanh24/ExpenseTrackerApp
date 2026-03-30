import { useRouter } from "expo-router";
import { ArrowLeft, Eye, EyeOff, Lock } from "lucide-react-native";
import React, { useState } from "react";
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
import { changePasswordApi } from "../services/userService";

export default function ChangePasswordScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [secureOld, setSecureOld] = useState(true);
  const [secureNew, setSecureNew] = useState(true);
  const [secureConfirm, setSecureConfirm] = useState(true);

  const handlePasswordChange = async () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      Alert.alert("Thông báo", "Vui lòng điền đầy đủ các trường");
      return;
    }
    if (newPassword.length < 6) {
      Alert.alert("Lỗi", "Mật khẩu mới phải có ít nhất 6 ký tự");
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert("Lỗi", "Mật khẩu xác nhận không trùng khớp");
      return;
    }

    setLoading(true);
    try {
      await changePasswordApi({ oldPassword, newPassword, confirmPassword });

      Alert.alert("Thành công", "Đổi mật khẩu thành công!", [
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
            <Text style={styles.title}>Đổi mật khẩu</Text>
            <Text style={styles.subtitle}>
              Hãy nhập mật khẩu cũ và đặt mật khẩu mới
            </Text>
          </View>

          <View style={styles.form}>
            {/* Mật khẩu cũ */}
            <Text style={styles.label}>Mật khẩu cũ</Text>
            <View style={styles.inputWrapper}>
              <Lock size={20} color="#636e72" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Nhập mật khẩu cũ"
                value={oldPassword}
                onChangeText={setOldPassword}
                secureTextEntry={secureOld}
              />
              <TouchableOpacity onPress={() => setSecureOld(!secureOld)}>
                {secureOld ? (
                  <EyeOff size={20} color="#636e72" />
                ) : (
                  <Eye size={20} color="#636e72" />
                )}
              </TouchableOpacity>
            </View>

            {/* Mật khẩu mới */}
            <Text style={styles.label}>Mật khẩu mới</Text>
            <View style={styles.inputWrapper}>
              <Lock size={20} color="#636e72" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Nhập mật khẩu mới"
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry={secureNew}
              />
              <TouchableOpacity onPress={() => setSecureNew(!secureNew)}>
                {secureNew ? (
                  <EyeOff size={20} color="#636e72" />
                ) : (
                  <Eye size={20} color="#636e72" />
                )}
              </TouchableOpacity>
            </View>

            {/* Xác nhận mật khẩu */}
            <Text style={styles.label}>Xác nhận mật khẩu mới</Text>
            <View style={styles.inputWrapper}>
              <Lock size={20} color="#636e72" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Nhập lại mật khẩu mới"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={secureConfirm}
              />
              <TouchableOpacity
                onPress={() => setSecureConfirm(!secureConfirm)}
              >
                {secureConfirm ? (
                  <EyeOff size={20} color="#636e72" />
                ) : (
                  <Eye size={20} color="#636e72" />
                )}
              </TouchableOpacity>
            </View>

            {/* Nút lưu */}
            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handlePasswordChange}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.buttonText}>Đổi Mật Khẩu</Text>
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
