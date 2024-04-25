import jwt, { Secret } from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { PasswordAdapter } from '../../adapter/password.adapter';

@Injectable()
export class JwtService {
  constructor(
    private configService: ConfigService,
    private passwordAdapter: PasswordAdapter,
  ) {}

  async createAccessJWT(deviceId: ObjectId) {
    return jwt.sign(
      { deviceId },
      this.configService.get('JWT_ACCESS_SECRET') as Secret,
      {
        expiresIn: '6000000',
      },
    );
  }
  async createRefreshJWT(deviceId: ObjectId) {
    return jwt.sign(
      { deviceId },
      this.configService.get('JWT_REFRESH_SECRET') as Secret,
      {
        expiresIn: '12000000',
      },
    );
  }
  async verifyRefreshToken(refreshToken: string) {
    return await this.passwordAdapter.jwtVerify(refreshToken);
  }
}
