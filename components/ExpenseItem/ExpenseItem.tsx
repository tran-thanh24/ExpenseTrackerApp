import { Text, View } from "react-native";
import styles from "./styles";

export default function ExpenseItem({ item }) {
  return (
    <View style={styles.container}>
      <Text>{item.title}</Text>
      <Text>${item.amount}</Text>
    </View>
  );
}
