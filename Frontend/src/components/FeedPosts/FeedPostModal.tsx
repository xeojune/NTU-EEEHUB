import React, { useState, useEffect } from 'react';
import ModalCard from '../ModalCard';
import { useUser } from '../../context/UserContext';
import { IoArrowBack, IoArrowForward } from 'react-icons/io5';
import { useCreateCommentMutation, useGetComments, useDistributePointsMutation } from '../../apis/commentsApi';
import {
  Avatar,
  ModalContent,
  ImageSection,
  NavigationButton,
  ImageDots,
  Dot,
  CommentsSection,
  PostHeader,
  UserInfo,
  Username,
  PostInfo,
  CommentsList,
  Comment,
  CommentContent,
  NoComments,
  CommentInputSection,
  CommentInputForm,
  CommentInput,
  PostButton,
  CommentUserInfo,
  CommentUsername,
  CommentDate,
  PointsInput,
  PointsSection,
  RemainingPoints,
  DistributeButton
} from '../../styles/FeedPosts/FeedPostModalStyle';

const formatTimeAgo = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (seconds < 60) {
    return 'just now';
  } else if (minutes < 60) {
    return `${minutes} ${minutes === 1 ? 'min' : 'mins'} ago`;
  } else if (hours < 24) {
    return `${hours} ${hours === 1 ? 'h' : 'hrs'} ago`;
  } else if (days < 30) {
    return `${days} ${days === 1 ? 'd' : 'd'} ago`;
  } else if (months < 12) {
    return `${months} ${months === 1 ? 'm' : 'm'} ago`;
  } else {
    return `${years} ${years === 1 ? 'y' : 'y'} ago`;
  }
};

interface FeedPostModalProps {
  isOpen: boolean;
  onClose: () => void;
  postId: string;
  postImage: string | string[];
  username?: string;
  points: number;
  date: string;
  distributedPoints?: number;
  onPointsDistributed?: (newDistributedPoints: number) => void;
}

