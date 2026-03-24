import apiClient from "./api"; // Đảm bảo đường dẫn này đúng tới file api.ts của bạn

export const login = async (email: any, password: any) => {
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

export const register = async (fullName: any, email: any, password: any) => {
  try {
    const response = await apiClient.post("/Auth/register", {
      fullName,
      email,
      password,
    });
    return response.data;
  } catch (error: any) {
    throw error;
  }
};
