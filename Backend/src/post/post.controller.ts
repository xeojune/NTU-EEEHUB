import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    UseInterceptors,
    UploadedFile,
    NotFoundException,
    InternalServerErrorException,
  } from '@nestjs/common';
  import { FileInterceptor } from '@nestjs/platform-express';
  import { memoryStorage } from 'multer';
  import { PostService } from './post.service';
  import { Post as Posts } from './schemas/post.schema';

  interface PostResponse extends Posts {
    imageUrl: string;
  }

  @Controller('/api/posts')
  export class PostController {
    constructor(private readonly postService: PostService) {}
  
    // POST: Create a new post with memory storage for image
    @Post()
    @UseInterceptors(
      FileInterceptor('image', {
        storage: memoryStorage(), // Use Multer memory storage
      }),
    )
    async createPost(
      @UploadedFile() file: Express.Multer.File,
      @Body() body: { caption: string, points: string },
    ) {
      console.log('Request Body:', body); // Log the request body (e.g., caption)
      console.log('File:', file); // Log the uploaded file
  
      const result = await this.postService.createPost(body.caption, file, body.points);
      return result;
    }

    @Get()
    async getPosts(): Promise<PostResponse[]> {
      try {
        return await this.postService.getPost();
      } catch (error) {
        console.error('Error fetching posts:', error);
        throw error;
      }
    }

    @Delete(':id')
    async deletePost(@Param('id') id: string): Promise<{ message: string }> {
      try {
        await this.postService.deletePost(id);
        return { message: 'Post deleted successfully' };
      } catch (error) {
        console.error('Error deleting post:', error);
        if (error.message === 'Post not found') {
          throw new NotFoundException('Post not found');
        }
        throw new InternalServerErrorException('Failed to delete post');
      }
    }
  }