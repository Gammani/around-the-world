import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Blog, BlogSchema } from './domain/blogs.entity';
import { BlogsController } from './api/blogs.controller';
import { BlogsQueryRepository } from './infrastructure/blogs.query.repository';
import { BlogsService } from './application/blogs.service';
import { BlogsRepository } from './infrastructure/blogs.repository';
import { PostsQueryRepository } from '../posts/infrastructure/posts.query.repository';
import { Post, PostSchema } from '../posts/domain/posts.entity';
import { PostLike, PostLikeSchema } from '../postLike/postsLike.schema';
import { PostsService } from '../posts/application/posts.service';
import { PostsRepository } from '../posts/infrastructure/posts.repository';

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
