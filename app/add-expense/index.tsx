import { useRouter } from "expo-router";
import { ChevronLeft, Utensils } from "lucide-react-native";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import styles from "./styles";

export default function ExpenseDetail() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ChevronLeft size={28} color="#1e293b" />
        </TouchableOpacity>
      </View>
      <View style={styles.card}>
        <View style={[styles.iconWrapper, { backgroundColor: "#e0f2f1" }]}>
          <Utensils size={30} color="#4db6ac" />
        </View>
        <Text style={styles.title}>Dinner at a restaurant</Text>
        <Text style={styles.date}>Today, 10:32 AM</Text>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Description</Text>
          <Text style={[styles.value, { color: "#059669" }]}>$50.00</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Category</Text>
          <Text style={styles.value}>Fodd</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Date</Text>
          <Text style={styles.value}>April 22, 2025</Text>
        </View>
      </View>

      <View style={styles.btnGroup}>
        <TouchableOpacity style={styles.editBtn}>
          <Text style={{ color: "#fff", fontWeight: "bold" }}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteBtn}>
          <Text style={{ color: "#fff", fontWeight: "bold" }}>Delete</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
