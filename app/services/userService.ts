import apiClient from "./api";

export const updateProfileApi = async (updateData: {
  fullName: string;
  email: string;
  phoneNumber: string;
}) => {
  try {
    const response = await apiClient.put("/User/update-profile", updateData);
    return response.data;
  } catch (error: any) {
    throw error;
  }
};

export const changePasswordApi = async (passwordData: {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}) => {
  try {
    const response = await apiClient.put("/User/change-password", passwordData);
    return response.data;
  } catch (error: any) {
    throw error;
  }
};
