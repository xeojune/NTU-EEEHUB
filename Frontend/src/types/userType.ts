export interface FeedPostProps {
  _id: string;
  imageUrls: string[];
  caption: string;
  username?: string;
  avatar?: string;
  centerX?: number;
  centerY?: number;
  points: number;
  totalLikes: number;
  totalComments: number;
  createdAt: string;
  onPostDeleted?: (id: string) => void;
}