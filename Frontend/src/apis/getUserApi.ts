import authApiInstance from './authApiInstance';

export const getUserById = async (userId: string): Promise<{ name: string }> => {
  try {
    const response = await authApiInstance.get(`/users/${userId}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch user details');
  }
};
