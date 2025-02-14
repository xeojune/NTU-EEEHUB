import React, { useEffect, useState, useRef, useCallback } from 'react';
import { ContainerSm } from '../../styles/FeedPosts/FeedPostsStyle';
import SkeletonUI from '../SkeletonUI';
import FeedPost from './FeedPost';
import { FeedPostProps } from '../../types/postType';
import { getPosts } from '../../apis/getPostsApi';
import { LoadingSpinner } from '../LoadingSpinner';
import User1Profile from '../../assets/userImg/User1.png';

const FeedPosts: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [posts, setPosts] = useState<FeedPostProps[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef<IntersectionObserver>();
  const lastPostElementRef = useCallback((node: HTMLDivElement) => {
    if (isLoadingMore) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [isLoadingMore, hasMore]);

  const fetchPosts = async (pageNum: number, isInitial: boolean = false) => {
    try {
      if (isInitial) setIsLoading(true);
      else setIsLoadingMore(true);

      const fetchedPosts = await getPosts({ page: pageNum });
      
      //to simulate the delay for fetching post (loading spinner)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      if (fetchedPosts.length === 0) {
        setHasMore(false);
      } else {
        setPosts(prev => {
          if (isInitial) return fetchedPosts;
          
          // Create a Set of existing post IDs for O(1) lookup
          const existingIds = new Set(prev.map(post => post._id));
          
          // Filter out any duplicates from the new posts
          const uniqueNewPosts = fetchedPosts.filter(post => !existingIds.has(post._id));
          
          return [...prev, ...uniqueNewPosts];
        });
      }
    } catch (err) {
      console.error('Error fetching posts:', err);
      setError('Failed to fetch posts');
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchPosts(1, true);
  }, []);

  useEffect(() => {
    if (page > 1) {
      fetchPosts(page);
    }
  }, [page]);

  const handlePostDeleted = () => {
    setPage(1);
    fetchPosts(1, true);
  };

  if (error) return <div>{error}</div>;
  if (isLoading) return (
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
      {posts.map((post, index) => {
        if (posts.length === index + 1) {
          return (
            <div ref={lastPostElementRef} key={post._id}>
              <FeedPost
                {...post}
                username={post.username || 'dex_xeb'}
                avatar={post.avatar || User1Profile}
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
            avatar={post.avatar || User1Profile}
            onPostDeleted={handlePostDeleted}
          />
        );
      })}
      {isLoadingMore && <LoadingSpinner />}
    </ContainerSm>
  );
};

export default FeedPosts;
