import { useRouter } from "expo-router";
import { Eye, EyeOff, Lock, Mail, Phone, User } from "lucide-react-native";
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
import { register as registerApi } from "../services/authService";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[0-9]{10,11}$/;

export default function RegisterScreen() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();

  const handleRegister = async () => {
    const normalizedFullName = fullName.trim().replace(/\s+/g, " ");
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedPhone = phoneNumber.trim();
    const normalizedPassword = password.trim();
    const normalizedConfirmPassword = confirmPassword.trim();

    // 1. Validate cơ bản
    if (!normalizedFullName || !normalizedEmail || !normalizedPassword) {
      Alert.alert("Thông báo", "Vui lòng điền đầy đủ thông tin");
      return;
    }

    if (normalizedFullName.length < 2) {
      Alert.alert("Lỗi", "Họ và tên phải có ít nhất 2 ký tự");
      return;
    }

    if (!EMAIL_REGEX.test(normalizedEmail)) {
      Alert.alert("Lỗi", "Email không đúng định dạng");
      return;
    }

    if (normalizedPhone && !PHONE_REGEX.test(normalizedPhone)) {
      Alert.alert("Lỗi", "Số điện thoại không đúng định dạng (10-11 chữ số)");
      return;
    }

    if (normalizedPassword !== normalizedConfirmPassword) {
      Alert.alert("Lỗi", "Mật khẩu xác nhận không khớp");
      return;
    }

    if (normalizedPassword.length < 6) {
      Alert.alert("Lỗi", "Mật khẩu phải có ít nhất 6 ký tự");
      return;
    }

    setLoading(true);
    try {
      const response = await registerApi({
        fullName: normalizedFullName,
        email: normalizedEmail,
        username: normalizedEmail,
        phoneNumber: normalizedPhone,
        password: normalizedPassword,
      });

      if (response) {
        Alert.alert(
          "Thành công",
          "Tạo tài khoản thành công! Hãy đăng nhập nhé.",
          [{ text: "OK", onPress: () => router.replace("/auth/login") }]
        );
      }
    } catch (error: any) {
      const errorMsg =
        error.response?.data?.message || "Đăng ký thất bại. Vui lòng thử lại.";
      Alert.alert("Lỗi đăng ký", errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Tạo tài khoản mới 🚀</Text>
          <Text style={styles.subtitle}>
            Bắt đầu hành trình quản lý tài chính của bạn
          </Text>
        </View>

        <View style={styles.form}>
          {/* Full Name Input */}
          <Text style={styles.label}>Họ và tên</Text>
          <View style={styles.inputWrapper}>
            <User size={20} color="#636e72" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Nhập họ tên của bạn"
              value={fullName}
              onChangeText={setFullName}
            />
          </View>

          {/* Email Input */}
          <Text style={styles.label}>Email</Text>
          <View style={styles.inputWrapper}>
            <Mail size={20} color="#636e72" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="example@gmail.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          {/* Phone Input */}
          <Text style={styles.label}>Số điện thoại (Không bắt buộc)</Text>
          <View style={styles.inputWrapper}>
            <Phone size={20} color="#636e72" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="09xxxxxxxx"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              keyboardType="phone-pad"
            />
          </View>

          {/* Password Input */}
          <Text style={styles.label}>Mật khẩu</Text>
          <View style={styles.inputWrapper}>
            <Lock size={20} color="#636e72" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="••••••••"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              {showPassword ? (
                <EyeOff size={20} color="#636e72" />
              ) : (
                <Eye size={20} color="#636e72" />
              )}
            </TouchableOpacity>
          </View>

          {/* Confirm Password Input */}
          <Text style={styles.label}>Xác nhận mật khẩu</Text>
          <View style={styles.inputWrapper}>
            <Lock size={20} color="#636e72" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="••••••••"
              secureTextEntry={!showPassword}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
          </View>

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleRegister}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.buttonText}>Đăng Ký Ngay</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push("/auth/login")}
            style={styles.linkContainer}
          >
            <Text style={styles.linkText}>
              Đã có tài khoản? <Text style={styles.boldText}>Đăng nhập</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
    paddingTop: 60,
    justifyContent: "center",
  },
  header: { marginBottom: 32 },
  title: { fontSize: 26, fontWeight: "800", color: "#2d3436", marginBottom: 8 },
  subtitle: { fontSize: 15, color: "#636e72" },
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
    height: 56,
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
  linkContainer: { marginTop: 20, alignItems: "center" },
  linkText: { color: "#636e72", fontSize: 14 },
  boldText: { color: "#4db6ac", fontWeight: "bold" },
});
