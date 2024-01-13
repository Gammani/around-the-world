import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { UserWithPaginationViewModel } from '../../../feature/model type/UserViewModel';
import { UsersQueryRepository } from '../infrastructure/users.query.repository';
import { UsersService } from '../application/users.service';
import { UserCreateModel } from './models/input/create-user.input.model';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly usersQueryRepository: UsersQueryRepository,
  ) {}

  @Get()
  async getAllUsers(
    @Query()
    query: {
      searchLoginTerm: string | undefined;
      searchEmailTerm: string | undefined;
      pageNumber: string | undefined;
      pageSize: string | undefined;
      sortBy: string | undefined;
      sortDirection: string | undefined;
    },
  ) {
    const foundUsers: UserWithPaginationViewModel =
      await this.usersQueryRepository.findAllUsers(
        query.searchLoginTerm,
        query.searchEmailTerm,
        query.pageNumber,
        query.pageSize,
        query.sortBy,
        query.sortDirection,
      );
    return foundUsers;
  }

  @Get(':id')
  async findUserById(@Param('id') userId: string) {
    const foundUser = await this.usersService.findUserById(userId);
    if (foundUser) {
      return await this.usersService.findUserById(userId);
    } else {
      throw new NotFoundException();
    }
  }

  @Post()
  async createUserByAdmin(@Body() inputUserModel: UserCreateModel) {
    return this.usersService.createUserByAdmin(inputUserModel);
  }

  @Delete(':id')
  @HttpCode(204)
  async removeUserByAdmin(@Param('id') userId: string) {
    const userRemoved = await this.usersService.removeUserByAdmin(userId);
    if (!userRemoved) {
      throw new NotFoundException();
    }
  }
}
