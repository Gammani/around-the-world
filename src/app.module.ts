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

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_URL || 'mongodb://0.0.0.0:27017', {
      dbName: 'around-the-world',
    }),
    configModule,
    AuthModule,
    RemoveAllModule,
    UsersModule,
    BlogModule,
    PostModule,
    CommentModule,
    ExpiredTokenModule,
    SecurityDeviceModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
