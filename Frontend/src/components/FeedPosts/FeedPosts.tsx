import React, { useEffect, useState } from 'react';
import { ContainerSm } from '../../styles/FeedPosts/FeedPostsStyle';
import SkeletonUI from '../SkeletonUI';
import FeedPost from './FeedPost';
import { FeedPostProps } from '../../types/userType';
import { getPosts } from '../../apis/getPostsApi';
import User1Profile from '../../assets/userImg/User1.png';

const FeedPosts: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [posts, setPosts] = useState<FeedPostProps[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const fetchedPosts = await getPosts();
        // Add 2-second delay before showing posts
        setTimeout(() => {
          setPosts(fetchedPosts);
          setIsLoading(false);
        }, 2000);
      } catch (err) {
        console.error('Error fetching posts:', err);
        setError('Failed to fetch posts');
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handlePostDeleted = () => {
    // Refetch posts after deletion
    setIsLoading(true);
    const fetchPosts = async () => {
      try {
        const fetchedPosts = await getPosts();
        setPosts(fetchedPosts);
      } catch (err) {
        console.error('Error fetching posts:', err);
        setError('Failed to fetch posts');
      } finally {
        setIsLoading(false);
      }
    };
    fetchPosts();
  };

  return (
    <ContainerSm>
      {/* Skeleton UI */}
      {isLoading &&
        [0, 1, 2, 3].map((_, idx) => (
          <div key={idx} style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <SkeletonUI width="50px" height="50px" borderRadius="50%" />
              <SkeletonUI isText rows={2} width="300px" height="10px" />
            </div>
            <SkeletonUI width="100%" height="500px" marginTop="10px" borderRadius="8px" />
          </div>
        ))}

      {/* Render FeedPosts when loading is complete */}
      {!isLoading && (
        <>
          {posts.map((post) => (
            <FeedPost
              key={post._id}
              {...post}
              username={post.username || 'dex_xeb'}
              avatar={post.avatar || User1Profile}
              onPostDeleted={handlePostDeleted}
            />
          ))}
        </>
      )}
    </ContainerSm>
  );
};

export default FeedPosts;
