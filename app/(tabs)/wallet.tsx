import { Bitcoin, CreditCard, Plus, Wallet } from "lucide-react-native";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const WALLET_DATA = [
  {
    id: "1",
    title: "Main Wallet",
    balance: "1234",
    icon: <Wallet color="#fff" size={20} />,
    color: "#4db6ac",
    type: "manage",
  },
  {
    id: "2",
    title: "Savings Wallet",
    balance: "$3,120.50",
    icon: <CreditCard color="#fff" size={20} />,
    color: "#3b82f6",
    type: "amount",
  },
  {
    id: "3",
    title: "Crypto Wallet",
    balance: "$2,060.25",
    icon: <Bitcoin color="#fff" size={20} />,
    color: "#a78bfa",
    type: "amount",
  },
];

export default function WalletScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 20 }}
      >
        <Text style={styles.headerTitle}>Hello, Thành</Text>

        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Total Balance</Text>
          <Text style={styles.balanceAmount}>$5,480.75</Text>
        </View>

        <Text style={styles.sectionTitle}>My Wallets</Text>

        <View style={styles.walletListContainer}>
          {WALLET_DATA.map((item) => (
            <View key={item.id} style={styles.walletItem}>
              <View style={[styles.iconBox, { backgroundColor: item.color }]}>
                {item.icon}
              </View>
              <View style={styles.walletInfo}>
                <Text style={styles.walletName}>{item.title}</Text>
                <Text style={styles.walletDetail}>
                  {item.id === "1" ? `•••• ${item.balance}` : item.balance}
                </Text>
              </View>
              {item.type === "manage" ? (
                <TouchableOpacity style={styles.manageBtn}>
                  <Text style={styles.manageBtnText}>Manage</Text>
                </TouchableOpacity>
              ) : null}
            </View>
          ))}

          <TouchableOpacity style={styles.addWalletBtn}>
            <View style={styles.addIconBox}>
              <Plus size={18} color="#94a3b8" />
            </View>
            <Text style={styles.addWalletText}>Add New Wallet</Text>
            <TouchableOpacity style={styles.manageBtn}>
              <Text style={styles.manageBtnText}>Manage</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  headerTitle: {
    fontSize: 16,
    color: "#1e293b",
    marginBottom: 20,
  },
  balanceCard: {
    backgroundColor: "#3b82f6",
    borderRadius: 24,
    padding: 24,
    marginBottom: 25,
    shadowColor: "#3b82f6",
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  balanceLabel: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 14,
  },
  balanceAmount: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "700",
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 15,
  },
  walletListContainer: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 8,
  },
  walletItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  walletInfo: { flex: 1, marginLeft: 12 },
  walletName: { fontSize: 16, fontWeight: "600", color: "#1e293b" },
  walletDetail: { fontSize: 14, color: "#94a3b8", marginTop: 2 },
  manageBtn: {
    backgroundColor: "#f1f5f9",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  manageBtnText: { fontSize: 12, fontWeight: "600", color: "#64748b" },
  addWalletBtn: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    marginTop: 5,
  },
  addIconBox: {
    width: 32,
    height: 32,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
  },
  addWalletText: {
    flex: 1,
    marginLeft: 12,
    color: "#94a3b8",
    fontWeight: "500",
  },
});
