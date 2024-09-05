import { api, BASE_URL } from "src/configs/AxiosConfig";
import { LoginInput, SignUpInput } from "src/constants/types";


export const useSignInAccount = async (data: LoginInput) => {
  try {
    const response = await api.post(`${BASE_URL}/api/auth/token`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const useSignUpAccount = async (data: SignUpInput) => {
    try {
      const response = await api.post(`${BASE_URL}/api/user`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  };
