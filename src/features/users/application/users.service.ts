import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { CreatedUserViewModel } from '../api/models/output/user.output.model';
import { UsersRepository } from '../infrastructure/users.repository';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument, UserModelStaticType } from '../domain/user.entity';
import { Model } from 'mongoose';
import { PasswordAdapter } from '../../adapter/password.adapter';
import { UserCreateModel } from '../api/models/input/create-user.input.model';
import { v4 as uuidv4 } from 'uuid';
import { EmailManager } from '../../adapter/email.manager';

@Injectable()
export class UsersService {
  constructor(
    protected passwordAdapter: PasswordAdapter,
    protected usersRepository: UsersRepository,
    protected emailManager: EmailManager,
    @InjectModel(User.name)
    private UserModel: Model<UserDocument> & UserModelStaticType,
  ) {}

  async createUserByAdmin(
    inputUserModel: UserCreateModel,
  ): Promise<CreatedUserViewModel> {
    const passwordHash = await this.passwordAdapter.createPasswordHash(
      inputUserModel.password,
    );
    const createdUser = this.UserModel.createUser(
      inputUserModel,
      passwordHash,
      this.UserModel,
      true,
    );
    return await this.usersRepository.createUser(createdUser);
  }
  async createUser(
    inputUserModel: UserCreateModel,
  ): Promise<CreatedUserViewModel | null> {
    const passwordHash = await this.passwordAdapter.createPasswordHash(
      inputUserModel.password,
    );
    const confirmationCode = uuidv4();
    const createUser = this.UserModel.createUser(
      inputUserModel,
      passwordHash,
      this.UserModel,
      false,
      confirmationCode,
    );

    const createdUser = await this.usersRepository.createUser(createUser);
    try {
      await this.emailManager.sendEmail(
        inputUserModel.email,
        inputUserModel.login,
        confirmationCode,
      );
    } catch (error) {
      console.log(error);
      await this.usersRepository.deleteUser(createdUser.id);
      throw new ServiceUnavailableException();
    }
    return createdUser;
  }
  async findUserById(userId: string): Promise<UserDocument | null> {
    return this.usersRepository.findUserById(userId);
  }
  async loginIsExist(login: string): Promise<boolean> {
    return await this.usersRepository.loginIsExist(login);
  }
  async emailIsExist(email: string): Promise<boolean> {
    return await this.usersRepository.emailIsExist(email);
  }
  async removeUserByAdmin(userId: string): Promise<boolean> {
    return await this.usersRepository.deleteUser(userId);
  }
}
