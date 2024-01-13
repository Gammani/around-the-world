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
import {
  CommentLike,
  CommentLikeSchema,
} from '../commentLike/commentLike.schema';
import { CommentsQueryRepository } from '../comments/comments.query.repository';
import { Comment, CommentSchema } from '../comments/comments.schema';
import { PostsQueryRepository } from './posts.query.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Blog.name, schema: BlogSchema },
      { name: Post.name, schema: PostSchema },
      { name: Comment.name, schema: CommentSchema },
      { name: PostLike.name, schema: PostLikeSchema },
      { name: CommentLike.name, schema: CommentLikeSchema },
    ]),
  ],
  controllers: [PostsController],
  providers: [
    BlogsService,
    BlogsRepository,
    PostsService,
    PostsRepository,
    PostsQueryRepository,
    CommentsQueryRepository,
  ],
})
export class PostModule {}
