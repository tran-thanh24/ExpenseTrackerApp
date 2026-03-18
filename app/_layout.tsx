import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect, useState } from "react";

export default function RootLayout() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    setIsReady(true);
  }, []);

  useEffect(() => {
    if (!isReady) return;

    const inAuthGroup = segments[0] === "auth";

    if (!isLoggedIn && !inAuthGroup) {
      router.replace("/auth/login");
    } else if (isLoggedIn && inAuthGroup) {
      router.replace("/(tabs)/index");
    }
  }, [isLoggedIn, segments, isReady]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="auth/login" />
      <Stack.Screen name="auth/register" />
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
