import authApiInstance from "./authApiInstance";

export interface LoginData {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  userId: string;
}

export const loginUserApi = async (loginData: LoginData): Promise<LoginResponse> => {
  try {
    const response = await authApiInstance.post<LoginResponse>('/auth/login', loginData);
    return response.data; // Return the tokens and user data
  } catch (error: any) { // Use `any` for Axios errors
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || "Login failed. Please try again.");
    } else {
      throw new Error("An unexpected error occurred.");
    }
  }
};
