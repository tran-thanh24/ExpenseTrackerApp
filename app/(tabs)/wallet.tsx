import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { router, useFocusEffect } from "expo-router";
import { jwtDecode } from "jwt-decode";
import {
  ChevronRight,
  Landmark,
  Plus,
  Ticket,
  Wallet as WalletIcon,
  X,
  Zap,
} from "lucide-react-native";
import React, { useCallback, useState } from "react";
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  RefreshControl,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import apiClient from "../services/api";

// --- HÀM NHẬN DIỆN MÀU SẮC NGÂN HÀNG ---
const getBankConfig = (bankName: string) => {
  const nameLower = bankName.toLowerCase();
  if (nameLower.includes("viettin"))
    return {
      icon: <Landmark color="#0c56b7" size={24} />,
      bg: "#e6f0fa",
      theme: "#0c56b7",
    };
  if (nameLower.includes("tpbank") || nameLower.includes("tp bank"))
    return {
      icon: <Zap color="#5e1c94" size={24} />,
      bg: "#f3e8ff",
      theme: "#5e1c94",
    };
  if (nameLower.includes("momo"))
    return {
      icon: <WalletIcon color="#d40087" size={24} />,
      bg: "#fae6f2",
      theme: "#d40087",
    };
  if (nameLower.includes("vietcom"))
    return {
      icon: <Ticket color="#009245" size={24} />,
      bg: "#e6faf0",
      theme: "#009245",
    };
  return {
    icon: <Landmark color="#3b82f6" size={24} />,
    bg: "#eff6ff",
    theme: "#3b82f6",
  };
};

