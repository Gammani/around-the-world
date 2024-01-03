import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import { LikeStatus } from '../feature/types';
import { HydratedDocument } from 'mongoose';

@Schema()
class NewestLikes {
  @Prop({
    required: true,
  })
  addedAt: string;

  @Prop({
    required: true,
  })
  userId: ObjectId;

  @Prop({
    required: true,
  })
  login: string;
}

@Schema()
class ExtendedLikesInfo {
  @Prop({
    required: true,
  })
  likesCount: number;

  @Prop({
    required: true,
  })
  dislikesCount: number;

  @Prop({
    required: true,
  })
  myStatus: LikeStatus;

  @Prop({
    required: true,
  })
  newestLikes: NewestLikes;
}

@Schema()
export class Post {
  @Prop({
    required: true,
  })
  title: string;

  @Prop({
    required: true,
  })
  shortDescription: string;

  @Prop({
    required: true,
  })
  content: string;

  @Prop({
    required: true,
  })
  blogId: ObjectId;

  @Prop({
    required: true,
  })
  blogName: string;

  @Prop({
    required: true,
  })
  createdAt: string;

  @Prop({
    required: true,
  })
  extendedLikesInfo: ExtendedLikesInfo;
}

export const PostSchema = SchemaFactory.createForClass(Post);

export type PostDocument = HydratedDocument<Post>;
