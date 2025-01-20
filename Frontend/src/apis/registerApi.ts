import axios from "axios";
import authApiInstance from "./authApiInstance";

export interface SignupData {
    name: string;
    email: string;
    password: string;
}

export const registerUserApi = async (signupData: SignupData) => {
    try{
        const response = await authApiInstance.post('/auth/signup', signupData);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw error.response?.data || error.message;
        } else {
            throw new Error('An error occurred. Please try again.');
        }
    }
};
