import axios from 'axios';
import { FeedPostProps } from '../types/userType';

export const getPosts = async (): Promise<FeedPostProps[]> => {
  try {
    const response = await axios.get('http://localhost:3000/api/posts');
    return response.data;
  } catch (error) {
    console.error('Error fetching posts:', error);
    throw error;
  }
};
