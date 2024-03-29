import { Module } from '@nestjs/common';
import { AuthController } from './api/auth.controller';
import { UsersService } from '../users/application/users.service';
import { PasswordAdapter } from '../adapter/password.adapter';
import { UsersRepository } from '../users/infrastructure/users.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../users/domain/user.entity';
import { LoginIsExistConstraint } from '../../infrastructure/decorators/validate/login.isExist.decorator';
import { EmailIsExistConstraint } from '../../infrastructure/decorators/validate/email.isExist.decorator';
import { ThrottlerModule } from '@nestjs/throttler';
import { EmailManager } from '../adapter/email.manager';
import { AuthService } from './application/auth.service';
import { EmailCodeIsConfirmConstraint } from '../../infrastructure/decorators/validate/email-code-is-confirm-constraint.service';
import { SecurityDevicesService } from '../devices/application/security.devices.service';
import { Device, DeviceSchema } from '../devices/domain/devices.entity';
import { DeviceRepository } from '../devices/infrastructure/device.repository';
import { JwtService } from './application/jwt.service';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { ExpiredTokenRepository } from '../expiredToken/infrastructure/expired.token.repository';
import {
  ExpiredToken,
  ExpiredTokenSchema,
} from '../expiredToken/domain/expired-token.entity';
import { UsersQueryRepository } from '../users/infrastructure/users.query.repository';
import { EmailIsConfirmedConstraint } from '../../infrastructure/decorators/validate/email.isConfirmed.decorator';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Device.name, schema: DeviceSchema },
      { name: ExpiredToken.name, schema: ExpiredTokenSchema },
    ]),
    ThrottlerModule.forRoot([
      {
        ttl: 10000,
        limit: 5,
      },
    ]),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    UsersService,
    UsersRepository,
    UsersQueryRepository,
    PasswordAdapter,
    EmailManager,
    LoginIsExistConstraint,
    EmailCodeIsConfirmConstraint,
    EmailIsExistConstraint,
    EmailIsConfirmedConstraint,
    DeviceRepository,
    SecurityDevicesService,
    JwtService,
    LocalStrategy,
    JwtStrategy,
    EmailManager,
    ExpiredTokenRepository,
  ],
})
export class AuthModule {}
