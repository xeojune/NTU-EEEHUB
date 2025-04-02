import authApiInstance from './authApiInstance';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

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

export const useGetUserPoints = (userId: string) => {
  return useQuery<number, Error>({
    queryKey: ['userPoints', userId],
    queryFn: () => getUserPoints(userId),
    enabled: !!userId,
  });
};

export const useUserPointsMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: getUserPoints,
    onSuccess: (_, userId) => {
      // Invalidate and refetch user points
      queryClient.invalidateQueries({ queryKey: ['userPoints', userId] });
      // Also invalidate user profile as it contains total points
      queryClient.invalidateQueries({ queryKey: ['userProfile', userId] });
    },
  });
};