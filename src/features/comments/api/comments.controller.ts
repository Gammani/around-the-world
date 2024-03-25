import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CheckToken } from '../../../infrastructure/decorators/validate/checkToken';
import { Request } from 'express';

import { CommentDbType, CommentLikeDbType, UserDbType } from '../../types';
import { CommentsService } from '../application/comments.service';
import { UsersService } from '../../users/application/users.service';
import { CommentsQueryRepository } from '../infrastructure/comments.query.repository';
import { CheckRefreshToken } from '../../auth/guards/jwt-auth.guard';
import { CommentInputModel } from '../../posts/api/models/input/comment.input.model';
import { RequestWithDeviceId } from '../../auth/api/models/input/auth.input.model';
import { ObjectId } from 'mongodb';
import { CommentLikeModel } from './models/input/comment.like.model';
import { CommentLikeService } from '../../commentLike/appliacation/commentLike.service';
import { CheckDeviceId } from './models/input/comment.input.model';

@Controller('comments')
export class CommentsController {
  constructor(
    private readonly commentsService: CommentsService,
    private readonly commentsQueryRepository: CommentsQueryRepository,
    private readonly commentLikeService: CommentLikeService,
    private readonly userService: UsersService,
  ) {}

  @UseGuards(CheckToken)
  @Get(':id')
  async getCommentById(
    @Param('id') commentId: string,
    @Req() req: Request & CheckDeviceId,
  ) {
    debugger;
    const foundComment: CommentDbType | null =
      await this.commentsService.findCommentById(commentId);
    if (foundComment) {
      if (req.deviceId) {
        const foundUser: UserDbType | null =
          await this.userService.findUserByDeviceId(req.deviceId);
        return await this.commentsQueryRepository.findCommentById(
          commentId,
          foundUser?._id,
        );
      } else {
        return await this.commentsQueryRepository.findCommentById(commentId);
      }
    } else {
      throw new NotFoundException();
    }
  }

  @UseGuards(CheckRefreshToken)
  @Put(':commentId')
  async updateCommentById(
    @Body() inputCommentModel: CommentInputModel,
    @Param('commentId') commentId: string,
    @Req() req: Request & RequestWithDeviceId,
  ) {
    const foundComment: CommentDbType | null =
      await this.commentsService.findCommentById(commentId);

    if (foundComment) {
      const foundUser: UserDbType | null =
        await this.userService.findUserByDeviceId(req.deviceId);
      if (
        foundUser &&
        new ObjectId(foundComment.commentatorInfo.userId) === foundUser._id
      ) {
        await this.commentsService.updateComment(
          commentId,
          inputCommentModel.content,
        );
      } else {
        throw new ForbiddenException();
      }
    } else {
      throw new NotFoundException();
    }
  }

  @UseGuards(CheckRefreshToken)
  @Delete(':commentId')
  async removeCommentById(
    @Param('commentId') commentId: string,
    @Req() req: Request & RequestWithDeviceId,
  ) {
    const foundComment: CommentDbType | null =
      await this.commentsService.findCommentById(commentId);
    if (foundComment) {
      const foundUser: UserDbType | null =
        await this.userService.findUserByDeviceId(req.deviceId);
      if (
        foundUser &&
        foundUser._id === new ObjectId(foundComment.commentatorInfo.userId)
      ) {
        await this.commentsService.deleteComment(commentId);
      } else {
        throw new ForbiddenException();
      }
    } else {
      throw new NotFoundException();
    }
  }

  @UseGuards(CheckRefreshToken)
  @Put(':commentId/like-status')
  async updateCommentLikeStatus(
    @Body() commentLikeModel: CommentLikeModel,
    @Param('commentId') commentId: string,
    @Req() req: Request & RequestWithDeviceId,
  ) {
    const foundComment: CommentDbType | null =
      await this.commentsService.findCommentById(commentId);
    if (foundComment) {
      const foundUser: UserDbType | null =
        await this.userService.findUserByDeviceId(req.deviceId);
      if (foundUser) {
        const foundCommentLikeFromUser: CommentLikeDbType | null =
          await this.commentLikeService.findCommentLike(
            foundComment._id,
            foundUser._id,
          );
        if (foundCommentLikeFromUser) {
          await this.commentLikeService.updateCommentLikeStatus(
            commentLikeModel.likeStatus,
            foundCommentLikeFromUser,
          );
        } else {
          await this.commentLikeService.createCommentLike(
            foundComment,
            commentLikeModel.likeStatus,
            foundUser._id,
            foundUser.accountData.login,
          );
        }
      }
    } else {
      throw new NotFoundException();
    }
  }
}
