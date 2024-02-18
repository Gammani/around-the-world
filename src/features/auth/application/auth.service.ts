import { UsersRepository } from '../../users/infrastructure/users.repository';
import { Injectable } from '@nestjs/common';
import { UsersService } from '../../users/application/users.service';
import { ObjectId } from 'mongodb';
import { UserDocument } from '../../users/domain/user.entity';
import { UserDbType } from '../../types';

@Injectable()
export class AuthService {
  constructor(
    protected usersRepository: UsersRepository,
    protected userService: UsersService,
  ) {}
  async isConfirmEmailCode(code: string): Promise<boolean> {
    const foundUser =
      await this.usersRepository.findUserByConfirmationCode(code);
    if (!foundUser) return false;
    if (foundUser.emailConfirmation.isConfirmed) return false;
    if (foundUser.emailConfirmation.confirmationCode !== code) return false;
    return foundUser.emailConfirmation.expirationDate >= new Date();
  }
  async confirmEmail(code: string): Promise<boolean | null> {
    debugger;
    const foundUser =
      await this.usersRepository.findUserByConfirmationCode(code);
    if (foundUser) {
      return await this.usersRepository.updateConfirmation(
        foundUser._id.toString(),
      );
    }
    return null;
  }
  async validateUser(
    loginOrEmail: string,
    pass: string,
  ): Promise<ObjectId | null> {
    const user: UserDbType | null = await this.userService.checkCredentials(
      loginOrEmail,
      pass,
    );
    if (user) {
      return user._id;
    } else {
      return null;
    }
  }
}
