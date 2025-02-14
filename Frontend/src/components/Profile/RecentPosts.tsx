import React from 'react';
import {
    PostWrapper,
    PostGrid,
    PostOverlay,
} from '../../styles/Profile/ProfileStyle';
import { AiOutlineHeart, AiOutlineComment } from 'react-icons/ai';

interface Post {
    id: string;
    image: string;
    likes: number;
    comments: number;
}

interface RecentPostsProps {
    posts: Post[];
    onPostDeleted?: (postId: string) => void;
}

const RecentPosts: React.FC<RecentPostsProps> = ({ posts, onPostDeleted }) => {
    const handlePostClick = (postId: string) => {
        // TODO: Implement post click handler to show full post details
        console.log('Post clicked:', postId);
    };

    const handleDelete = async (postId: string, event: React.MouseEvent) => {
        event.stopPropagation();
        try {
            const currentUsername = localStorage.getItem('username');
            const response = await fetch(`http://localhost:3000/api/posts/${postId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username: currentUsername }),
            });

            if (response.ok) {
                onPostDeleted?.(postId);
            } else {
                const data = await response.json();
                alert(data.message || 'Failed to delete post');
            }
        } catch (error) {
            console.error('Error deleting post:', error);
            alert('Error deleting post');
        }
    };

    if (posts.length === 0) {
        return (
            <PostWrapper>
                <h2>Recent Posts</h2>
                <p style={{ textAlign: 'center', color: '#666' }}>No posts yet</p>
            </PostWrapper>
        );
    }

    return (
        <PostWrapper>
            <h2>Recent Posts</h2>
            <PostGrid>
                {posts.map(post => (
                    <div 
                        key={post.id} 
                        className="post"
                        onClick={() => handlePostClick(post.id)}
                    >
                        <img src={post.image} alt={`Post ${post.id}`} />
                        <PostOverlay>
                            
                            <div className="stats">
                                <div className="stat-item">
                                    <AiOutlineHeart size={20} />
                                    <span>{post.likes}</span>
                                </div>
                                <div className="stat-item">
                                    <AiOutlineComment size={20} />
                                    <span>{post.comments}</span>
                                </div>
                            </div>
                        </PostOverlay>
                    </div>
                ))}
            </PostGrid>
        </PostWrapper>
    );
};

export default RecentPosts;