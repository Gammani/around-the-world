import { Injectable } from '@nestjs/common';
import { User, UserDocument } from './users.schema';
import { Model } from 'mongoose';
import { CreatedUserModel } from '../feature/model type/UserViewModel';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectModel(User.name) private readonly UserModel: Model<UserDocument>,
  ) {}

  async createUser(createdUserDto: any): Promise<CreatedUserModel> {
    const createdUser = new this.UserModel(createdUserDto);
    const newUser = await createdUser.save();
    return {
      id: newUser._id.toString(),
      login: newUser.accountData.login,
      email: newUser.accountData.email,
      createdAt: newUser.accountData.createdAt,
    };
  }
}
