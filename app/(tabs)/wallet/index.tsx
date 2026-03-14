import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import styles from "./styles";
export default function WalletScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>My Wallet</Text>
        <Text style={styles.subtitle}>Tính năng đang được cập nhật....</Text>
      </View>
    </SafeAreaView>
  );
}
