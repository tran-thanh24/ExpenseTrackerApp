import { Stack, usePathname, useRouter } from "expo-router";
import { useEffect } from "react";
import { AuthProvider, useAuth } from "./contexts/AuthContext";

function RootLayoutNav() {
  const { isLoggedIn, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) return;

    const inAuthGroup = pathname?.startsWith("/auth");

    if (!isLoggedIn) {
      if (!inAuthGroup) {
        router.replace("/auth/login");
      }
    } else {
      if (inAuthGroup) {
        router.replace("/(tabs)/home");
      }
    }
  }, [isLoggedIn, pathname, loading]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="auth/login" />
      <Stack.Screen name="auth/register" />
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}
