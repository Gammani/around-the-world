import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpCode,
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
import { CommentLikeModel } from './models/input/comment.like.model';
import { CommentLikeService } from '../../commentLike/appliacation/commentLike.service';
import { CheckDeviceId } from './models/input/comment.input.model';
import { CommandBus } from '@nestjs/cqrs';
import { GetCommentByIdCommand } from '../application/use-cases/getCommentById.useCase';
import { GetUserByDeviceIdCommand } from '../../users/application/use-cases/getUserByDeviceId.useCase';
import { GetQueryCommentByIdCommand } from '../application/use-cases/getQueryCommentById.useCase';
import { UpdateCommentCommand } from '../application/use-cases/updateComment.useCase';
import { DeleteCommentByIdCommand } from '../application/use-cases/deleteCommentById.useCase';
import { GetCommentLikeCommand } from '../../commentLike/appliacation/use-cases/getCommentLike.useCase';
import { UpdateCommentLikeCommand } from '../../commentLike/appliacation/use-cases/updateCommentLike.useCase';
import { CreateCommentLikeCommand } from '../../commentLike/appliacation/use-cases/createCommentLike.useCase';

@Controller('comments')
export class CommentsController {
  constructor(
    private readonly commentsService: CommentsService,
    private readonly commentsQueryRepository: CommentsQueryRepository,
    private readonly commentLikeService: CommentLikeService,
    private readonly userService: UsersService,
    private commandBus: CommandBus,
  ) {}

  @UseGuards(CheckToken)
  @Get(':id')
  async getCommentById(
    @Param('id') commentId: string,
    @Req() req: Request & CheckDeviceId,
  ) {
    debugger;
    const foundComment: CommentDbType | null = await this.commandBus.execute(
      new GetCommentByIdCommand(commentId),
    );
    if (foundComment) {
      if (req.deviceId) {
        const foundUser: UserDbType | null = await this.commandBus.execute(
          new GetUserByDeviceIdCommand(req.deviceId),
        );
        return await this.commandBus.execute(
          new GetQueryCommentByIdCommand(commentId, foundUser?._id),
        );
      } else {
        return await this.commandBus.execute(
          new GetQueryCommentByIdCommand(commentId),
        );
      }
    } else {
      throw new NotFoundException();
    }
  }

  @UseGuards(CheckRefreshToken)
  @Put(':commentId')
  @HttpCode(204)
  async updateCommentById(
    @Body() inputCommentModel: CommentInputModel,
    @Param('commentId') commentId: string,
    @Req() req: Request & RequestWithDeviceId,
  ) {
    const foundComment: CommentDbType | null = await this.commandBus.execute(
      new GetCommentByIdCommand(commentId),
    );

    if (foundComment) {
      const foundUser: UserDbType | null = await this.commandBus.execute(
        new GetUserByDeviceIdCommand(req.deviceId),
      );
      if (
        foundUser &&
        foundComment.commentatorInfo.userId.toString() ===
          foundUser._id.toString()
      ) {
        await this.commandBus.execute(
          new UpdateCommentCommand(commentId, inputCommentModel.content),
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
    const foundComment: CommentDbType | null = await this.commandBus.execute(
      new GetCommentByIdCommand(commentId),
    );
    if (foundComment) {
      const foundUser: UserDbType | null = await this.commandBus.execute(
        new GetUserByDeviceIdCommand(req.deviceId),
      );
      if (
        foundUser &&
        foundUser._id.toString() ===
          foundComment.commentatorInfo.userId.toString()
      ) {
        await this.commandBus.execute(new DeleteCommentByIdCommand(commentId));
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
    const foundComment: CommentDbType | null = await this.commandBus.execute(
      new GetCommentByIdCommand(commentId),
    );
    if (foundComment) {
      const foundUser: UserDbType | null = await this.commandBus.execute(
        new GetUserByDeviceIdCommand(req.deviceId),
      );
      if (foundUser) {
        const foundCommentLikeFromUser: CommentLikeDbType | null =
          await this.commandBus.execute(
            new GetCommentLikeCommand(foundComment._id, foundUser._id),
          );
        if (foundCommentLikeFromUser) {
          await this.commandBus.execute(
            new UpdateCommentLikeCommand(
              commentLikeModel.likeStatus,
              foundCommentLikeFromUser,
            ),
          );
        } else {
          await this.commandBus.execute(
            new CreateCommentLikeCommand(
              foundComment,
              commentLikeModel.likeStatus,
              foundUser._id,
              foundUser.accountData.login,
            ),
          );
        }
      }
    } else {
      throw new NotFoundException();
    }
  }
}
