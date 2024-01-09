import { Injectable } from '@nestjs/common';
import { User, UserDocument } from './users.schema';
import { Model } from 'mongoose';
import { CreatedUserViewModel } from '../feature/model type/UserViewModel';
import { InjectModel } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';

@Injectable()
export class UsersRepository {
  constructor(@InjectModel(User.name) private UserModel: Model<UserDocument>) {}

  async findUserById(userId: string) {
    if (!ObjectId.isValid(userId)) {
      return false;
      // throw new Error('Invalid userId format');
    }
    return this.UserModel.findById(userId);
  }
  async createUserByAdmin(createdUserDto: any): Promise<CreatedUserViewModel> {
    const newUser = await createdUserDto.save();
    return {
      id: newUser._id.toString(),
      login: newUser.accountData.login,
      email: newUser.accountData.email,
      createdAt: newUser.accountData.createdAt,
    };
  }
  async deleteUser(userId: string): Promise<boolean> {
    if (!ObjectId.isValid(userId)) {
      return false;
      // throw new Error('Invalid userId format');
    }
    const result = await this.UserModel.deleteOne({ _id: userId });
    return result.deletedCount === 1;
  }
  async deleteAll() {
    await this.UserModel.deleteMany({});
    return;
  }
}
