import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Post, PostSchema } from './posts.schema';
import { PostLike, PostLikeSchema } from '../postLike/postsLike.schema';
import { PostsService } from './posts.service';
import { PostsRepository } from './posts.repository';
import { PostsController } from './posts.controller';
import { BlogsService } from '../blogs/blogs.service';
import { BlogsRepository } from '../blogs/blogs.repository';
import { Blog, BlogSchema } from '../blogs/blogs.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Blog.name, schema: BlogSchema },
      { name: Post.name, schema: PostSchema },
      { name: PostLike.name, schema: PostLikeSchema },
    ]),
  ],
  controllers: [PostsController],
  providers: [BlogsService, BlogsRepository, PostsService, PostsRepository],
})
export class PostModule {}
