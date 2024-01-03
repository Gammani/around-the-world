import { Injectable } from '@nestjs/common';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import {
  CreatedUserModel,
  CreateUserInputModelType,
} from '../feature/model type/UserViewModel';
import { add } from 'date-fns/add';
import { ObjectId } from 'mongodb';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(protected usersRepository: UsersRepository) {}

  async createUserByAdmin(
    inputUserModel: CreateUserInputModelType,
  ): Promise<CreatedUserModel> {
    const passwordSalt = await bcrypt.genSalt(10);
    const passwordHash = await this._generateHash(
      inputUserModel.password,
      passwordSalt,
    );

    const newUser = {
      _id: new ObjectId(),
      accountData: {
        login: inputUserModel.login,
        email: inputUserModel.email,
        createdAt: new Date().toISOString(),
        passwordHash,
        recoveryCode: uuidv4(),
      },
      emailConfirmation: {
        confirmationCode: uuidv4(),
        expirationDate: add(new Date(), {
          hours: 1,
          minutes: 3,
        }),
        isConfirmed: true,
      },
    };
    return await this.usersRepository.createUser(newUser);
  }
  async _generateHash(password: string, salt: string) {
    const hash = await bcrypt.hash(password, salt);
    // console.log('hash: ' + hash)
    return hash;
  }
}
