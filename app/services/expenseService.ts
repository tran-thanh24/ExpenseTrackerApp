import apiClient from "./api";

export const getExpensesApi = async () => {
  const response = await apiClient.get("/Expense");
  return response.data;
};
