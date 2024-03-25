import { Injectable } from '@nestjs/common';
import { LikeStatus, PostDbType, PostLikeDbType } from '../../types';
import { ObjectId } from 'mongodb';
import { InjectModel } from '@nestjs/mongoose';
import {
  PostLike,
  PostLikeDocument,
  PostLikeModelStaticType,
} from '../domain/postLike.entity';
import { Model } from 'mongoose';
import { PostLikeRepository } from '../infrastructure/postLike.repository';

@Injectable()
export class PostLikeService {
  constructor(
    @InjectModel(PostLike.name)
    private PostLikeModel: Model<PostLikeDocument> & PostLikeModelStaticType,
    private postLikeRepository: PostLikeRepository,
  ) {}

  async findPostLike(
    postId: ObjectId,
    userId: ObjectId,
  ): Promise<PostLikeDbType | null> {
    const result = await this.postLikeRepository.findPostLike(postId, userId);
    if (result) {
      return result;
    } else {
      return null;
    }
  }

  async createPostLike(
    userId: ObjectId,
    login: string,
    post: PostDbType,
    likeStatus: LikeStatus,
  ) {
    const createPostLike = this.PostLikeModel.createPostLike(
      userId,
      login,
      post,
      likeStatus,
      this.PostLikeModel,
    );

    return await this.postLikeRepository.createPostLike(createPostLike);
  }

  async updatePostLikeStatus(likeStatus: LikeStatus, like: PostLikeDbType) {
    return await this.postLikeRepository.updatePostLikeStatus(likeStatus, like);
  }
}
