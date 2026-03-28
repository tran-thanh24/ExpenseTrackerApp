import { useRouter } from "expo-router";
import { jwtDecode } from "jwt-decode";
import {
  Bell,
  ChevronRight,
  LogOut,
  Settings,
  ShieldCheck,
  User,
} from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../contexts/AuthContext";

export default function ProfileScreen() {
  const { token, logout } = useAuth();
  const router = useRouter();
  const [userInfo, setUserInfo] = useState({ name: "Thanh", email: "" });

  useEffect(() => {
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        setUserInfo({
          name: decoded.unique_name || "Thành",
          email: decoded.email || "thanh@example.com",
        });
      } catch (e) {
        console.log("Lỗi giải mã token", e);
      }
    }
  }, [token]);

  const handleLogout = async () => {
    Alert.alert("Đăng xuất", "Bạn có chắc chắn muốn thoát không?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Đăng xuất",
        style: "destructive",
        onPress: async () => {
          await logout();
        },
      },
    ]);
  };

  const ProfileItem = ({ icon, title, color = "#1e293b" }: any) => (
    <TouchableOpacity style={styles.menuItem}>
      <View style={[styles.iconBox, { backgroundColor: color + "15" }]}>
        {icon}
      </View>
      <Text style={[styles.menuText, { color }]}>{title}</Text>
      <ChevronRight color="#cbd5e1" size={20} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.avatarLarge}>
            <Text style={styles.avatarText}>{userInfo.name.charAt(0)}</Text>
          </View>
          <Text style={styles.nameText}>{userInfo.name}</Text>
          <Text style={styles.emailText}>{userInfo.email}</Text>
        </View>

        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>Tài khoản</Text>
          <ProfileItem
            icon={<User color="#3b82f6" size={20} />}
            title="Thông tin cá nhân"
            color="#3b82f6"
          />
          <ProfileItem
            icon={<ShieldCheck color="#10b981" size={20} />}
            title="Đổi mật khẩu"
            color="#10b981"
          />
          <ProfileItem
            icon={<Bell color="#f59e0b" size={20} />}
            title="Thông báo"
            color="#f59e0b"
          />
        </View>

        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>Ứng dụng</Text>
          <ProfileItem
            icon={<Settings color="#64748b" size={20} />}
            title="Cài đặt hệ thống"
          />

          <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
            <View style={[styles.iconBox, { backgroundColor: "#fee2e2" }]}>
              <LogOut color="#ef4444" size={20} />
            </View>
            <Text style={[styles.menuText, { color: "#ef4444" }]}>
              Đăng xuất
            </Text>
            <ChevronRight color="#fee2e2" size={20} />
          </TouchableOpacity>
        </View>

        <Text style={styles.versionText}>Phiên bản 1.0.0 (Beta)</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFC" },
  header: {
    alignItems: "center",
    paddingVertical: 30,
    backgroundColor: "#fff",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  avatarLarge: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#3b82f6",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
    elevation: 5,
    shadowColor: "#3b82f6",
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  avatarText: { fontSize: 36, fontWeight: "700", color: "#fff" },
  nameText: { fontSize: 22, fontWeight: "700", color: "#1e293b" },
  emailText: { fontSize: 14, color: "#64748b", marginTop: 4 },
  menuSection: { marginTop: 25, paddingHorizontal: 20 },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#94a3b8",
    marginBottom: 10,
    marginLeft: 5,
    textTransform: "uppercase",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 18,
    marginBottom: 10,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  menuText: { flex: 1, marginLeft: 15, fontSize: 15, fontWeight: "600" },
  versionText: {
    textAlign: "center",
    color: "#cbd5e1",
    fontSize: 12,
    marginBottom: 20,
    marginTop: 10,
  },
});
