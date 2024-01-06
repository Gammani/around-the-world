import { Injectable } from '@nestjs/common';
import {
  CreatedUserModel,
  CreateUserInputModelType,
} from '../feature/model type/UserViewModel';
import { UsersRepository } from './users.repository';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument, UserModelStaticType } from './users.schema';
import { Model } from 'mongoose';
import { PasswordAdapter } from '../adapter/password.adapter';

@Injectable()
export class UsersService {
  constructor(
    protected passwordAdapter: PasswordAdapter,
    protected usersRepository: UsersRepository,
    @InjectModel(User.name)
    private UserModel: Model<UserDocument> & UserModelStaticType,
  ) {}

  async createUserByAdmin(
    inputUserModel: CreateUserInputModelType,
  ): Promise<CreatedUserModel> {
    const passwordHash = await this.passwordAdapter.createPasswordHash(
      inputUserModel.password,
    );
    const createdUser = this.UserModel.createUser(
      inputUserModel,
      passwordHash,
      this.UserModel,
    );
    return await this.usersRepository.createUser(createdUser);
  }
  async findUserById(userId: string) {
    return this.usersRepository.findUserById(userId);
  }
  async removeUserByAdmin(userId: string): Promise<boolean> {
    return await this.usersRepository.deleteUser(userId);
  }
}