const FeedPostModal: React.FC<FeedPostModalProps> = ({
  isOpen,
  onClose,
  postId,
  postImage,
  username = 'User',
  points,
  date,
  distributedPoints = 0,
  onPointsDistributed,
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [avatarUrl, setAvatarUrl] = useState<string>('/default-avatar.png');
  const [commentAvatars, setCommentAvatars] = useState<{[key: string]: string}>({});
  const [commentText, setCommentText] = useState('');
  const [remainingPoints, setRemainingPoints] = useState(points - distributedPoints);
  const [pointsToDistribute, setPointsToDistribute] = useState<{ [key: string]: number }>({});
  const { getUserAvatar, user } = useUser();
  const imageUrls = Array.isArray(postImage) ? postImage : [postImage];

  // Only fetch comments when modal is open and we have a postId
  const { data: comments = [], isLoading: isLoadingComments } = useGetComments(postId);

  const createCommentMutation = useCreateCommentMutation();
  const distributePointsMutation = useDistributePointsMutation();

  // Load avatars for comments only when modal is open and we have comments
  useEffect(() => {
    if (!isOpen) return;

    const loadCommentAvatars = async () => {
      const avatarPromises = comments.map(async (comment) => {
        if (!commentAvatars[comment.username]) {
          try {
            const avatarUrl = await getUserAvatar(comment.username);
            return { username: comment.username, avatarUrl };
          } catch (error) {
            console.error(`Failed to load avatar for ${comment.username}:`, error);
            return { username: comment.username, avatarUrl: '/default-avatar.png' };
          }
        }
        return null;
      });

      const resolvedAvatars = await Promise.all(avatarPromises);
      const newAvatars = resolvedAvatars.reduce((acc, curr) => {
        if (curr) {
          acc[curr.username] = curr.avatarUrl;
        }
        return acc;
      }, {...commentAvatars});

      setCommentAvatars(newAvatars);
    };

    if (comments.length > 0) {
      loadCommentAvatars();
    }
  }, [comments, getUserAvatar, isOpen]);

  // Reset remaining points when modal opens or distributedPoints changes
  useEffect(() => {
    if (isOpen) {
      setRemainingPoints(points - distributedPoints);
      setPointsToDistribute({});
    }
  }, [isOpen, points, distributedPoints]);

  // Update remaining points when distributedPoints changes
  useEffect(() => {
    setRemainingPoints(points - distributedPoints);
  }, [points, distributedPoints]);

  const handlePrevImage = () => {
    setCurrentImageIndex(prev => (prev > 0 ? prev - 1 : prev));
  };

  const handleNextImage = () => {
    setCurrentImageIndex(prev => (prev < imageUrls.length - 1 ? prev + 1 : prev));
  };

  const handleDotClick = (index: number) => {
    setCurrentImageIndex(index);
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if user is logged in
    if (!user) {
      alert('Please log in to comment');
      return;
    }

    // Validate required fields
    if (!commentText.trim()) {
      alert('Please enter a comment');
      return;
    }

    if (!postId) {
      console.error('Post ID is missing');
      return;
    }

    const commentData = {
      text: commentText.trim(),
      postId: postId,
      username: user.name,
      userId: user._id
    };

    console.log('Submitting comment with data:', commentData);

    try {
      await createCommentMutation.mutateAsync(commentData);
      setCommentText('');
    } catch (error) {
      console.error('Failed to post comment:', error);
      alert('Failed to post comment. Please try again.');
    }
  };

  const handlePointsChange = (commentId: string, value: number) => {
    const newValue = Math.max(0, value); // Ensure non-negative
    const currentPoints = pointsToDistribute[commentId] || 0;
    const pointDifference = newValue - currentPoints;
    
    if (remainingPoints - pointDifference >= 0) {
      setPointsToDistribute(prev => ({
        ...prev,
        [commentId]: newValue
      }));
      setRemainingPoints(prev => prev - pointDifference);
    }
  };

  const handleDistributePoints = async (commentId: string) => {
    const pointsToAdd = pointsToDistribute[commentId];
    if (!pointsToAdd || pointsToAdd <= 0) return;

    try {
      await distributePointsMutation.mutateAsync({
        commentId,
        points: pointsToAdd,
        postId,
        postOwnerId: user?._id || ''
      });

      // Reset points for this comment after successful distribution
      setPointsToDistribute(prev => {
        const { [commentId]: _, ...rest } = prev;
        return rest;
      });

      // Update the total distributed points
      if (onPointsDistributed) {
        onPointsDistributed(distributedPoints + pointsToAdd);
      }
    } catch (error) {
      console.error('Failed to distribute points:', error);
      alert('Failed to distribute points. Please try again.');
    }
  };

  // Load post author avatar only when modal is open
  useEffect(() => {
    if (!isOpen) return;
    
    if (username !== 'User') {
      getUserAvatar(username).then(url => setAvatarUrl(url));
    }
  }, [username, getUserAvatar, isOpen]);

  return isOpen ? (
    <ModalCard onClose={onClose} width="95vw" height="90vh" background="#181820" top='0'>
      <ModalContent>
        <ImageSection>
          {imageUrls.length > 1 && currentImageIndex > 0 && (
            <NavigationButton direction="left" onClick={handlePrevImage}>
              <IoArrowBack />
            </NavigationButton>
          )}
          <img src={imageUrls[currentImageIndex]} alt="Post" />
          {imageUrls.length > 1 && currentImageIndex < imageUrls.length - 1 && (
            <NavigationButton direction="right" onClick={handleNextImage}>
              <IoArrowForward />
            </NavigationButton>
          )}
          {imageUrls.length > 1 && (
            <ImageDots>
              {imageUrls.map((_, index) => (
                <Dot
                  key={index}
                  active={index === currentImageIndex}
                  onClick={() => handleDotClick(index)}
                />
              ))}
            </ImageDots>
          )}
        </ImageSection>
        
        <CommentsSection>
          <PostHeader>
            <UserInfo>
              <Avatar src={avatarUrl} alt={username} />
              <div>
                <Username>{username}</Username>
                <PostInfo>
                  {formatTimeAgo(date)} • {points} points
                </PostInfo>
              </div>
            </UserInfo>
            {user?.name === username && (
              <RemainingPoints>
                Points Available for Distribution: {remainingPoints}
              </RemainingPoints>
            )}
          </PostHeader>

          <CommentsList>
            {isLoadingComments ? (
              <NoComments>Loading comments...</NoComments>
            ) : comments.length === 0 ? (
              <NoComments>No comments yet</NoComments>
            ) : (
              comments.map((comment) => (
                <Comment key={comment._id}>
                  <CommentUserInfo>
                    <Avatar src={commentAvatars[comment.username] || '/default-avatar.png'} alt={comment.username} />
                    <div style={{display: 'flex', flexDirection: 'column'}}>
                      <CommentUsername>{comment.username}</CommentUsername>
                      <CommentDate>{formatTimeAgo(comment.createdAt)}</CommentDate>
                    </div>
                  </CommentUserInfo>
                  <CommentContent>{comment.text}</CommentContent>
                  {user?.name === username && comment.username !== username && (
                    <PointsSection>
                      <PointsInput
                        type="number"
                        min="0"
                        max={remainingPoints + (pointsToDistribute[comment._id] || 0)}
                        value={pointsToDistribute[comment._id] || 0}
                        onChange={(e) => handlePointsChange(comment._id, parseInt(e.target.value) || 0)}
                        placeholder="Points"
                      />
                      <DistributeButton
                        onClick={() => handleDistributePoints(comment._id)}
                        disabled={!pointsToDistribute[comment._id] || pointsToDistribute[comment._id] <= 0}
                      >
                        Distribute
                      </DistributeButton>
                    </PointsSection>
                  )}
                </Comment>
              ))
            )}
          </CommentsList>

          {user && (
            <CommentInputSection>
              <CommentInputForm onSubmit={handleSubmitComment}>
                <CommentInput
                  type="text"
                  placeholder="Add a comment..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                />
                <PostButton
                  type="submit"
                  disabled={!commentText.trim() || createCommentMutation.isPending}
                >
                  Post
                </PostButton>
              </CommentInputForm>
            </CommentInputSection>
          )}
        </CommentsSection>
      </ModalContent>
    </ModalCard>
  ) : null;
};

export default FeedPostModal;