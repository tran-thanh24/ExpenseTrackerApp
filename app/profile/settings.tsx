import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useRouter } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import React, { useCallback, useState } from "react";
import {
  Alert,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../contexts/ThemeContext"; // 1. IMPORT HÀM DÙNG THEME

const APP_SETTINGS_KEY = "profile_app_settings";

export default function AppSettingsScreen() {
  const router = useRouter();
  const { isDarkMode, toggleTheme, colors } = useTheme(); // 2. LẤY TRẠNG THÁI VÀ MÀU SẮC TỪ CONTEXT

  const [settings, setSettings] = useState({
    darkMode: isDarkMode,
    biometricLock: false,
  });

  const loadSettings = async () => {
    try {
      const raw = await AsyncStorage.getItem(APP_SETTINGS_KEY);
      if (raw) setSettings(JSON.parse(raw));
    } catch (error) {
      console.log("Lỗi đọc cài đặt app:", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadSettings();
      // Đồng bộ lại state switch theo trạng thái Dark Mode của hệ thống
      setSettings((prev) => ({ ...prev, darkMode: isDarkMode }));
    }, [isDarkMode])
  );

  const updateSetting = async (key: keyof typeof settings, value: boolean) => {
    const next = { ...settings, [key]: value };
    setSettings(next);

    try {
      await AsyncStorage.setItem(APP_SETTINGS_KEY, JSON.stringify(next));

      // 3. NẾU LÀ GẠT NÚT DARK MODE THÌ ĐỔI THEME TOÀN APP LUÔN
      if (key === "darkMode") {
        toggleTheme(value);
      }
    } catch (error) {
      Alert.alert("Lỗi", "Không thể lưu cài đặt");
    }
  };

  const SettingRow = ({
    title,
    value,
    onChange,
  }: {
    title: string;
    value: boolean;
    onChange: (v: boolean) => void;
  }) => (
    // Sử dụng colors.card cho nền của hàng
    <View style={[styles.row, { backgroundColor: colors.card }]}>
      <Text style={[styles.rowText, { color: colors.text }]}>{title}</Text>
      <Switch
        value={value}
        onValueChange={onChange}
        trackColor={{ false: "#767577", true: "#4db6ac" }} // Màu switch khi được bật
      />
    </View>
  );

  return (
    // 4. SỬ DỤNG MÀU TỪ CONTEXT ĐỂ GÁN CHO TOÀN BỘ GIAO DIỆN
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <View style={styles.header}>
        <TouchableOpacity
          style={[styles.backBtn, { backgroundColor: colors.card }]}
          onPress={() => router.back()}
        >
          <ChevronLeft size={22} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>
          Cài đặt hệ thống
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.content}>
        <SettingRow
          title="Dark mode"
          value={settings.darkMode}
          onChange={(v) => updateSetting("darkMode", v)}
        />
        <SettingRow
          title="Khóa ứng dụng bằng sinh trắc học"
          value={settings.biometricLock}
          onChange={(v) => updateSetting("biometricLock", v)}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 }, // Bỏ cứng màu f8fafc đi để ăn theo biến colors
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  title: { fontSize: 18, fontWeight: "700" },
  content: { padding: 20, gap: 10 },
  row: {
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  rowText: { fontWeight: "600", fontSize: 15 },
});
