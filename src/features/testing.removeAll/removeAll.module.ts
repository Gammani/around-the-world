import { Module } from '@nestjs/common';
import { UsersRepository } from '../users/infrastructure/users.repository';
import { TestingRemoveAll } from './removeAll.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../users/domain/user.entity';
import { BlogsRepository } from '../blogs/infrastructure/blogs.repository';
import { Blog, BlogSchema } from '../blogs/domain/blogs.entity';
import { Post, PostSchema } from '../posts/domain/posts.entity';
import { PostsRepository } from '../posts/infrastructure/posts.repository';
import { Device, DeviceSchema } from '../devices/domain/devices.entity';
import { DeviceRepository } from '../devices/infrastructure/device.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Blog.name, schema: BlogSchema },
      { name: Post.name, schema: PostSchema },
      { name: Device.name, schema: DeviceSchema },
    ]),
  ],
  controllers: [TestingRemoveAll],
  providers: [
    UsersRepository,
    BlogsRepository,
    PostsRepository,
    DeviceRepository,
  ],
})
export class RemoveAllModule {}
