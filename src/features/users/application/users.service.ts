import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import {
  CreatedUserViewModel,
  UserViewModel,
} from '../api/models/output/user.output.model';
import { UsersRepository } from '../infrastructure/users.repository';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument, UserModelStaticType } from '../domain/user.entity';
import { Model } from 'mongoose';
import { PasswordAdapter } from '../../adapter/password.adapter';
import { UserCreateModel } from '../api/models/input/create-user.input.model';
import { v4 as uuidv4 } from 'uuid';
import { EmailManager } from '../../adapter/email.manager';
import { UserDbType } from '../../types';
import { ObjectId } from 'mongodb';
import { SecurityDevicesService } from '../../devices/application/security.devices.service';
import { UsersQueryRepository } from '../infrastructure/users.query.repository';

@Injectable()
export class UsersService {
  constructor(
    protected passwordAdapter: PasswordAdapter,
    protected usersRepository: UsersRepository,
    protected usersQueryRepository: UsersQueryRepository,
    protected emailManager: EmailManager,
    protected securityDevicesService: SecurityDevicesService,
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
        `\` <h1>Thank for your registration</h1>
 <p>To finish registration please follow the link below:
     <a href='https://somesite.com/confirm-email?code=${confirmationCode}'>complete registration</a>
 </p>\``,
      );
    } catch (error) {
      console.log(error);
      await this.usersRepository.deleteUser(createdUser.id);
      throw new ServiceUnavailableException();
    }
    return createdUser;
  }
  async findUserById(userId: string): Promise<UserDbType | null> {
    return this.usersRepository.findUserById(userId);
  }
  async findUserViewModelByDeviceId(
    deviceId: ObjectId,
  ): Promise<UserViewModel | null> {
    const userId =
      await this.securityDevicesService.findUserIdByDeviceId(deviceId);
    if (userId) {
      return await this.usersQueryRepository.findUserById(userId);
    } else {
      return null;
    }
  }
  async findUserByDeviceId(deviceId: ObjectId): Promise<UserDbType | null> {
    const userId =
      await this.securityDevicesService.findUserIdByDeviceId(deviceId);
    if (userId) {
      return await this.usersRepository.findUserById(userId);
    } else {
      return null;
    }
  }
  async findUserByRecoveryCode(
    recoveryCode: string,
  ): Promise<UserDbType | null> {
    return await this.usersRepository.findUserByRecoveryCode(recoveryCode);
  }
  async loginIsExist(login: string): Promise<boolean> {
    return await this.usersRepository.loginIsExist(login);
  }
  async checkCredentials(
    loginOrEmail: string,
    password: string,
  ): Promise<UserDbType | null> {
    const user: UserDbType | null =
      await this.usersRepository.findUserByLoginOrEmail(loginOrEmail);

    if (!user) return null;
    if (!user.emailConfirmation.isConfirmed) return null;

    const isHashesEquals: any = await this.passwordAdapter.isPasswordCorrect(
      password,
      user.accountData.passwordHash,
    );
    if (isHashesEquals) {
      return user;
    } else {
      return null;
    }
  }
  async updatePassword(newPassword: string, recoveryCode: string) {
    debugger;
    const foundUser = await this.findUserByRecoveryCode(recoveryCode);
    if (foundUser) {
      const passwordHash =
        await this.passwordAdapter.createPasswordHash(newPassword);

      return this.usersRepository.updatePassword(passwordHash, recoveryCode);
    }
    return;
  }
  async emailIsExist(email: string): Promise<boolean> {
    return await this.usersRepository.emailIsExist(email);
  }
  async removeUserByAdmin(userId: string): Promise<boolean> {
    return await this.usersRepository.deleteUser(userId);
  }
}
