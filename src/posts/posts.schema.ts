import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import { LikeStatus } from '../feature/types';
import { HydratedDocument, Model } from 'mongoose';
import {
  CreateInputPostModelType,
  CreateInputPostWithBlogIdModelType,
} from '../feature/model type/PostViewModel';

export type PostDocument = HydratedDocument<Post>;

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
    type: [NewestLikes],
  })
  newestLikes: NewestLikes[];
}

@Schema()
export class Post {
  _id: ObjectId;

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

PostSchema.statics.createPostWithUriBlogId = (
  postInputDto: CreateInputPostModelType,
  blogId: string,
  blogName: string,
  PostModel: Model<PostDocument> & PostModelWithUriBlogIdStaticType,
) => {
  const post = new PostModel();
  post._id = new ObjectId();
  post.title = postInputDto.title;
  post.shortDescription = postInputDto.shortDescription;
  post.content = postInputDto.content;
  post.blogId = new ObjectId(blogId);
  post.blogName = blogName;
  post.createdAt = new Date().toISOString();
  post.extendedLikesInfo = {
    likesCount: 0,
    dislikesCount: 0,
    myStatus: LikeStatus.None,
    newestLikes: [],
  };
  return post;
};

PostSchema.statics.createPost = (
  postInputDto: CreateInputPostWithBlogIdModelType,
  blogName: string,
  PostModel: Model<PostDocument> & PostModelStaticType,
) => {
  const post = new PostModel();
  post._id = new ObjectId();
  post.title = postInputDto.title;
  post.shortDescription = postInputDto.shortDescription;
  post.content = postInputDto.content;
  post.blogId = new ObjectId(postInputDto.blogId);
  post.blogName = blogName;
  post.createdAt = new Date().toISOString();
  post.extendedLikesInfo = {
    likesCount: 0,
    dislikesCount: 0,
    myStatus: LikeStatus.None,
    newestLikes: [],
  };
  return post;
};

export type PostModelWithUriBlogIdStaticType = {
  createPostWithUriBlogId: (
    postInputDto: CreateInputPostModelType,
    blogId: string,
    blogName: string,
    PostModel: Model<PostDocument> & PostModelWithUriBlogIdStaticType,
  ) => {
    _id: ObjectId;
    title: string;
    shortDescription: string;
    content: string;
    blogId: ObjectId;
    blogName: string;
    createdAt: string;
    extendedLikesInfo: ExtendedLikesInfo;
  };
};

export type PostModelStaticType = {
  createPost: (
    postInputDto: CreateInputPostWithBlogIdModelType,
    blogName: string,
    PostModel: Model<PostDocument> & PostModelStaticType,
  ) => {
    _id: ObjectId;
    title: string;
    shortDescription: string;
    content: string;
    blogId: ObjectId;
    blogName: string;
    createdAt: string;
    extendedLikesInfo: ExtendedLikesInfo;
  };
};
