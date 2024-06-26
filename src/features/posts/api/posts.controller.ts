import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { PostsService } from '../application/posts.service';
import { BlogsService } from '../../blogs/application/blogs.service';
import { CommentsQueryRepository } from '../../comments/infrastructure/comments.query.repository';
import { PostsQueryRepository } from '../infrastructure/posts.query.repository';
import { PostsWithPaginationViewModel } from './models/output/post.output.model';
import {
  PostCreateModelWithBlogId,
  UpdateInputPostModelType,
} from './models/input/post.input.model';
import { PostLikeModel } from './models/input/post.like.model';
import {
  BlogDbType,
  PostDbType,
  PostLikeDbType,
  UserDbType,
} from '../../types';
import { PostLikeService } from '../../postLike/application/postLike.service';
import { Request } from 'express';
import {
  RequestWithDeviceId,
  RequestWithUserId,
} from '../../auth/api/models/input/auth.input.model';
import { UsersService } from '../../users/application/users.service';
import { ObjectId } from 'mongodb';
import { CommentsWithPaginationViewModel } from '../../comments/api/models/output/comment-output.model';
import { CommentInputModel } from './models/input/comment.input.model';
import { CommentsService } from '../../comments/application/comments.service';
import { BasicAuthGuard } from '../../auth/guards/basic-auth.guard';
import { CommandBus } from '@nestjs/cqrs';
import { GetPostByIdCommand } from '../application/use-cases/getPostById.useCase';
import { CreatePostLikeCommand } from '../../postLike/application/use-cases/createPostLike-useCase';
import { GetUserByDeviceIdCommand } from '../../users/application/use-cases/getUserByDeviceId.useCase';
import { GetPostLikeFromUserCommand } from '../../postLike/application/use-cases/getPostLikeFromUser.useCase';
import { UpdatePostLikeStatusCommand } from '../../postLike/application/use-cases/updatePostLikeStatus.useCase';
import { GetQueryCommentsByPostIdCommand } from '../../comments/application/use-cases/getQueryCommentsByPostId.useCase';
import { GetQueryPostsCommand } from '../application/use-cases/getQueryPosts.useCase';
import { GetBlogByIdCommand } from '../../blogs/application/use-cases/getBlogById.useCase';
import { CreatePostByAdminCommand } from '../application/use-cases/createPostByAdmin.useCase';
import { CreateCommentCommand } from '../../comments/application/use-cases/CreateComment.useCase';
import { GetQueryPostByIdCommand } from '../application/use-cases/getQueryPostById.useCase';
import { UpdatePostByAdminCommand } from '../application/use-cases/updatePostByAdmin.useCase';
import { DeletePostByAdminCommand } from '../application/use-cases/deletePostByAdmin.useCase';
import { CheckAccessToken } from '../../auth/guards/jwt-accessToken.guard';

@Controller('posts')
export class PostsController {
  constructor(
    private readonly userService: UsersService,
    private readonly blogService: BlogsService,
    private readonly postService: PostsService,
    private readonly commentsQueryRepository: CommentsQueryRepository,
    private readonly postsQueryRepository: PostsQueryRepository,
    private readonly postLikeService: PostLikeService,
    private readonly commentService: CommentsService,
    private commandBus: CommandBus,
  ) {}

  @UseGuards(CheckAccessToken)
  @Put(':postId/like-status')
  @HttpCode(204)
  async updatePostLikeStatus(
    @Body() postLikeModel: PostLikeModel,
    @Param('postId') postId: string,
    @Req() req: Request & RequestWithDeviceId,
  ) {
    const foundPost: PostDbType | null = await this.commandBus.execute(
      new GetPostByIdCommand(postId),
    );
    if (foundPost) {
      const foundUser: UserDbType | null = await this.commandBus.execute(
        new GetUserByDeviceIdCommand(req.deviceId),
      );
      if (foundUser) {
        const foundPostLikeFromUser: PostLikeDbType | null =
          await this.commandBus.execute(
            new GetPostLikeFromUserCommand(new ObjectId(postId), foundUser._id),
          );
        if (foundPostLikeFromUser) {
          await this.commandBus.execute(
            new UpdatePostLikeStatusCommand(
              postLikeModel.likeStatus,
              foundPostLikeFromUser,
            ),
          );
        } else {
          await this.commandBus.execute(
            new CreatePostLikeCommand(
              foundUser,
              foundPost,
              postLikeModel.likeStatus,
            ),
          );
        }
      }
    } else {
      throw new NotFoundException();
    }
  }

