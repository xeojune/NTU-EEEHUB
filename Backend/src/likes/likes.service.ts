import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Like, LikeDocument } from './schemas/likes.schema';
import { Post, PostDocument } from '../post/schemas/post.schema';

@Injectable()
export class LikesService {
  constructor(
    @InjectModel(Like.name) private likeModel: Model<LikeDocument>,
    @InjectModel(Post.name) private postModel: Model<PostDocument>,
  ) {}

  async toggleLike(userId: string, postId: string): Promise<{ isLiked: boolean }> {
    // Find existing like record or create a new one
    let likeRecord = await this.likeModel.findOne({ userId, postId });
    
    if (!likeRecord) {
      // Create new like record if it doesn't exist
      likeRecord = await this.likeModel.create({
        userId,
        postId,
        isLiked: true,
      });

      //transactional component ****
      
      // Increment total likes on the post
      await this.postModel.findByIdAndUpdate(
        postId,
        { $inc: { totalLikes: 1 } },
        { new: true },
      );
      
      return { isLiked: true };
    }

    // Toggle existing like record
    const newLikeStatus = !likeRecord.isLiked;
    await likeRecord.updateOne({ isLiked: newLikeStatus });

    // Update total likes on the post
    await this.postModel.findByIdAndUpdate(
      postId,
      { $inc: { totalLikes: newLikeStatus ? 1 : -1 } },
      { new: true },
    );

    return { isLiked: newLikeStatus };
  }

  async getLikeStatus(userId: string, postId: string): Promise<{ isLiked: boolean }> {
    const likeRecord = await this.likeModel.findOne({ userId, postId });
    return { isLiked: likeRecord?.isLiked || false };
  }

  async getPostLikes(postId: string): Promise<number> {
    const post = await this.postModel.findById(postId);
    return post?.totalLikes || 0;
  }
}