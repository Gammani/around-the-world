import { Module } from '@nestjs/common';
import { UsersRepository } from '../users/infrastructure/users.repository';
import { TestingRemoveAll } from './removeAll.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../users/domain/user.entity';
import { BlogsRepository } from '../blogs/blogs.repository';
import { Blog, BlogSchema } from '../blogs/blogs.schema';
import { Post, PostSchema } from '../posts/posts.schema';
import { PostsRepository } from '../posts/posts.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Blog.name, schema: BlogSchema },
      { name: Post.name, schema: PostSchema },
    ]),
  ],
  controllers: [TestingRemoveAll],
  providers: [UsersRepository, BlogsRepository, PostsRepository],
})
export class RemoveAllModule {}
