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
export const createPost = async (
  files: File[], 
  caption: string, 
  points: number,
  username: string
): Promise<CreatePostResponse> => {
  try {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('images', file);
    });
    formData.append('caption', caption);
    formData.append('points', points.toString());
    formData.append('username', username);

    const response = await postApiInstance.post<CreatePostResponse>('/api/posts', formData);

    return response.data;
  } catch (error) {
    console.error('Error creating post:', error);
    throw error;
  }
};
