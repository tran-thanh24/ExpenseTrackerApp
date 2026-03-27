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
      // Nếu không còn đăng nhập, đưa về login ngay
      if (!inAuthGroup) {
        router.replace("/auth/login");
      }
    } else {
      // Nếu đã đăng nhập mà đứng ở màn login/register thì đưa vào home
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
