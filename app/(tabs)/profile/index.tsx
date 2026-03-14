import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
export default function Page() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatarPlaceholder} />
        <Text style={styles.name}>Trần Thành</Text>
        <Text style={styles.email}>tcthanh2412@gmail.com</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
    padding: 20,
  },
  header: {
    alignItems: "center",
    marginTop: 50,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#cbd5e1",
  },
  name: {
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 15,
  },
  email: {
    fontSize: 14,
    color: "#64748b",
  },
});
