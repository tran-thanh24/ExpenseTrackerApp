import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";

const APP_SETTINGS_KEY = "profile_app_settings";

export const LightTheme = {
  background: "#f8fafc",
  card: "#ffffff",
  text: "#1e293b",
  subtext: "#64748b",
  border: "#e2e8f0",
  primary: "#4db6ac",
};

export const DarkTheme = {
  background: "#0f172a",
  card: "#1e293b",
  text: "#f8fafc",
  subtext: "#94a3b8",
  border: "#334155",
  primary: "#4db6ac",
};

type ThemeContextType = {
  isDarkMode: boolean;
  toggleTheme: (value: boolean) => void;
  colors: typeof LightTheme;
};

const ThemeContext = createContext<ThemeContextType>({
  isDarkMode: false,
  toggleTheme: () => {},
  colors: LightTheme,
});

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const raw = await AsyncStorage.getItem(APP_SETTINGS_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          setIsDarkMode(parsed.darkMode || false);
        }
      } catch (error) {
        console.log("Lỗi đọc theme:", error);
      }
    };
    loadTheme();
  }, []);

  const toggleTheme = async (value: boolean) => {
    setIsDarkMode(value);
  };

  const colors = isDarkMode ? DarkTheme : LightTheme;

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme, colors }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
