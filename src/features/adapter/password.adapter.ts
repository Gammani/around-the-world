import bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PasswordAdapter {
  async createPasswordHash(password: string) {
    const passwordSalt = await bcrypt.genSalt(10);
    return await this._generateHash(password, passwordSalt);
  }
  async _generateHash(password: string, salt: string) {
    return await bcrypt.hash(password, salt);
  }
}
