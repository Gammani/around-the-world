import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './users.schema';
import { Model } from 'mongoose';
import {
  UserViewModel,
  UserWithPaginationViewModel,
} from '../feature/model type/UserViewModel';

@Injectable()
export class UsersQueryRepository {
  constructor(@InjectModel(User.name) private UserModel: Model<UserDocument>) {}

  async findAllUsers(
    searchLoginTermQuery: string | undefined,
    searchEmailTermQuery: string | undefined,
    pageNumberQuery: string | undefined,
    pageSizeQuery: string | undefined,
    sortByQuery: string | undefined,
    sortDirectionQuery: string | undefined,
  ): Promise<UserWithPaginationViewModel> {
    const searchLoginTerm = searchLoginTermQuery ? searchLoginTermQuery : '';
    const searchEmailTerm = searchEmailTermQuery ? searchEmailTermQuery : '';
    const pageNumber = isNaN(Number(pageNumberQuery))
      ? 1
      : Number(pageNumberQuery);
    const pageSize = isNaN(Number(pageSizeQuery)) ? 10 : Number(pageSizeQuery);
    const sortBy = sortByQuery ? sortByQuery : 'createdAt';
    const sortDirection = sortDirectionQuery === 'asc' ? 1 : -1;

    let totalCount;
    let users;

    if (searchLoginTerm || searchEmailTerm) {
      totalCount = await this.UserModel.countDocuments({
        $and: [
          { 'accountData.login': { $regex: searchLoginTerm, $options: 'i' } },
          { 'accountData.email': { $regex: searchEmailTerm, $options: 'i' } },
        ],
      });
      users = await this.UserModel.find({
        $and: [
          { 'accountData.login': { $regex: searchLoginTerm, $options: 'i' } },
          { 'accountData.email': { $regex: searchEmailTerm, $options: 'i' } },
        ],
      })
        .sort({ [sortBy]: sortDirection })
        .skip((pageNumber - 1) * pageSize)
        .limit(pageSize)
        .exec();
    } else {
      totalCount = await this.UserModel.countDocuments({});
      users = await this.UserModel.find({})
        .sort({ [sortBy]: sortDirection })
        .skip((pageNumber - 1) * pageSize)
        .limit(pageSize)
        .exec();
    }

    const pagesCount = Math.ceil(totalCount / pageSize);

    const userViewModels: UserViewModel[] = users.map((user) => ({
      id: user._id.toString(),
      login: user.accountData.login,
      email: user.accountData.email,
      createdAt: user.accountData.createdAt, // преобразование даты в строку
    }));

    return {
      pagesCount,
      page: pageNumber,
      pageSize,
      totalCount,
      items: userViewModels,
    };
  }
}
