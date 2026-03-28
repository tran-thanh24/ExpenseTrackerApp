import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkLoginStatus = async () => {
      const storedToken =
        (await AsyncStorage.getItem("userToken")) ||
        (await SecureStore.getItemAsync("userToken"));

      if (storedToken) {
        setToken(storedToken);
        setIsLoggedIn(true);
      } else {
        setToken(null);
        setIsLoggedIn(false);
      }
      setLoading(false);
    };
    checkLoginStatus();
  }, []);

  const login = async (userToken: string) => {
    await AsyncStorage.setItem("userToken", userToken);
    await SecureStore.setItemAsync("userToken", userToken);
    setToken(userToken);
    setIsLoggedIn(true);
  };

  const logout = async () => {
    await AsyncStorage.removeItem("userToken");
    await SecureStore.deleteItemAsync("userToken");
    setToken(null);
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
