import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ExpiredToken,
  ExpiredTokenSchema,
} from './domain/expired-token.entity';
import { ExpiredTokenRepository } from './infrastructure/expired.token.repository';
import { PasswordAdapter } from '../adapter/password.adapter';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ExpiredToken.name, schema: ExpiredTokenSchema },
    ]),
  ],
  providers: [ExpiredTokenRepository, PasswordAdapter],
})
export class ExpiredTokenModule {}
