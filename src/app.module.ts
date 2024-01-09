import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { RemoveAllModule } from './testing.removeAll/removeAll.module';
import { BlogModule } from './blogs/blog.module';
import { PostModule } from './posts/post.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_URL || 'mongodb://0.0.0.0:27017', {
      dbName: 'around-the-world',
    }),
    RemoveAllModule,
    UsersModule,
    BlogModule,
    PostModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
