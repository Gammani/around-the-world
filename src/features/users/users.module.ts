import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './domain/user.entity';
import { UsersController } from './api/users.controller';
import { UsersService } from './application/users.service';
import { UsersRepository } from './infrastructure/users.repository';
import { UsersQueryRepository } from './infrastructure/users.query.repository';
import { PasswordAdapter } from '../adapter/password.adapter';
import { EmailManager } from '../adapter/email.manager';
import { SecurityDevicesService } from '../devices/application/security-devices.service';
import { DeviceRepository } from '../devices/infrastructure/device.repository';
import { Device, DeviceSchema } from '../devices/domain/devices.entity';
import { ExpiredTokenRepository } from '../expiredToken/infrastructure/expired.token.repository';
import {
  ExpiredToken,
  ExpiredTokenSchema,
} from '../expiredToken/domain/expired-token.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
      { name: Device.name, schema: DeviceSchema },
      { name: ExpiredToken.name, schema: ExpiredTokenSchema },
    ]),
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    UsersRepository,
    UsersQueryRepository,
    PasswordAdapter,
    EmailManager,
    SecurityDevicesService,
    DeviceRepository,
    ExpiredTokenRepository,
  ],
})
export class UsersModule {}