export default function FinalPremiumWalletScreen() {
  const [wallets, setWallets] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [userName, setUserName] = useState("Thành"); // Mặc định

  const [newName, setNewName] = useState("");
  const [newBalance, setNewBalance] = useState("");

  // --- 1. LẤY USERNAME TỪ BACKEND (TOKEN) ---
  const getUserInfo = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      if (token) {
        const decoded: any = jwtDecode(token);
        setUserName(decoded.unique_name || decoded.name || "Tran Cong Thanh");
      }
    } catch (err) {
      console.log("Lỗi giải mã token:", err);
    }
  };

  // --- 2. ĐỊNH DẠNG SỐ TIỀN ---
  const formatVisualNumber = (val: string) => {
    if (!val) return "";
    const number = val.replace(/[^0-9]/g, "");
    return number.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const fetchWallets = async () => {
    try {
      setRefreshing(true);
      const response = await apiClient.get("/Wallet");
      setWallets(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchWallets();
      getUserInfo();
    }, [])
  );

  const handleCreateWallet = async () => {
    if (!newName || !newBalance) {
      Alert.alert("Lỗi", "Vui lòng nhập đủ thông tin");
      return;
    }
    try {
      const rawBalance = newBalance.replace(/\./g, "");
      await apiClient.post("/Wallet", {
        name: newName,
        balance: parseFloat(rawBalance),
      });
      setModalVisible(false);
      setNewName("");
      setNewBalance("");
      fetchWallets();
      Alert.alert("Thành công", "Ví mới đã sẵn sàng!");
    } catch (error) {
      Alert.alert("Lỗi", "Không thể tạo ví");
    }
  };

  const totalBalance = wallets.reduce(
    (sum, item: any) => sum + item.balance,
    0
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <LinearGradient
        colors={["#1e293b", "#334155"]}
        style={styles.headerGradient}
      >
        <SafeAreaView edges={["top"]}>
          <View style={styles.headerContent}>
            <View>
              <Text style={styles.userGreeting}>Chào {userName},</Text>
              <Text style={styles.totalLabel}>Tổng tài sản hiện có</Text>
              <Text style={styles.totalAmount}>
                {new Intl.NumberFormat("vi-VN").format(totalBalance)} đ
              </Text>
            </View>
            <TouchableOpacity
              style={styles.plusCircle}
              onPress={() => setModalVisible(true)}
            >
              <Plus color="#fff" size={28} />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </LinearGradient>

      <View style={styles.body}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Ví của tôi</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{wallets.length}</Text>
          </View>
        </View>

        <FlatList
          data={wallets}
          keyExtractor={(item: any) => item.id.toString()}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={fetchWallets}
              tintColor="#3b82f6"
            />
          }
          renderItem={({ item }) => {
            const config = getBankConfig(item.name);
            return (
              <TouchableOpacity
                style={styles.newWalletCard}
                activeOpacity={0.8}
                onPress={() =>
                  router.push({
                    pathname: "/wallet/wallet-detail",
                    params: {
                      id: item.id,
                      name: item.name,
                      balance: item.balance,
                    },
                  })
                }
              >
                <View style={styles.cardTop}>
                  <View style={styles.cardBrand}>
                    <View
                      style={[
                        styles.brandIconBg,
                        { backgroundColor: config.bg },
                      ]}
                    >
                      {config.icon}
                    </View>
                    <Text style={styles.cardName}>{item.name}</Text>
                  </View>
                  <ChevronRight color="#cbd5e1" size={20} />
                </View>
                <View style={styles.cardBottom}>
                  <Text style={styles.cardBalanceLabel}>Số dư khả dụng</Text>
                  <Text
                    style={[styles.cardBalanceValue, { color: config.theme }]}
                  >
                    {new Intl.NumberFormat("vi-VN").format(item.balance)} đ
                  </Text>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      </View>

      {/* --- MODAL THÊM VÍ --- */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.modalContainer}
          >
            <View style={styles.modalIndicator} />
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Thêm ví mới</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <X color="#94a3b8" size={24} />
              </TouchableOpacity>
            </View>

            <Text style={styles.inputLabel}>Tên ví</Text>
            <TextInput
              style={styles.premiumInput}
              placeholder="Viettinbank, Momo..."
              value={newName}
              onChangeText={setNewName}
            />

            <Text style={styles.inputLabel}>Số dư ban đầu (đ)</Text>
            <TextInput
              style={styles.premiumInput}
              placeholder="0"
              keyboardType="numeric"
              value={newBalance}
              onChangeText={(text) => setNewBalance(formatVisualNumber(text))}
            />

            <TouchableOpacity
              style={styles.confirmBtn}
              onPress={handleCreateWallet}
            >
              <Text style={styles.confirmBtnText}>Xác nhận thêm ví</Text>
            </TouchableOpacity>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  headerGradient: {
    paddingBottom: 50,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 25,
    paddingTop: 20,
  },
  userGreeting: { color: "#94a3b8", fontSize: 13, fontWeight: "600" },
  totalLabel: {
    color: "#cbd5e1",
    fontSize: 15,
    fontWeight: "700",
    marginTop: 8,
  },
  totalAmount: { color: "#fff", fontSize: 32, fontWeight: "900", marginTop: 4 },
  plusCircle: {
    width: 55,
    height: 55,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  body: { flex: 1, marginTop: -35 },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 30,
    marginBottom: 15,
    gap: 10,
  },
  sectionTitle: { fontSize: 18, fontWeight: "800", color: "#1e293b" },
  badge: {
    backgroundColor: "#3b82f6",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  badgeText: { color: "#fff", fontSize: 12, fontWeight: "700" },
  listContainer: { paddingHorizontal: 20, paddingBottom: 100 },
  newWalletCard: {
    backgroundColor: "#fff",
    borderRadius: 30,
    padding: 22,
    marginBottom: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 15,
  },
  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  cardBrand: { flexDirection: "row", alignItems: "center", gap: 12 },
  brandIconBg: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  cardName: { fontSize: 17, fontWeight: "700", color: "#1e293b" },
  cardBottom: { gap: 4 },
  cardBalanceLabel: {
    fontSize: 11,
    color: "#94a3b8",
    fontWeight: "700",
    textTransform: "uppercase",
  },
  cardBalanceValue: { fontSize: 22, fontWeight: "800" },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.7)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    padding: 25,
    paddingBottom: 40,
  },
  modalIndicator: {
    width: 40,
    height: 5,
    backgroundColor: "#e2e8f0",
    borderRadius: 10,
    alignSelf: "center",
    marginBottom: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  modalTitle: { fontSize: 22, fontWeight: "800", color: "#1e293b" },
  inputLabel: {
    fontSize: 14,
    color: "#64748b",
    fontWeight: "700",
    marginTop: 20,
    marginBottom: 8,
  },
  premiumInput: {
    backgroundColor: "#f8fafc",
    padding: 18,
    borderRadius: 20,
    fontSize: 16,
    color: "#1e293b",
    borderWidth: 1,
    borderColor: "#f1f5f9",
  },
  confirmBtn: {
    backgroundColor: "#3b82f6",
    padding: 20,
    borderRadius: 20,
    alignItems: "center",
    marginTop: 30,
  },
  confirmBtnText: { color: "#fff", fontWeight: "800", fontSize: 16 },
});
