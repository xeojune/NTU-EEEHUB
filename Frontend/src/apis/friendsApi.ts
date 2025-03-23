import axios, { AxiosError } from 'axios';

interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    message: string;
}

export interface User {
    userId: string;
    username: string;
    profileImg: string;
    followedAt?: string;
    isFollowing?: boolean;
}

interface PaginatedData<T> {
    followers?: T[];
    followings?: T[];
    users?: T[];
    total: number;
    page: number;
    totalPages: number;
}

interface PaginatedResponse<T> {
    success: boolean;
    data: PaginatedData<T>;
    message: string;
}

const friendsApiInstance = axios.create({
    baseURL: 'http://localhost:3000',
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add request interceptor to include auth token
friendsApiInstance.interceptors.request.use((config) => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
});

export const friendsApi = {
    followUser: async (userId: string): Promise<ApiResponse> => {
        try {
            const currentUserId = localStorage.getItem('userId');
            if (!currentUserId) {
                throw new Error('No user ID found in localStorage');
            }

            const payload = {
                followerId: currentUserId,
                followingId: userId
            };

            const response = await friendsApiInstance.post<ApiResponse>('/friends/follow', payload);

            // Update the response data to include isFollowing flag
            if (response.data.success) {
                response.data.data = {
                    ...response.data.data,
                    isFollowing: true
                };
            }

            return response.data;
        } catch (error) {
            const axiosError = error as AxiosError;
            console.error('Error in followUser:', {
                message: axiosError.message,
                response: axiosError.response?.data,
                status: axiosError.response?.status,
                config: {
                    url: axiosError.config?.url,
                    method: axiosError.config?.method,
                    data: axiosError.config?.data
                }
            });
            throw error;
        }
    },

    unfollowUser: async (userId: string): Promise<ApiResponse> => {
        try {
            const currentUserId = localStorage.getItem('userId');
            if (!currentUserId) {
                throw new Error('No user ID found in localStorage');
            }
            
            // Send targetUserId in the request body to match the DTO
            const { data } = await friendsApiInstance.delete<ApiResponse>(`/friends/unfollow?userId=${currentUserId}`, {
                data: {
                    targetUserId: userId
                }
            });
            return data;
        } catch (error) {
            const axiosError = error as AxiosError;
            console.error('Error unfollowing user:', axiosError);
            throw error;
        }
    },

    getFollowers: async (userId: string, page: number = 1, limit: number = 10): Promise<PaginatedResponse<User>> => {
        try {
            const { data } = await friendsApiInstance.get<PaginatedResponse<User>>('/friends/followers', {
                params: { userId, page, limit }
            });
            return data;
        } catch (error) {
            const axiosError = error as AxiosError;
            console.error('Error fetching followers:', axiosError);
            throw error;
        }
    },

    getFollowings: async (userId: string, page: number = 1, limit: number = 10): Promise<PaginatedResponse<User>> => {
        try {
            if (!userId) {
                throw new Error('No user ID provided to getFollowings');
            }

            const { data } = await friendsApiInstance.get<PaginatedResponse<User>>('/friends/followings', {
                params: { userId, page, limit }
            });

            if (data.data.followings) {
                data.data.followings = data.data.followings.map(user => ({
                    ...user,
                    isFollowing: true
                }));
            }

            return data;
        } catch (error) {
            const axiosError = error as AxiosError;
            console.error('Error fetching followings:', axiosError);
            throw error;
        }
    },

    getAllUsers: async (page: number = 1, limit: number = 10): Promise<PaginatedResponse<User>> => {
        try {
            const currentUserId = localStorage.getItem('userId');
            if (!currentUserId) {
                throw new Error('No user ID found in localStorage');
            }

            const { data } = await friendsApiInstance.get<PaginatedResponse<User>>('/friends/users', {
                params: { 
                    page, 
                    limit,
                    currentUserId 
                }
            });

            // Ensure isFollowing is properly set for each user
            if (data.data.users) {
                data.data.users = data.data.users.map(user => ({
                    ...user,
                    isFollowing: user.isFollowing || false
                }));
            }

            return data;
        } catch (error) {
            const axiosError = error as AxiosError;
            console.error('Error fetching users:', axiosError);
            throw error;
        }
    }
};