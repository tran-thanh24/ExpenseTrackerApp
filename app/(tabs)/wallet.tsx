import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { router, useFocusEffect } from "expo-router";
import { jwtDecode } from "jwt-decode";
import {
  ChevronRight,
  Landmark,
  Plus,
  Ticket,
  Trash2,
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
  const [userName, setUserName] = useState("Thành");

  const [newName, setNewName] = useState("");
  const [newBalance, setNewBalance] = useState("");

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
    const walletName = newName.trim();
    const rawBalance = newBalance.replace(/\./g, "");
    const parsedBalance = parseFloat(rawBalance);

    if (!walletName || !rawBalance) {
      Alert.alert("Lỗi", "Vui lòng nhập đủ thông tin");
      return;
    }

    if (walletName.length < 2) {
      Alert.alert("Lỗi", "Tên ví phải có ít nhất 2 ký tự");
      return;
    }

    if (!Number.isFinite(parsedBalance) || parsedBalance <= 0) {
      Alert.alert("Lỗi", "Số dư ban đầu phải là số lớn hơn 0");
      return;
    }

    try {
      await apiClient.post("/Wallet", {
        name: walletName,
        balance: parsedBalance,
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

  const handleDeleteWallet = async (wallet: any) => {
    Alert.alert(
      "Xóa ví",
      `Bạn có chắc muốn xóa ví "${wallet.name}" không? Hành động này không thể hoàn tác.`,
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Xóa",
          style: "destructive",
          onPress: async () => {
            try {
              const res = await apiClient.delete(`/Wallet/${wallet.id}`);
              fetchWallets();
              Alert.alert("Thành công", res?.data?.message || "Đã xóa ví.");
            } catch (error: any) {
              const apiMessage =
                error?.response?.data?.message ||
                (typeof error?.response?.data === "string"
                  ? error.response.data
                  : null);
              Alert.alert("Lỗi", apiMessage || "Không thể xóa ví.");
            }
          },
        },
      ]
    );
  };

  const totalBalance = wallets.reduce(
    (sum, item: any) => sum + item.balance,
    0
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <LinearGradient
        colors={["#0f172a", "#1e293b", "#334155"]}
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
          </View>
          <View style={styles.overviewCard}>
            <Text style={styles.overviewLabel}>Tổng số ví đang quản lý</Text>
            <View style={styles.overviewBottomRow}>
              <Text style={styles.overviewValue}>{wallets.length} ví</Text>
              <TouchableOpacity
                style={styles.overviewAddBtn}
                onPress={() => setModalVisible(true)}
                activeOpacity={0.85}
              >
                <Plus color="#e2e8f0" size={15} />
                <Text style={styles.overviewAddText}>Thêm ví mới</Text>
              </TouchableOpacity>
            </View>
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
                  <View style={styles.cardActions}>
                    <TouchableOpacity
                      style={styles.deleteBtn}
                      onPress={(event: any) => {
                        event.stopPropagation?.();
                        handleDeleteWallet(item);
                      }}
                      activeOpacity={0.8}
                    >
                      <Trash2 color="#ef4444" size={16} />
                    </TouchableOpacity>
                    <ChevronRight color="#cbd5e1" size={20} />
                  </View>
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
  container: { flex: 1, backgroundColor: "#f1f5f9" },
  headerGradient: {
    paddingBottom: 76,
    borderBottomLeftRadius: 44,
    borderBottomRightRadius: 44,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 25,
    paddingTop: 14,
  },
  userGreeting: { color: "#cbd5e1", fontSize: 13, fontWeight: "600" },
  totalLabel: {
    color: "#e2e8f0",
    fontSize: 15,
    fontWeight: "700",
    marginTop: 8,
  },
  totalAmount: { color: "#fff", fontSize: 34, fontWeight: "900", marginTop: 6 },
  overviewCard: {
    marginHorizontal: 25,
    marginTop: 22,
    backgroundColor: "rgba(148, 163, 184, 0.2)",
    borderWidth: 1,
    borderColor: "rgba(226, 232, 240, 0.25)",
    borderRadius: 20,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  overviewLabel: { color: "#cbd5e1", fontSize: 12, fontWeight: "600" },
  overviewBottomRow: {
    marginTop: 6,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  overviewValue: { color: "#fff", fontSize: 18, fontWeight: "800" },
  overviewAddBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "rgba(15,23,42,0.34)",
    borderWidth: 1,
    borderColor: "rgba(226,232,240,0.22)",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 14,
  },
  overviewAddText: { color: "#e2e8f0", fontSize: 12, fontWeight: "700" },
  body: { flex: 1, marginTop: -46 },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    marginBottom: 14,
    gap: 10,
  },
  sectionTitle: { fontSize: 20, fontWeight: "800", color: "#0f172a" },
  badge: {
    backgroundColor: "#2563eb",
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 12,
  },
  badgeText: { color: "#fff", fontSize: 12, fontWeight: "700" },
  listContainer: { paddingHorizontal: 18, paddingBottom: 120 },
  newWalletCard: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    shadowColor: "#0f172a",
    shadowOpacity: 0.06,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  cardActions: { flexDirection: "row", alignItems: "center", gap: 8 },
  deleteBtn: {
    width: 32,
    height: 32,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fef2f2",
    borderWidth: 1,
    borderColor: "#fee2e2",
  },
  cardBrand: { flexDirection: "row", alignItems: "center", gap: 12, flex: 1 },
  brandIconBg: {
    width: 50,
    height: 50,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  cardName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0f172a",
    flexShrink: 1,
  },
  cardBottom: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
    gap: 5,
  },
  cardBalanceLabel: {
    fontSize: 11,
    color: "#94a3b8",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  cardBalanceValue: { fontSize: 23, fontWeight: "900" },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(2, 6, 23, 0.66)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 34,
    borderTopRightRadius: 34,
    paddingHorizontal: 22,
    paddingTop: 14,
    paddingBottom: 34,
  },
  modalIndicator: {
    width: 42,
    height: 5,
    backgroundColor: "#dbeafe",
    borderRadius: 10,
    alignSelf: "center",
    marginBottom: 18,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  modalTitle: { fontSize: 21, fontWeight: "800", color: "#0f172a" },
  inputLabel: {
    fontSize: 14,
    color: "#475569",
    fontWeight: "700",
    marginTop: 18,
    marginBottom: 8,
  },
  premiumInput: {
    backgroundColor: "#f8fafc",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 16,
    fontSize: 16,
    color: "#0f172a",
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  confirmBtn: {
    backgroundColor: "#2563eb",
    padding: 17,
    borderRadius: 16,
    alignItems: "center",
    marginTop: 28,
    shadowColor: "#1d4ed8",
    shadowOpacity: 0.28,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
  },
  confirmBtnText: { color: "#fff", fontWeight: "800", fontSize: 16 },
});
