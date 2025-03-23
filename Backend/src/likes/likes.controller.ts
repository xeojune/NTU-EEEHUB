import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  Logger,
  BadRequestException,
} from '@nestjs/common';
import { LikesService } from './likes.service';

@Controller('api/likes')
export class LikesController {
  private readonly logger = new Logger(LikesController.name);

  constructor(private readonly likesService: LikesService) {}

  @Post()
  async toggleLike(
    @Body('userId') userId: string,
    @Body('postId') postId: string,
  ) {
    try {
      this.logger.debug(`Toggling like for post: ${postId} by user: ${userId}`);
      return await this.likesService.toggleLike(userId, postId);
    } catch (error) {
      this.logger.error(`Error toggling like: ${error.message}`);
      throw new BadRequestException('Failed to toggle like');
    }
  }

  @Get(':postId/status/:userId')
  async getLikeStatus(
    @Param('postId') postId: string,
    @Param('userId') userId: string,
  ) {
    try {
      this.logger.debug(`Getting like status for post: ${postId} and user: ${userId}`);
      return await this.likesService.getLikeStatus(userId, postId);
    } catch (error) {
      this.logger.error(`Error getting like status: ${error.message}`);
      throw new BadRequestException('Failed to get like status');
    }
  }

  @Get(':postId/count')
  async getPostLikes(@Param('postId') postId: string) {
    try {
      this.logger.debug(`Getting like count for post: ${postId}`);
      return await this.likesService.getPostLikes(postId);
    } catch (error) {
      this.logger.error(`Error getting like count: ${error.message}`);
      throw new BadRequestException('Failed to get like count');
    }
  }
}