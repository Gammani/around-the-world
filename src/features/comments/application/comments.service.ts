import { Injectable } from '@nestjs/common';
import { CommentDbType, PostDbType, UserDbType } from '../../types';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Comment,
  CommentDocument,
  CommentModelStaticType,
} from '../domain/comments.entity';
import { CommentsRepository } from '../infrastructure/comments.repository';
import { CommentViewModel } from '../api/models/output/comment-output.model';

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comment.name)
    private CommentModel: Model<CommentDocument> & CommentModelStaticType,
    private commentsRepository: CommentsRepository,
  ) {}

  async findCommentById(id: string): Promise<CommentDbType | null> {
    return await this.commentsRepository.findCommentById(id);
  }

  async createComment(
    content: string,
    user: UserDbType,
    post: PostDbType,
  ): Promise<CommentViewModel> {
    const createdComment = this.CommentModel.createComment(
      content,
      user,
      post,
      this.CommentModel,
    );
    debugger;
    return await this.commentsRepository.createComment(createdComment);
  }

  async updateComment(commentId: string, content: string): Promise<boolean> {
    return await this.commentsRepository.updateComment(commentId, content);
  }

  async deleteComment(id: string): Promise<boolean> {
    return await this.commentsRepository.deleteComment(id);
  }

  async deleteAll() {
    return await this.commentsRepository.deleteAll();
  }
}
