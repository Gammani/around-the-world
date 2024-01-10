import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import { LikeStatus } from '../feature/types';
import { HydratedDocument } from 'mongoose';

export type CommentDocument = HydratedDocument<Comment>;

@Schema()
class CommentatorInfo {
  @Prop({
    required: true,
  })
  userId: ObjectId;

  @Prop({
    required: true,
  })
  userLogin: string;
}

@Schema()
class CommentatorLikesInfo {
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
}

@Schema()
export class Comment {
  _id: ObjectId;

  @Prop({
    required: true,
  })
  content: string;

  @Prop({
    required: true,
  })
  commentatorInfo: CommentatorInfo;

  @Prop({
    required: true,
  })
  createdAt: string;

  @Prop({
    required: true,
  })
  _postId: ObjectId;

  @Prop({
    required: true,
  })
  _blogId: ObjectId;

  @Prop({
    required: true,
  })
  likesInfo: CommentatorLikesInfo;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
