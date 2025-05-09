import React, { useRef, useCallback, useState, useEffect } from 'react';
import { ContainerSm, NoPostsContainer, NoPostsTitle, NoPostsText, NoPostsButton } from '../../styles/FeedPosts/FeedPostsStyle';
import SkeletonUI from '../SkeletonUI';
import FeedPost from './FeedPost';
import { FeedPostProps } from '../../types/postType';
import { usePosts, invalidatePostsCache } from '../../apis/getPostsApi';
import { LoadingSpinner, SpinnerWrapper } from '../LoadingSpinner';
import defaultUserProfile from '../../assets/userImg/defaultAvatar.png';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router';

const FeedPosts: React.FC = () => {
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [allPosts, setAllPosts] = useState<FeedPostProps[]>([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [showSkeleton, setShowSkeleton] = useState(true);
  const observer = useRef<IntersectionObserver>();
  const loadingTimeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const skeletonTimeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const queryClient = useQueryClient();

  const { data: posts, error, isLoading } = usePosts({ page, username: '' });

  // Set minimum skeleton display time when component mounts
  useEffect(() => {
    skeletonTimeoutRef.current = setTimeout(() => {
      setShowSkeleton(false);
    }, 1000);

    return () => {
      if (skeletonTimeoutRef.current) {
        clearTimeout(skeletonTimeoutRef.current);
      }
    };
  }, []);

  const lastPostElementRef = useCallback((node: HTMLDivElement) => {
    if (isLoading || !hasMore) return;
    
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setIsLoadingMore(true);
        // Start loading timer when intersection is detected
        if (loadingTimeoutRef.current) {
          clearTimeout(loadingTimeoutRef.current);
        }
        loadingTimeoutRef.current = setTimeout(() => {
          setPage(prevPage => prevPage + 1);
        }, 2000); // Wait for 2 seconds before loading next page
      }
    }, {
      root: null,
      rootMargin: '100px',
      threshold: 0.5
    });
    if (node) observer.current.observe(node);
  }, [isLoading, hasMore]);

  useEffect(() => {
    if (posts) {
      // If we received an empty array or less items than expected, there's no more data
      if (posts.length === 0) {
        setHasMore(false);
        setIsLoadingMore(false);
        return;
      }

      setAllPosts(prev => {
        if (page === 1) return posts;
        
        const existingIds = new Set(prev.map(post => post._id));
        const uniqueNewPosts = posts.filter(post => !existingIds.has(post._id));
        
        // If we didn't get any new unique posts, there's no more data
        if (uniqueNewPosts.length === 0) {
          setHasMore(false);
        }
        
        return [...prev, ...uniqueNewPosts];
      });
      
      // Set another timeout to ensure loading state persists for full 2 seconds
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }
      loadingTimeoutRef.current = setTimeout(() => {
        setIsLoadingMore(false);
      }, 2000);
    }
  }, [posts, page]);

  useEffect(() => {
    return () => {
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }
      if (observer.current) {
        observer.current.disconnect();
      }
      if (skeletonTimeoutRef.current) {
        clearTimeout(skeletonTimeoutRef.current);
      }
    };
  }, []);

  const handlePostDeleted = async () => {
    setPage(1);
    setAllPosts([]);
    setHasMore(true);
    setIsLoadingMore(false);
    setShowSkeleton(true);
    if (loadingTimeoutRef.current) {
      clearTimeout(loadingTimeoutRef.current);
    }
    if (skeletonTimeoutRef.current) {
      clearTimeout(skeletonTimeoutRef.current);
    }
    // Reset skeleton timer
    skeletonTimeoutRef.current = setTimeout(() => {
      setShowSkeleton(false);
    }, 1000);
    // Invalidate and refetch posts
    await invalidatePostsCache(queryClient);
  };

  const navigate = useNavigate();

  if (showSkeleton) {
    return (
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
  }

  if (error) return <div>Error loading posts</div>;

  if (!isLoading && allPosts.length === 0) {
    return (
      <ContainerSm>
        <NoPostsContainer>
          <NoPostsTitle>No Posts Yet</NoPostsTitle>
          <NoPostsText>
            Make connections to see posts from other users in your feed!
          </NoPostsText>
          <NoPostsButton onClick={() => navigate('/friends')}>
            Find People
          </NoPostsButton>
        </NoPostsContainer>
      </ContainerSm>
    );
  }

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
      {isLoadingMore && hasMore && <SpinnerWrapper />}
    </ContainerSm>
  );
};

export default FeedPosts;
