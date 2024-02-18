import jwt, { Secret } from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { ObjectId } from 'mongodb';

@Injectable()
export class JwtService {
  constructor(private configService: ConfigService) {}

  async createAccessJWT(deviseId: ObjectId) {
    return jwt.sign(
      { deviseId },
      this.configService.get('JWT_ACCESS_SECRET') as Secret,
      {
        expiresIn: '600000',
      },
    );
  }
  async createRefreshJWT(deviseId: ObjectId) {
    return jwt.sign(
      { deviseId },
      this.configService.get('JWT_REFRESH_SECRET') as Secret,
      {
        expiresIn: '1200000',
      },
    );
  }
}
