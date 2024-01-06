import { Module } from '@nestjs/common';
import { UsersRepository } from '../users/users.repository';
import { TestingRemoveAll } from './removeAll.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../users/users.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [TestingRemoveAll],
  providers: [UsersRepository],
})
export class RemoveAllModule {}
