import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import {
  CreateUserInputModelType,
  UserWithPaginationViewModel,
} from '../feature/model type/UserViewModel';
import { UsersQueryRepository } from './users.query.repository';
import { UsersService } from './users.service';

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
      pageNumberQuery: string | undefined;
      pageSizeQuery: string | undefined;
      sortByQuery: string | undefined;
      sortDirectionQuery: string | undefined;
    },
  ) {
    const foundUsers: UserWithPaginationViewModel =
      await this.usersQueryRepository.findAllUsers(
        query.searchLoginTerm,
        query.searchEmailTerm,
        query.pageNumberQuery,
        query.pageSizeQuery,
        query.sortByQuery,
        query.sortDirectionQuery,
      );
    return foundUsers;
  }

  @Get(':id')
  async findUserById(@Param('id') userId: string) {
    return this.usersService.findUserById(userId);
  }

  @Post()
  async createUserByAdmin(@Body() inputUserModel: CreateUserInputModelType) {
    return this.usersService.createUserByAdmin(inputUserModel);
  }

  @Delete(':id')
  async removeUserByAdmin(@Param('id') userId: string) {
    const userRemoved = await this.usersService.removeUserByAdmin(userId);
    if (!userRemoved) {
      throw new NotFoundException();
    }
  }
}
