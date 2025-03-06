import axios, { AxiosError } from 'axios';
import { FeedPostProps } from '../types/postType';
import { useQuery, UseQueryResult, useQueryClient } from '@tanstack/react-query';

interface GetPostsParams {
  page?: number;
  username?: string;
}

export type PostsError = AxiosError<{
  message: string;
  status: number;
}>;

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

export const POSTS_QUERY_KEY = 'posts';

export function usePosts({ page = 1, username }: { page: number; username: string }): UseQueryResult<FeedPostProps[], PostsError> {
  const queryClient = useQueryClient();

  return useQuery({
    queryFn: () => getPosts({ page, username }),
    queryKey: [POSTS_QUERY_KEY, page],
    staleTime: 0, // Always treat data as stale to ensure fresh data on refetch
  });
}

// Utility function to invalidate posts cache
export const invalidatePostsCache = async (queryClient: any) => {
  await queryClient.invalidateQueries({ queryKey: [POSTS_QUERY_KEY] });
};