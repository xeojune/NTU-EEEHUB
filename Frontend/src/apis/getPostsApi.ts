import axios from 'axios';
import { FeedPostProps } from '../types/postType';

interface GetPostsParams {
  page?: number;
  username?: string;
}

export const getPosts = async ({ page = 1, username }: GetPostsParams = {}): Promise<FeedPostProps[]> => {
  try {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    if (username) {
      params.append('username', username);
    }
    
    const response = await axios.get(`http://localhost:3000/api/posts?${params.toString()}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching posts:', error);
    throw error;
  }
};
