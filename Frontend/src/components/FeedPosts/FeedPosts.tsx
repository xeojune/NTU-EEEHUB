import React, { useRef, useCallback, useState, useEffect } from 'react';
import { ContainerSm } from '../../styles/FeedPosts/FeedPostsStyle';
import SkeletonUI from '../SkeletonUI';
import FeedPost from './FeedPost';
import { FeedPostProps } from '../../types/postType';
import { usePosts, invalidatePostsCache } from '../../apis/getPostsApi';
import { LoadingSpinner } from '../LoadingSpinner';
import defaultUserProfile from '../../assets/userImg/defaultAvatar.png'
import { useQueryClient } from '@tanstack/react-query';

const FeedPosts: React.FC = () => {
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [allPosts, setAllPosts] = useState<FeedPostProps[]>([]);
  const observer = useRef<IntersectionObserver>();
  const queryClient = useQueryClient();

  const { data: posts, error, isLoading } = usePosts({ page, username: '' });

  const lastPostElementRef = useCallback((node: HTMLDivElement) => {
    if (isLoading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [isLoading, hasMore]);

  useEffect(() => {
    if (posts) {
      if (posts.length === 0) {
        setHasMore(false);
      } else {
        setAllPosts(prev => {
          if (page === 1) return posts;
          
          const existingIds = new Set(prev.map(post => post._id));
          const uniqueNewPosts = posts.filter(post => !existingIds.has(post._id));
          
          return [...prev, ...uniqueNewPosts];
        });
      }
    }
  }, [posts, page]);

  const handlePostDeleted = async () => {
    setPage(1);
    setAllPosts([]);
    setHasMore(true);
    // Invalidate and refetch posts
    await invalidatePostsCache(queryClient);
  };

  if (error) return <div>Error loading posts</div>;
  if (isLoading && page === 1) return (
    <ContainerSm>
      {[0, 1, 2, 3].map((_, idx) => (
        <div key={idx} style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <SkeletonUI width="50px" height="50px" borderRadius="50%" />
            <SkeletonUI isText rows={2} width="300px" height="10px" />
          </div>
          <SkeletonUI width="100%" height="500px" marginTop="10px" borderRadius="8px" />
        </div>
      ))}
    </ContainerSm>
  );

  return (
    <ContainerSm>
      {allPosts.map((post, index) => {
        if (allPosts.length === index + 1) {
          return (
            <div ref={lastPostElementRef} key={post._id}>
              <FeedPost
                {...post}
                username={post.username || 'dex_xeb'}
                avatar={post.avatar || defaultUserProfile}
                onPostDeleted={handlePostDeleted}
              />
            </div>
          );
        }
        return (
          <FeedPost
            key={post._id}
            {...post}
            username={post.username || 'dex_xeb'}
            avatar={post.avatar || defaultUserProfile}
            onPostDeleted={handlePostDeleted}
          />
        );
      })}
      {isLoading && page > 1 && <LoadingSpinner />}
    </ContainerSm>
  );
};

export default FeedPosts;
