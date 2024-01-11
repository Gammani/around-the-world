import { Injectable } from '@nestjs/common';
import {
  CreatedUserViewModel,
  CreateInputUserModelType,
} from '../feature/model type/UserViewModel';
import { UsersRepository } from './users.repository';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument, UserModelStaticType } from './users.schema';
import { Model } from 'mongoose';
import { PasswordAdapter } from '../adapter/password.adapter';
import { PostDocument } from '../posts/posts.schema';

@Injectable()
export class UsersService {
  constructor(
    protected passwordAdapter: PasswordAdapter,
    protected usersRepository: UsersRepository,
    @InjectModel(User.name)
    private UserModel: Model<UserDocument> & UserModelStaticType,
  ) {}

  async createUserByAdmin(
    inputUserModel: CreateInputUserModelType,
  ): Promise<CreatedUserViewModel> {
    const passwordHash = await this.passwordAdapter.createPasswordHash(
      inputUserModel.password,
    );
    const createdUser = this.UserModel.createUser(
      inputUserModel,
      passwordHash,
      this.UserModel,
    );
    return await this.usersRepository.createUserByAdmin(createdUser);
  }
  async findUserById(userId: string): Promise<PostDocument | null> {
    return this.usersRepository.findUserById(userId);
  }
  async removeUserByAdmin(userId: string): Promise<boolean> {
    return await this.usersRepository.deleteUser(userId);
  }
}
