import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Comment, CommentDocument } from './schemas/comments.schema';
import { Post, PostDocument } from '../post/schemas/post.schema';
import { UserService } from '../user/user.service';

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
    @InjectModel(Post.name) private postModel: Model<PostDocument>,
    private readonly userService: UserService,
  ) {}

  async createComment(
    text: string,
    postId: string,
    username: string,
    userId: string,
  ): Promise<Comment> {
    // Create new comment
    const newComment = new this.commentModel({
      text,
      postId,
      username,
      userId,
      points: 0,
    });

    // Save comment
    const savedComment = await newComment.save();

    // Update post's comment count
    await this.postModel.findByIdAndUpdate(
      postId,
      { $inc: { totalComments: 1 } },
      { new: true },
    );

    return savedComment;
  }

  async getCommentsByPostId(postId: string): Promise<Comment[]> {
    return this.commentModel
      .find({ postId })
      .sort({ createdAt: -1 })
      .exec();
  }

  async deleteComment(
    commentId: string,
    userId: string,
  ): Promise<void> {
    const comment = await this.commentModel.findById(commentId);
    
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    if (comment.userId.toString() !== userId) {
      throw new BadRequestException('Not authorized to delete this comment');
    }

    // If comment has points, refund them to the post
    if (comment.points > 0) {
      const post = await this.postModel.findById(comment.postId);
      if (post) {
        post.points += comment.points;
        await post.save();
      }
    }

    await comment.deleteOne();

    // Update post's comment count
    await this.postModel.findByIdAndUpdate(
      comment.postId,
      { $inc: { totalComments: -1 } },
      { new: true },
    );
  }

  async distributePoints(
    commentId: string,
    points: number,
    postId: string,
    postOwnerId: string,
  ): Promise<Comment> {
    if (!points || points <= 0) {
      throw new BadRequestException('Points must be greater than 0');
    }

    // Get post and comment
    const post = await this.postModel.findById(postId);
    const comment = await this.commentModel.findById(commentId);

    if (!post || !comment) {
      throw new NotFoundException('Post or comment not found');
    }

    // Ensure remainingPoints is a number
    const currentRemainingPoints = Number(post.remainingPoints) || 0;
    const pointsToDistribute = Number(points);

    // Check if post has enough remaining points to distribute
    if (currentRemainingPoints < pointsToDistribute) {
      throw new BadRequestException('Post does not have enough remaining points to distribute');
    }

    // Update post's remaining points using atomic operation
    const updatedPost = await this.postModel.findByIdAndUpdate(
      postId,
      { 
        $inc: { 
          remainingPoints: -pointsToDistribute,
          distributedPoints: pointsToDistribute
        } 
      },
      { new: true }
    );

    if (!updatedPost) {
      throw new NotFoundException('Failed to update post points');
    }

    // Update comment points using atomic operation
    const updatedComment = await this.commentModel.findByIdAndUpdate(
      commentId,
      { $inc: { points: pointsToDistribute } },
      { new: true }
    );

    if (!updatedComment) {
      // If comment update fails, revert the post points
      await this.postModel.findByIdAndUpdate(
        postId,
        { 
          $inc: { 
            remainingPoints: pointsToDistribute,
            distributedPoints: -pointsToDistribute
          } 
        }
      );
      throw new Error('Failed to update comment points');
    }

    // Add points to comment author
    await this.userService.addPoints(comment.userId.toString(), pointsToDistribute);

    return updatedComment;
  }

  async updateComment(
    commentId: string,
    userId: string,
    text: string,
  ): Promise<Comment> {
    const comment = await this.commentModel.findById(commentId);
    
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    if (comment.userId.toString() !== userId) {
      throw new BadRequestException('Not authorized to update this comment');
    }

    comment.text = text;
    comment.updatedAt = new Date();
    
    return comment.save();
  }
}