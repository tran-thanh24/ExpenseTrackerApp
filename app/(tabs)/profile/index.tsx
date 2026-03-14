import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import styles from "./styles";
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
