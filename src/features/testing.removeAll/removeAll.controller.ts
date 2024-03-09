import { Controller, Delete, HttpCode } from '@nestjs/common';
import { UsersRepository } from '../users/infrastructure/users.repository';
import { BlogsRepository } from '../blogs/infrastructure/blogs.repository';
import { PostsRepository } from '../posts/infrastructure/posts.repository';
import { DeviceRepository } from '../devices/infrastructure/device.repository';

@Controller('testing/all-data')
export class TestingRemoveAll {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly blogRepository: BlogsRepository,
    private readonly postsRepository: PostsRepository,
    private readonly deviceRepository: DeviceRepository,
  ) {}

  @HttpCode(204)
  @Delete()
  async removeAllData() {
    await this.usersRepository.deleteAll();
    await this.blogRepository.deleteAll();
    await this.postsRepository.deleteAll();
    await this.deviceRepository.deleteAll();
    return;
  }
}
