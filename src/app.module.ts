import { configModule } from './settings/configuration/configModule';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './features/users/users.module';
import { RemoveAllModule } from './features/testing.removeAll/removeAll.module';
import { BlogModule } from './features/blogs/blog.module';
import { PostModule } from './features/posts/post.module';
import { AuthModule } from './features/auth/auth.module';
import { ExpiredTokenModule } from './features/expiredToken/expired.token.module';
import { CommentModule } from './features/comments/comment.module';
import { SecurityDeviceModule } from './features/devices/sequrity.device.module';
import { CommandBus, CqrsModule } from '@nestjs/cqrs';
import {
  CreateUserCommand,
  CreateUserUserCase,
} from './features/auth/application/use-cases/createUser.useCase';
import { User, UserSchema } from './features/users/domain/user.entity';
import { UsersRepository } from './features/users/infrastructure/users.repository';
import { EmailManager } from './features/adapter/email.manager';
import { PasswordAdapter } from './features/adapter/password.adapter';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_URL || 'mongodb://0.0.0.0:27017', {
      dbName: 'around-the-world',
    }),
    CqrsModule,
    configModule,
    AuthModule,
    RemoveAllModule,
    UsersModule,
    BlogModule,
    PostModule,
    CommentModule,
    ExpiredTokenModule,
    SecurityDeviceModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    CreateUserCommand,
    CreateUserUserCase,
    UsersRepository,
    EmailManager,
    PasswordAdapter,
    CommandBus,
  ],
})
export class AppModule {}
