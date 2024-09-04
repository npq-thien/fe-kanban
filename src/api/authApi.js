import { api, BASE_URL } from "src/configs/AxiosConfig";

export const useSignInAccount = async (data) => {
  try {
    const response = await api.post(`${BASE_URL}/api/auth/token`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};
