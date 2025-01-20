import authApiInstance from './authApiInstance';

export const refreshApi = async (refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> => {
  try {
    const response = await authApiInstance.post('/auth/refresh', { refreshToken });
    return response.data; // Returns new access and refresh tokens
  } catch (error: any) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || 'Failed to refresh access token.');
    }
    throw new Error('An unexpected error occurred.');
  }
};
