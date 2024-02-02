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

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    ThrottlerModule.forRoot([
      {
        ttl: 10000,
        limit: 5,
      },
    ]),
  ],
  controllers: [AuthController],
  providers: [
    UsersService,
    UsersRepository,
    PasswordAdapter,
    LoginIsExistConstraint,
    EmailIsExistConstraint,
  ],
})
export class AuthModule {}
