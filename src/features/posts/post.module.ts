import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Post, PostSchema } from './domain/posts.entity';
import { PostLike, PostLikeSchema } from '../postLike/postsLike.schema';
import { PostsService } from './application/posts.service';
import { PostsRepository } from './infrastructure/posts.repository';
import { PostsController } from './api/posts.controller';
import { BlogsService } from '../blogs/application/blogs.service';
import { BlogsRepository } from '../blogs/infrastructure/blogs.repository';
import { Blog, BlogSchema } from '../blogs/domain/blogs.entity';
import {
  CommentLike,
  CommentLikeEntity,
} from '../commentLike/domain/commentLike.entity';
import { CommentsQueryRepository } from '../comments/infrastructure/comments.query.repository';
import { Comment, CommentSchema } from '../comments/domain/comments.entity';
import { PostsQueryRepository } from './infrastructure/posts.query.repository';
import { BlogIdIsExistConstraint } from '../../infrastructure/decorators/validate/blogId.isExist.decorator';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Blog.name, schema: BlogSchema },
      { name: Post.name, schema: PostSchema },
      { name: Comment.name, schema: CommentSchema },
      { name: PostLike.name, schema: PostLikeSchema },
      { name: CommentLike.name, schema: CommentLikeEntity },
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
    BlogIdIsExistConstraint,
  ],
})
export class PostModule {}
