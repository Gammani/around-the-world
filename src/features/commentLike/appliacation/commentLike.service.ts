import { InjectModel } from '@nestjs/mongoose';
import {
  CommentLike,
  CommentLikeDocument,
  CommentLikeModelStaticType,
} from '../domain/commentLike.entity';
import { Model } from 'mongoose';
import { CommentLikeRepository } from '../infrastructure/commentLike.repository';
import { CommentDbType, CommentLikeDbType, LikeStatus } from '../../types';
import { ObjectId } from 'mongodb';

export class CommentLikeService {
  constructor(
    @InjectModel(CommentLike.name)
    private CommentLikeModel: Model<CommentLikeDocument> &
      CommentLikeModelStaticType,
    private commentLikeRepository: CommentLikeRepository,
  ) {}

  async findCommentLike(
    commentId: ObjectId,
    userId: ObjectId,
  ): Promise<CommentLikeDbType | null> {
    const foundCommentLike: CommentLikeDbType | null =
      await this.commentLikeRepository.findLike(commentId, userId);
    if (foundCommentLike) {
      return foundCommentLike;
    } else {
      return null;
    }
  }

  async createCommentLike(
    comment: CommentDbType,
    likeStatus: LikeStatus,
    userId: ObjectId,
    userLogin: string,
  ) {
    const createCommentPostLike = this.CommentLikeModel.createCommentLike(
      userId,
      userLogin,
      comment,
      likeStatus,
      this.CommentLikeModel,
    );

    return await this.commentLikeRepository.createCommentLike(
      createCommentPostLike,
    );
  }

  async updateCommentLikeStatus(
    likeStatus: LikeStatus,
    like: CommentLikeDbType,
  ) {
    const isUpdate = await this.commentLikeRepository.updateLikeStatus(
      likeStatus,
      like,
    );
    return isUpdate;
  }
}
