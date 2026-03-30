import {
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationLightTheme,
  ThemeProvider as NavigationThemeProvider,
} from "@react-navigation/native";
import { Stack, usePathname, useRouter } from "expo-router";
import { useEffect } from "react";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { ThemeProvider, useTheme } from "./contexts/ThemeContext";

function RootLayoutNav() {
  const { isLoggedIn, loading } = useAuth();
  const { isDarkMode } = useTheme();
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
    <NavigationThemeProvider
      value={isDarkMode ? NavigationDarkTheme : NavigationLightTheme}
    >
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="auth/login" />
        <Stack.Screen name="auth/register" />
        <Stack.Screen name="(tabs)" />
      </Stack>
    </NavigationThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <RootLayoutNav />
      </AuthProvider>
    </ThemeProvider>
  );
}
