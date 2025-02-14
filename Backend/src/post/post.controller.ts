import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseInterceptors,
  UploadedFiles,
  NotFoundException,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { PostService } from './post.service';
import { Post as Posts } from './schemas/post.schema';

interface PostResponse extends Posts {
  imageUrls: string[];
}

@Controller('/api/posts')
export class PostController {
  constructor(private readonly postService: PostService) {}
  
  // POST: Create a new post with memory storage for images
  @Post()
  @UseInterceptors(
    FilesInterceptor('images', 10, {
      storage: memoryStorage(),
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/^image\/(jpg|jpeg|png)$/)) {
          return cb(new Error('Only jpg, jpeg, and png files are allowed!'), false);
        }
        cb(null, true);
      },
      limits: {
        fileSize: 20 * 1024 * 1024, // 20MB per file
      },
    }),
  )
  async createPost(
    @Body('caption') caption: string,
    @Body('points') points: string,
    @Body('username') username: string,
    @Body('userId') userId: string,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    try {
      if (!files || files.length === 0) {
        throw new Error('No files uploaded');
      }
      if (!username) {
        throw new Error('Username is required');
      }
      if (!userId) {
        throw new Error('User ID is required');
      }

      // Convert points to number
      const pointsNumber = parseInt(points, 10);
      if (isNaN(pointsNumber)) {
        throw new Error('Points must be a valid number');
      }

      const result = await this.postService.createPost(
        caption,
        files,
        pointsNumber,
        userId,
        username
      );
      return result;
    } catch (error) {
      console.error('Error creating post:', error);
      throw new InternalServerErrorException(error.message);
    }
  }

  // Query parameter enables fetching next set of posts from DB and S3
  @Get()
  async getPosts(
    @Query('page') page: string = '1',
    @Query('username') username?: string
  ): Promise<PostResponse[]> {
    try {
      const pageNumber = parseInt(page, 10);
      return await this.postService.getPost(pageNumber, 50, username);
    } catch (error) {
      console.error('Error fetching posts:', error);
      throw error;
    }
  }

  @Delete(':id')
  async deletePost(
    @Param('id') id: string,
    @Body('username') username: string
  ): Promise<{ message: string }> {
    try {
      await this.postService.deletePost(id, username);
      return { message: 'Post deleted successfully' };
    } catch (error) {
      console.error('Error deleting post:', error);
      if (error.message === 'Post not found') {
        throw new NotFoundException('Post not found');
      }
      if (error.message === 'Unauthorized') {
        throw new UnauthorizedException('You can only delete your own posts');
      }
      throw new InternalServerErrorException('Failed to delete post');
    }
  }
}