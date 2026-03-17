import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect, useState } from "react";

export default function RootLayout() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    const inAuthGroup = segments[0] === "auth";

    if (!isLoggedIn && !inAuthGroup) {
      router.replace("/auth/login");
    } else if (isLoggedIn && inAuthGroup) {
      router.replace("/(tabs)/index");
    }
  }, [isLoggedIn, segments]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Khai báo tất cả các route khả dụng */}
      <Stack.Screen name="auth/login/index" />
      <Stack.Screen name="auth/register/index" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen
        name="add-expense/index"
        options={{
          presentation: "modal",
          animation: "slide_from_bottom",
        }}
      />
      <Stack.Screen name="expense-detail/index" />
    </Stack>
  );
}