  @Get(':postId/comments')
  async getCommentsByPostId(
    @Param('postId') postId: string,
    @Req() req: Request & RequestWithUserId,
    @Query()
    query: {
      pageNumber: string | undefined;
      pageSize: string | undefined;
      sortBy: string | undefined;
      sortDirection: string | undefined;
    },
  ) {
    const foundPost: PostDbType | null = await this.commandBus.execute(
      new GetPostByIdCommand(postId),
    );
    if (foundPost) {
      const foundCommentsWithUserNoName: CommentsWithPaginationViewModel =
        await this.commandBus.execute(
          new GetQueryCommentsByPostIdCommand(
            query.pageNumber,
            query.pageSize,
            query.sortBy,
            query.sortDirection,
            postId,
            req.user?.userId,
          ),
        );
      return foundCommentsWithUserNoName;
    } else {
      throw new NotFoundException();
    }
  }

  @Get()
  async getAllPosts(
    @Req() req: Request & RequestWithUserId,
    @Query()
    query: {
      pageNumber: string | undefined;
      pageSize: string | undefined;
      sortBy: string | undefined;
      sortDirection: string | undefined;
    },
  ) {
    const foundPosts: PostsWithPaginationViewModel =
      await this.commandBus.execute(
        new GetQueryPostsCommand(
          query.pageNumber,
          query.pageSize,
          query.sortBy,
          query.sortDirection,
          req.user?.userId,
        ),
      );
    return foundPosts;
  }

  @UseGuards(BasicAuthGuard)
  @Post()
  async createPostByAdmin(@Body() inputPostModel: PostCreateModelWithBlogId) {
    const foundBlog: BlogDbType | null = await this.commandBus.execute(
      new GetBlogByIdCommand(inputPostModel.blogId),
    );
    if (foundBlog) {
      return await this.commandBus.execute(
        new CreatePostByAdminCommand(inputPostModel, foundBlog),
      );
    } else {
      throw new NotFoundException();
    }
  }

  @UseGuards(CheckAccessToken)
  @Post(':postId/comments')
  async createCommentByPostId(
    @Body() inputCommentModel: CommentInputModel,
    @Param('postId') postId: string,
    @Req() req: Request & RequestWithDeviceId,
  ) {
    const foundPost: PostDbType | null = await this.commandBus.execute(
      new GetPostByIdCommand(postId),
    );
    if (foundPost) {
      const foundUser: UserDbType = await this.commandBus.execute(
        new GetUserByDeviceIdCommand(req.deviceId),
      );
      if (foundUser) {
        return await this.commandBus.execute(
          new CreateCommentCommand(inputCommentModel, foundUser, foundPost),
        );
      } else {
        throw new UnauthorizedException();
      }
    } else {
      throw new NotFoundException();
    }
  }

  @Get(':id')
  async findPostById(
    @Param('id') postId: string,
    @Req() req: Request & RequestWithUserId,
  ) {
    const foundPost = await this.commandBus.execute(
      new GetPostByIdCommand(postId),
    );
    if (foundPost) {
      return await this.commandBus.execute(
        new GetQueryPostByIdCommand(postId, req.user?.userId),
      );
    } else {
      throw new NotFoundException();
    }
  }

  @UseGuards(BasicAuthGuard)
  @Put(':id')
  @HttpCode(204)
  async updatePostByAdmin(
    @Param('id') postId: string,
    @Body() inputPostModel: UpdateInputPostModelType,
  ) {
    const foundPost = await this.commandBus.execute(
      new GetPostByIdCommand(postId),
    );
    if (foundPost) {
      await this.commandBus.execute(
        new UpdatePostByAdminCommand(postId, inputPostModel),
      );
    } else {
      throw new NotFoundException();
    }
  }

  @UseGuards(BasicAuthGuard)
  @Delete(':id')
  @HttpCode(204)
  async removePostByAdmin(@Param('id') postId: string) {
    const foundPost = await this.commandBus.execute(
      new GetPostByIdCommand(postId),
    );
    if (foundPost) {
      await this.commandBus.execute(new DeletePostByAdminCommand(postId));
    } else {
      throw new NotFoundException();
    }
  }
}
