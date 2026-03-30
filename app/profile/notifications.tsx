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

const NOTI_KEY = "profile_notification_settings";

export default function NotificationSettingsScreen() {
  const router = useRouter();
  const [settings, setSettings] = useState({
    budgetAlert: true,
    billReminder: true,
    weeklyReport: false,
  });

  const loadSettings = async () => {
    try {
      const raw = await AsyncStorage.getItem(NOTI_KEY);
      if (raw) setSettings(JSON.parse(raw));
    } catch (error) {
      console.log("Lỗi đọc cài đặt thông báo:", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadSettings();
    }, [])
  );

  const updateSetting = async (key: keyof typeof settings, value: boolean) => {
    const next = { ...settings, [key]: value };
    setSettings(next);
    try {
      await AsyncStorage.setItem(NOTI_KEY, JSON.stringify(next));
    } catch (error) {
      Alert.alert("Lỗi", "Không thể lưu cài đặt thông báo");
    }
  };

  const Row = ({
    label,
    value,
    onChange,
  }: {
    label: string;
    value: boolean;
    onChange: (v: boolean) => void;
  }) => (
    <View style={styles.row}>
      <Text style={styles.rowText}>{label}</Text>
      <Switch value={value} onValueChange={onChange} />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <ChevronLeft size={22} color="#1e293b" />
        </TouchableOpacity>
        <Text style={styles.title}>Thông báo</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.content}>
        <Row
          label="Cảnh báo vượt ngân sách"
          value={settings.budgetAlert}
          onChange={(v) => updateSetting("budgetAlert", v)}
        />
        <Row
          label="Nhắc nhở hóa đơn"
          value={settings.billReminder}
          onChange={(v) => updateSetting("billReminder", v)}
        />
        <Row
          label="Báo cáo tổng kết tuần"
          value={settings.weeklyReport}
          onChange={(v) => updateSetting("weeklyReport", v)}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
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
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  title: { fontSize: 18, fontWeight: "700", color: "#1e293b" },
  content: { padding: 20, gap: 10 },
  row: {
    backgroundColor: "#fff",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  rowText: { color: "#1e293b", fontWeight: "600", fontSize: 15 },
});
