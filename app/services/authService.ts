import apiClient from "./api";

export const login = async (email: string, password: string) => {
  try {
    const response = await apiClient.post("/Auth/login", {
      email,
      password,
    });
    return response.data;
  } catch (error: any) {
    throw error;
  }
};

export const register = async (userData: {
  fullName: string;
  email: string;
  username: string;
  phoneNumber?: string;
  password: string;
}) => {
  try {
    const response = await apiClient.post("/Auth/register", userData);
    return response.data;
  } catch (error: any) {
    throw error;
  }
};
