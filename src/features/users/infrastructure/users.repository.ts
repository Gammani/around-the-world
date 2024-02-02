import { Injectable, NotFoundException } from '@nestjs/common';
import { User, UserDocument } from '../domain/user.entity';
import { Model } from 'mongoose';
import { CreatedUserViewModel } from '../api/models/output/user.output.model';
import { InjectModel } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';

@Injectable()
export class UsersRepository {
  constructor(@InjectModel(User.name) private UserModel: Model<UserDocument>) {}

  async findUserById(userId: string): Promise<UserDocument | null> {
    if (!ObjectId.isValid(userId)) {
      throw new NotFoundException();
    }
    return this.UserModel.findById(userId);
  }
  async findUserByLogin(login: string): Promise<UserDocument | null> {
    const foundUser = await this.UserModel.findOne({
      'accountData.login': login,
    });
    if (foundUser) {
      return foundUser;
    } else {
      return null;
    }
  }
  async findUserByEmail(email: string): Promise<UserDocument | null> {
    const foundUser = await this.UserModel.findOne({
      'accountData.email': email,
    });
    if (foundUser) {
      return foundUser;
    } else {
      return null;
    }
  }
  async createUser(createdUserDto: any): Promise<CreatedUserViewModel> {
    const newUser = await createdUserDto.save();
    return {
      id: newUser._id.toString(),
      login: newUser.accountData.login,
      email: newUser.accountData.email,
      createdAt: newUser.accountData.createdAt,
    };
  }
  async loginIsExist(login: string): Promise<boolean> {
    const foundUser = await this.UserModel.findOne({
      'accountData.login': login,
    });
    return !foundUser;
  }
  async emailIsExist(email: string): Promise<boolean> {
    const foundUser = await this.UserModel.findOne({
      'accountData.email': email,
    });
    return !foundUser;
  }
  async deleteUser(userId: string): Promise<boolean> {
    if (!ObjectId.isValid(userId)) {
      throw new NotFoundException();
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
