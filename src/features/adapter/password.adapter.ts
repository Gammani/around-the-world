import bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PasswordAdapter {
  async createPasswordHash(password: string) {
    const passwordSalt = await bcrypt.genSalt(10);
    return await this._generateHash(password, passwordSalt);
  }
  private _generateHash(password: string, salt: string) {
    return bcrypt.hash(password, salt);
  }
  async isPasswordCorrect(password: string, hash: string) {
    const isEqual = await bcrypt.compare(password, hash);
    return isEqual;
  }
}
