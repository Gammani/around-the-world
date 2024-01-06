import { Controller, Delete, HttpCode } from '@nestjs/common';
import { UsersRepository } from '../users/users.repository';

@Controller('testing/all-data')
export class TestingRemoveAll {
  constructor(private readonly usersRepository: UsersRepository) {}

  @HttpCode(204)
  @Delete()
  async removeAllData() {
    await this.usersRepository.deleteAll();
    return;
  }
}
