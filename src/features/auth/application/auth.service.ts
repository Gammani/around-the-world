import { UsersRepository } from '../../users/infrastructure/users.repository';
import { Injectable } from '@nestjs/common';
import { UsersService } from '../../users/application/users.service';
import { ObjectId } from 'mongodb';
import { UserDbType } from '../../types';
import { v4 as uuidv4 } from 'uuid';
import { EmailManager } from '../../adapter/email.manager';

@Injectable()
export class AuthService {
  constructor(
    protected usersRepository: UsersRepository,
    protected userService: UsersService,
    protected emailManager: EmailManager,
  ) {}
  async isConfirmEmailCode(code: string): Promise<boolean> {
    debugger;
    const foundUser: UserDbType | null =
      await this.usersRepository.findUserByConfirmationCode(code);
    console.log(foundUser);
    debugger;
    if (!foundUser) return false;
    if (foundUser.emailConfirmation.isConfirmed) return false;
    if (foundUser.emailConfirmation.confirmationCode !== code) return false;
    return new Date(foundUser.emailConfirmation.expirationDate) >= new Date();
  }
  async confirmEmail(code: string): Promise<boolean | null> {
    debugger;
    const foundUser =
      await this.usersRepository.findUserByConfirmationCode(code);
    debugger;
    if (foundUser) {
      return await this.usersRepository.updateConfirmationStatus(
        foundUser._id.toString(),
      );
    }
    return null;
  }
  async passwordRecovery(email: string) {
    const foundUser = await this.usersRepository.findUserByLoginOrEmail(email);
    if (foundUser) {
      const recoveryCode = uuidv4();
      await this.usersRepository.updateRecoveryCode(email, recoveryCode);
      await this.emailManager.sendEmail(
        email,
        foundUser.accountData.login,
        `\` <h1>Password recovery</h1>
 <p>To finish password recovery please follow the link below:
     <a href='https://somesite.com/password-recovery?recoveryCode=${recoveryCode}'>recovery password</a>
 </p>\``,
      );
    }
  }
  async resendCode(email: string) {
    const foundUser: UserDbType | null =
      await this.usersRepository.findUserByEmail(email);
    if (foundUser && !foundUser.emailConfirmation.isConfirmed) {
      const code = uuidv4();
      await this.usersRepository.updateConfirmationCode(email, code);
      try {
        await this.emailManager.sendEmail(
          email,
          foundUser.accountData.login,
          `\` <h1>Thank for your registration</h1>
 <p>To finish registration please follow the link below:
     <a href='https://somesite.com/confirm-email?code=${code}'>complete registration</a>
 </p>\``,
        );
        return;
      } catch (e) {
        console.log(e);
        return;
      }
    }
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
