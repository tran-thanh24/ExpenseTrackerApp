import { useRouter } from "expo-router";
import { ChevronLeft, Edit3, Trash2, Utensils } from "lucide-react-native";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import styles from "./styles";

export default function ExpenseDetailScreen() {
  const router = useRouter();
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ChevronLeft size={28} color="#1e293b" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Details</Text>
        <View style={{ width: 28 }} />
      </View>

      <View style={styles.card}>
        <View style={styles.iconContainer}>
          <Utensils size={32} color="#4db6ac" />
        </View>
        <Text style={styles.title}>Dinner at a restaurant</Text>
        <Text style={styles.date}>Today, 10:32 AM</Text>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Amount</Text>
          <Text style={styles.amount}>$50.00</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Category</Text>
          <Text style={styles.value}>Food</Text>
        </View>
      </View>

      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.editBtn}>
          <Edit3 size={20} color="#fff" />
          <Text style={styles.btnText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteBtn}>
          <Trash2 size={20} color="#fff" />
          <Text style={styles.btnText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
