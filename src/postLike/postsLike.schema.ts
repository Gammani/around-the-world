import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import { LikeStatus } from '../feature/types';
import { HydratedDocument } from 'mongoose';

export type PostLikeDocument = HydratedDocument<PostLike>;

@Schema()
export class PostLike {
  _id: ObjectId;

  @Prop({
    required: true,
  })
  userId: ObjectId;

  @Prop({
    required: true,
  })
  login: string;

  @Prop({
    required: true,
  })
  blogId: ObjectId;

  @Prop({
    required: true,
  })
  postId: ObjectId;

  @Prop({
    required: true,
  })
  likeStatus: LikeStatus;

  @Prop({
    required: true,
  })
  addedAt: string;

  @Prop({
    required: true,
  })
  lastUpdate: string;
}

export const PostLikeSchema = SchemaFactory.createForClass(PostLike);
