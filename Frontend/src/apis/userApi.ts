import authApiInstance from './authApiInstance';

export interface UserProfile {
  name: string;
  email: string;
  profileImg: string;
  backgroundImg: string;
  totalPoints: number;
}

export const getUserProfile = async (userId: string): Promise<UserProfile> => {
  try {
    const response = await authApiInstance.get(`/users/${userId}/profile`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch user profile');
  }
};

export const uploadProfileImage = async (userId: string, file: File): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append('image', file);

    const response = await authApiInstance.post(`/users/${userId}/profile-image`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to upload profile image');
  }
};

export const uploadBackgroundImage = async (userId: string, file: File): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append('image', file);

    const response = await authApiInstance.post(`/users/${userId}/background-image`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to upload background image');
  }
};

export const getUserPoints = async (userId: string): Promise<number> => {
  try {
    const response = await authApiInstance.get(`/users/${userId}/points`);
    return response.data.points;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch user points');
  }
};