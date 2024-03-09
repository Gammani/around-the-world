import bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';
import jwt, { Secret } from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { TokenPayloadType } from '../types';

@Injectable()
export class PasswordAdapter {
  constructor(private configService: ConfigService) {}
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
  async jwtVerify(refreshToken: string): Promise<TokenPayloadType | null> {
    debugger;
    try {
      return jwt.verify(
        refreshToken,
        this.configService.get('JWT_REFRESH_SECRET') as Secret,
      ) as TokenPayloadType;
    } catch (error: any) {
      console.log(error);
      return null;
    }
  }
}
