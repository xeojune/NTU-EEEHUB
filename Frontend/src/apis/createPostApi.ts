import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast'; // Import toast from react-hot-toast
import postApiInstance from './postApiInstance';
import { notificationApi, NotificationType } from './notificationApi';
import { friendsApi } from './friendsApi';

// Define the type for the API response
export interface CreatePostResponse {
  success: boolean;
  message: string;
  post: {
    _id: string; // Changed from id to _id to match MongoDB schema
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
    files.forEach((file) => {
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
  onSuccess?: (data: CreatePostResponse) => void;
  onError?: () => void;
}

export const useCreatePostMutation = ({ onSuccess, onError }: UseCreatePostMutationProps = {}) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createPost,
    onSuccess: async (data) => {
      try {
        // Show success message
        toast.success('Successfully created post');
        
        // Get current user's followers
        const userId = localStorage.getItem('userId');
        const username = localStorage.getItem('username');
        
        if (userId && username && data.success && data.post) {
          console.log('Post created successfully:', data.post); // Debug log
          
          try {
            // Get followers
            const followersResponse = await friendsApi.getFollowers(userId);
            const followers = followersResponse.data.followers || [];
            console.log('Found followers:', followers.length); // Debug log
            
            if (followers.length > 0) {
              // Create a single notification for all followers
              await notificationApi.createNotification({
                recipientId: followers.map(follower => follower.userId), // Send array of recipient IDs
                senderId: userId,
                type: NotificationType.NEW_POST,
                content: `${username} created a new post`,
                entityId: data.post._id,
                entityType: 'Post'
              });
              console.log('Successfully created notification for all followers');
            } else {
              console.log('No followers found to notify');
            }
          } catch (error: any) {
            console.error('Error creating notifications:', error);
            if (error.response) {
              console.error('Error details:', {
                status: error.response.status,
                data: error.response.data
              });
            }
          }
        } else {
          console.log('Missing required data:', { userId, username, postSuccess: data.success });
        }
        
        // Invalidate queries to refresh UI
        queryClient.invalidateQueries({ queryKey: ['posts'] });
        if (userId) {
          queryClient.invalidateQueries({ queryKey: ['userPoints', userId] });
          queryClient.invalidateQueries({ queryKey: ['userProfile', userId] });
        }
        
        // Call the custom onSuccess callback
        onSuccess?.(data);
      } catch (error) {
        console.error('Error in post creation success handler:', error);
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create post');
      onError?.();
    }
  });
};