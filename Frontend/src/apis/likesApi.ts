import axios from 'axios';

// Create the API instance
const likesApiInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Optional: Add interceptors for response handling
likesApiInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    console.error('API error occurred:', error);
    return Promise.reject(error);
  }
);

export interface LikeResponse {
  isLiked: boolean;
}

export const likesApi = {
  toggleLike: async (userId: string, postId: string): Promise<LikeResponse> => {
    try {
      const response = await likesApiInstance.post('/api/likes', {
        userId,
        postId,
      });
      return response.data;
    } catch (error) {
      console.error('Error toggling like:', error);
      throw error;
    }
  },

  getLikeStatus: async (postId: string, userId: string): Promise<LikeResponse> => {
    try {
      const response = await likesApiInstance.get(`/api/likes/${postId}/status/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error getting like status:', error);
      throw error;
    }
  },

  getPostLikes: async (postId: string): Promise<number> => {
    try {
      const response = await likesApiInstance.get(`/api/likes/${postId}/count`);
      return response.data;
    } catch (error) {
      console.error('Error getting post likes:', error);
      throw error;
    }
  },
};