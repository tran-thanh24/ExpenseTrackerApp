import { Tabs, useRouter } from "expo-router";
import { Home, LayoutGrid, PieChart, Plus, User } from "lucide-react-native";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

export default function TabLayout() {
  const router = useRouter();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: false,
        tabBarActiveTintColor: "#3b82f6",
        tabBarInactiveTintColor: "#94a3b8",
      }}
    >
      <Tabs.Screen
        name="index/index"
        options={{
          tabBarIcon: ({ color }) => <Home size={24} color={color} />,
        }}
      />

      <Tabs.Screen
        name="wallet/index"
        options={{
          tabBarIcon: ({ color }) => <LayoutGrid size={24} color={color} />,
        }}
      />

      <Tabs.Screen
        name="add-button/index"
        options={{
          tabBarButton: () => (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => router.push("/add-expense")}
              style={styles.plusButtonContainer}
            >
              <View style={styles.plusButton}>
                <Plus size={30} color="#fff" strokeWidth={3} />
              </View>
            </TouchableOpacity>
          ),
        }}
      />

      <Tabs.Screen
        name="statistics/index"
        options={{
          tabBarIcon: ({ color }) => <PieChart size={24} color={color} />,
        }}
      />

      <Tabs.Screen
        name="profile/index"
        options={{
          tabBarIcon: ({ color }) => <User size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: "absolute",
    height: 75,
    backgroundColor: "#fff",
    borderTopWidth: 0,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    elevation: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    paddingBottom: 10,
  },
  plusButtonContainer: {
    top: -25,
    justifyContent: "center",
    alignItems: "center",
    width: 70,
  },
  plusButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#4db6ac",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 5,
    borderColor: "#F8FAFC",
    shadowColor: "#4db6ac",
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 5,
  },
});
