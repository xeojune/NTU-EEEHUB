import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import postApiInstance from './postApiInstance';
import toast from 'react-hot-toast'; // Assuming toast is imported from another file

export interface Comment {
  _id: string;
  text: string;
  postId: string;
  username: string;
  userId: string;
  points: number;
  createdAt: string;
  updatedAt: string;
}

// Create comment
export const createComment = async (payload: {
  text: string;
  postId: string;
  username: string;
  userId: string;
}): Promise<Comment> => {
  const response = await postApiInstance.post<Comment>('/api/comments', payload);
  return response.data;
};

// Get comments for a post
export const getCommentsByPostId = async (postId: string): Promise<Comment[]> => {
  const response = await postApiInstance.get<Comment[]>(`/api/comments/post/${postId}`);
  return response.data;
};

// Delete comment
export const deleteComment = async (commentId: string, userId: string): Promise<void> => {
  await postApiInstance.delete(`/api/comments/${commentId}`, { data: { userId } });
};

// Update comment
export const updateComment = async (payload: {
  commentId: string;
  userId: string;
  text: string;
}): Promise<Comment> => {
  const response = await postApiInstance.put<Comment>(
    `/api/comments/${payload.commentId}`,
    { userId: payload.userId, text: payload.text }
  );
  return response.data;
};

// Distribute points to comment
export const distributePoints = async (payload: {
  commentId: string;
  points: number;
  postId: string;
  postOwnerId: string;
}): Promise<Comment> => {
  const response = await postApiInstance.put<Comment>(
    `/api/comments/${payload.commentId}/points`,
    payload
  );
  return response.data;
};

// React Query Hooks
export const useCreateCommentMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createComment,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['comments', variables.postId] });
    },
  });
};

export const useGetComments = (postId: string) => {
  return useQuery<Comment[], Error>({
    queryKey: ['comments', postId],
    queryFn: () => getCommentsByPostId(postId),
    enabled: !!postId,
  });
};

export const useDeleteCommentMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ commentId, userId }: { commentId: string; userId: string }) =>
      deleteComment(commentId, userId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['comments'] });
    },
  });
};

export const useUpdateCommentMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: updateComment,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['comments'] });
    },
  });
};

export const useDistributePointsMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: distributePoints,
    onSuccess: (data, variables) => {
      // Invalidate comments for the post
      queryClient.invalidateQueries({ queryKey: ['comments', variables.postId] });
      
      // Invalidate post data since points have been distributed
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      
      // Invalidate points for both users (post owner and comment author)
      const commentAuthorId = data.userId; // Assuming the response includes the comment author's userId
      if (commentAuthorId) {
        queryClient.invalidateQueries({ queryKey: ['userPoints', commentAuthorId] });
        queryClient.invalidateQueries({ queryKey: ['userProfile', commentAuthorId] });
      }
      
      if (variables.postOwnerId) {
        queryClient.invalidateQueries({ queryKey: ['userPoints', variables.postOwnerId] });
        queryClient.invalidateQueries({ queryKey: ['userProfile', variables.postOwnerId] });
      }
      
      // Show success message
      toast.success('Points distributed successfully');
    },
    onError: (error: Error) => {
      // Show error message
      toast.error(error.message || 'Failed to distribute points');
    },
  });
};