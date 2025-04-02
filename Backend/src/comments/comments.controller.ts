import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { Comment } from './schemas/comments.schema';

@Controller('api/comments')
export class CommentsController {
  private readonly logger = new Logger(CommentsController.name);

  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  async createComment(
    @Body('text') text: string,
    @Body('postId') postId: string,
    @Body('username') username: string,
    @Body('userId') userId: string,
  ): Promise<Comment> {
    try {
      this.logger.debug(`Creating comment for post: ${postId}`);
      return await this.commentsService.createComment(
        text,
        postId,
        username,
        userId,
      );
    } catch (error) {
      this.logger.error('Error creating comment:', error);
      throw new BadRequestException(error.message);
    }
  }

  @Get('post/:postId')
  async getCommentsByPostId(
    @Param('postId') postId: string,
  ): Promise<Comment[]> {
    try {
      this.logger.debug(`Fetching comments for post: ${postId}`);
      return await this.commentsService.getCommentsByPostId(postId);
    } catch (error) {
      this.logger.error('Error fetching comments:', error);
      throw new BadRequestException(error.message);
    }
  }

  @Delete(':id')
  async deleteComment(
    @Param('id') commentId: string,
    @Body('userId') userId: string,
  ): Promise<{ message: string }> {
    try {
      this.logger.debug(`Deleting comment: ${commentId}`);
      await this.commentsService.deleteComment(commentId, userId);
      return { message: 'Comment deleted successfully' };
    } catch (error) {
      this.logger.error('Error deleting comment:', error);
      throw new BadRequestException(error.message);
    }
  }

  @Put(':id/points')
  async distributePoints(
    @Param('id') commentId: string,
    @Body('points') points: number,
    @Body('postId') postId: string,
    @Body('postOwnerId') postOwnerId: string,
  ): Promise<Comment> {
    try {
      this.logger.debug(`Distributing ${points} points to comment: ${commentId}`);
      return await this.commentsService.distributePoints(
        commentId,
        points,
        postId,
        postOwnerId,
      );
    } catch (error) {
      this.logger.error('Error distributing points:', error);
      throw new BadRequestException(error.message);
    }
  }

  @Put(':id')
  async updateComment(
    @Param('id') commentId: string,
    @Body('userId') userId: string,
    @Body('text') text: string,
  ): Promise<Comment> {
    try {
      this.logger.debug(`Updating comment: ${commentId}`);
      return await this.commentsService.updateComment(
        commentId,
        userId,
        text,
      );
    } catch (error) {
      this.logger.error('Error updating comment:', error);
      throw new BadRequestException(error.message);
    }
  }
}