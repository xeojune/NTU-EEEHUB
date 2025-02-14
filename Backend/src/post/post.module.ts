import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Post, PostSchema } from './schemas/post.schema';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { 
        name: Post.name, 
        schema: PostSchema 
      }
    ]),
    UserModule, 
  ],
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {}
