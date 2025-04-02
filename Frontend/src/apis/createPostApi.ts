import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast'; // Import toast from react-hot-toast
import postApiInstance from './postApiInstance';

// Define the type for the API response
export interface CreatePostResponse {
  success: boolean;
  message: string;
  post: {
    id: string;
    username: string;
    caption: string;
    imageUrls: string[];
    createdAt: string;
    updatedAt: string;
    points: number;
  };
}

// API function to handle form submission
export const createPost = async (payload: {
  files: File[], 
  caption: string, 
  points: number,
  username: string
}): Promise<CreatePostResponse> => {
  try {
    const { files, caption, points, username } = payload;
    const formData = new FormData();
    
    // Ensure each file is appended with a unique field name
    files.forEach((file, index) => {
      formData.append(`images`, file); // Keep the field name as 'images' for array handling on server
    });
    
    // Add other form data
    formData.append('caption', caption);
    formData.append('points', points.toString());
    formData.append('username', username);
    
    const userId = localStorage.getItem('userId'); // Get userId from localStorage
    if (!userId) {
      throw new Error('User ID not found');
    }
    formData.append('userId', userId);

    // Log the FormData contents for debugging
    console.log('Files being uploaded:', files.length);
    
    const response = await postApiInstance.post<CreatePostResponse>('/api/posts', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error: any) {
    console.error('Error creating post:', error.response?.data || error.message);
    throw error;
  }
};

interface UseCreatePostMutationProps {
  onSuccess?: () => void;
  onError?: () => void;
}

export const useCreatePostMutation = ({ onSuccess, onError }: UseCreatePostMutationProps = {}) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createPost,
    onSuccess: (data) => {
      // Show success message
      toast.success('Successfully created post');
      
      // Invalidate and refetch posts query to refresh the feed
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      
      // Invalidate user points since they've been deducted
      const userId = localStorage.getItem('userId');
      if (userId) {
        queryClient.invalidateQueries({ queryKey: ['userPoints', userId] });
        queryClient.invalidateQueries({ queryKey: ['userProfile', userId] });
      }
      
      // Call the custom onSuccess callback if provided
      onSuccess?.();
    },
    onError: (error: Error) => {
      // Show error message
      toast.error(error.message || 'Failed to create post');
      
      // Call the custom onError callback if provided
      onError?.();
    }
  });
};