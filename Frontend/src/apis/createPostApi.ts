import postApiInstance from './postApiInstance';

// Define the type for the API response
export interface CreatePostResponse {
  success: boolean;
  message: string;
  post: {
    id: string;
    caption: string;
    imageUrl: string;
    createdAt: string;
    updatedAt: string;
    points: number;
  };
}

// API function to handle form submission
export const createPost = async (file: File, caption: string, points: number): Promise<CreatePostResponse> => {
  try {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('caption', caption);
    formData.append('points', points.toString());

    const response = await postApiInstance.post<CreatePostResponse>('/api/posts', formData);

    return response.data; // Return the response data
  } catch (error) {
    console.error('Error creating post:', error);
    throw error; // Re-throw the error for further handling
  }
};
