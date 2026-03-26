import { useRouter } from "expo-router";
import {
  Bell,
  ChevronRight,
  DollarSign,
  FileText,
  Moon,
  Shield,
  User,
} from "lucide-react-native";
import {
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
export default function Page() {
  const router = useRouter();
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 20 }}
      >
        <Text style={styles.title}>Profile</Text>

        <TouchableOpacity style={styles.userCard}>
          <View style={styles.avatarPlaceholder} />
          <View style={styles.userInfo}>
            <Text style={styles.userName}>Trần Thành</Text>
            <Text style={styles.userEmail}>tcthanh2412@gmail.com</Text>
          </View>
          <ChevronRight size={20} color="#94a3b8" />
        </TouchableOpacity>

        <View style={styles.menuGroup}>
          <MenuItem
            icon={<User size={20} color="#64748b" />}
            label="Edit Profile"
          />
          <MenuItem
            icon={<Bell size={20} color="#64748b" />}
            label="Notifications"
            rightComponent={
              <Switch value={true} trackColor={{ true: "#3b82f6" }} />
            }
          />
          <MenuItem
            icon={<DollarSign size={20} color="#64748b" />}
            label="Currency"
            value="USD - US Dollar"
          />
          <MenuItem
            icon={<Moon size={20} color="#64748b" />}
            label="Dark Mode"
            rightComponent={<Switch value={false} />}
          />
        </View>

        <Text style={styles.menuSectionLabel}>More</Text>
        <View style={styles.menuGroup}>
          <MenuItem
            icon={<Shield size={20} color="#64748b" />}
            label="Security"
          />
          <MenuItem
            icon={<FileText size={20} color="#64748b" />}
            label="Privacy Policy"
          />
        </View>

        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={() => router.push("/auth/login")}
        >
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const MenuItem = ({ icon, label, value, rightComponent }: any) => (
  <TouchableOpacity style={styles.menuItem}>
    <View style={styles.menuIcon}>{icon}</View>
    <Text style={styles.menuLabel}>{label}</Text>
    {value && <Text style={styles.menuValue}>{value}</Text>}
    {rightComponent ? (
      rightComponent
    ) : (
      <ChevronRight size={18} color="#cbd5e1" />
    )}
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 20,
  },
  userCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 20,
    marginBottom: 25,
  },
  avatarPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#e2e8f0",
  },
  userInfo: {
    flex: 1,
    marginLeft: 15,
  },
  userName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1e293b",
  },
  userEmail: {
    fontSize: 14,
    color: "#94a3b8",
  },
  menuGroup: {
    backgroundColor: "#fff",
    borderRadius: 20,
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  menuIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#f8fafc",
    justifyContent: "center",
    alignItems: "center",
  },
  menuLabel: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    fontWeight: "500",
    color: "#1e293b",
  },
  menuValue: {
    marginRight: 8,
    color: "#94a3b8",
    fontSize: 14,
  },
  menuSectionLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#94a3b8",
    marginLeft: 5,
    marginBottom: 10,
  },
  logoutBtn: {
    marginTop: 10,
    alignItems: "center",
    padding: 15,
  },
  logoutText: {
    color: "#ef4444",
    fontWeight: "600",
    fontSize: 16,
  },
});
