import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Blog, BlogSchema } from './blogs.schema';
import { BlogsController } from './blogs.controller';
import { BlogsQueryRepository } from './blogs.query.repository';
import { BlogsService } from './blogs.service';
import { BlogsRepository } from './blogs.repository';
import { PostsQueryRepository } from '../posts/posts.query.repository';
import { Post, PostSchema } from '../posts/posts.schema';
import { PostLike, PostLikeSchema } from '../postLike/postsLike.schema';
import { PostsService } from '../posts/posts.service';
import { PostsRepository } from '../posts/posts.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Blog.name, schema: BlogSchema },
      { name: Post.name, schema: PostSchema },
      { name: PostLike.name, schema: PostLikeSchema },
    ]),
  ],
  controllers: [BlogsController],
  providers: [
    BlogsService,
    BlogsRepository,
    BlogsQueryRepository,
    PostsService,
    PostsRepository,
    PostsQueryRepository,
  ],
})
export class BlogModule {}
