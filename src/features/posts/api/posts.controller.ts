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
import { BlogDbType, PostDbType, PostLikeDbType } from '../../types';
import { CheckRefreshToken } from '../../auth/guards/jwt-auth.guard';
import { PostLikeService } from '../../postLike/application/postLike.service';
import { Request } from 'express';
import { RequestWithDeviceId } from '../../auth/api/models/input/auth.input.model';
import { UsersService } from '../../users/application/users.service';
import { ObjectId } from 'mongodb';
import { CommentsWithPaginationViewModel } from '../../comments/api/models/output/comment-output.model';
import { CommentInputModel } from './models/input/comment.input.model';
import { CommentsService } from '../../comments/application/comments.service';
import { BasicAuthGuard } from '../../auth/guards/basic-auth.guard';

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
  ) {}

  @UseGuards(CheckRefreshToken)
  @Put(':postId/like-status')
  async updatePostLikeStatus(
    @Body() postLikeModel: PostLikeModel,
    @Param('postId') postId: string,
    @Req() req: Request & RequestWithDeviceId,
  ) {
    const foundPost: PostDbType | null =
      await this.postService.findPostById(postId);
    if (foundPost) {
      const foundUser = await this.userService.findUserByDeviceId(req.deviceId);
      if (foundUser) {
        const foundPostLikeFromUser: PostLikeDbType | null =
          await this.postLikeService.findPostLike(
            new ObjectId(postId),
            foundUser._id,
          );
        if (foundPostLikeFromUser) {
          await this.postLikeService.updatePostLikeStatus(
            postLikeModel.likeStatus,
            foundPostLikeFromUser,
          );
        } else {
          await this.postLikeService.createPostLike(
            foundUser._id,
            foundUser.accountData.login,
            foundPost,
            postLikeModel.likeStatus,
          );
        }
      }
    } else {
      new NotFoundException();
    }
  }

  @Get(':postId/comments')
  async getCommentsByPostId(
    @Param('postId') postId: string,
    @Query()
    query: {
      pageNumber: string | undefined;
      pageSize: string | undefined;
      sortBy: string | undefined;
      sortDirection: string | undefined;
    },
  ) {
    const foundPost: PostDbType | null =
      await this.postService.findPostById(postId);
    if (foundPost) {
      const foundCommentsWithUserNoName: CommentsWithPaginationViewModel =
        await this.commentsQueryRepository.findComments(
          query.pageNumber,
          query.pageSize,
          query.sortBy,
          query.sortDirection,
          postId,
        );
      return foundCommentsWithUserNoName;
    } else {
      throw new NotFoundException();
    }
  }

  @Get()
  async getAllPosts(
    @Query()
    query: {
      pageNumber: string | undefined;
      pageSize: string | undefined;
      sortBy: string | undefined;
      sortDirection: string | undefined;
    },
  ) {
    const foundPosts: PostsWithPaginationViewModel =
      await this.postsQueryRepository.findPosts(
        query.pageNumber,
        query.pageSize,
        query.sortBy,
        query.sortDirection,
      );
    return foundPosts;
  }

  @UseGuards(BasicAuthGuard)
  @Post()
  async createPostByAdmin(@Body() inputPostModel: PostCreateModelWithBlogId) {
    const foundBlog: BlogDbType | null = await this.blogService.findBlogById(
      inputPostModel.blogId,
    );
    if (foundBlog) {
      return await this.postService.createPostByAdmin(
        inputPostModel,
        foundBlog.name,
      );
    } else {
      throw new NotFoundException();
    }
  }

  @UseGuards(CheckRefreshToken)
  @Post(':postId/comments')
  async createCommentByPostId(
    @Body() inputCommentModel: CommentInputModel,
    @Param('postId') postId: string,
    @Req() req: Request & RequestWithDeviceId,
  ) {
    const foundPost: PostDbType | null =
      await this.postService.findPostById(postId);
    if (foundPost) {
      const foundUser = await this.userService.findUserByDeviceId(req.deviceId);
      if (foundUser) {
        return await this.commentService.createComment(
          inputCommentModel.content,
          foundUser,
          foundPost,
        );
      } else {
        throw new UnauthorizedException();
      }
    } else {
      throw new NotFoundException();
    }
  }

  @Get(':id')
  async findPostById(@Param('id') postId: string) {
    const foundPost = await this.postService.findPostById(postId);
    if (foundPost) {
      return await this.postsQueryRepository.findPostById(postId);
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
    const foundPost = await this.postService.findPostById(postId);
    if (foundPost) {
      await this.postService.updatePostByAdmin(postId, inputPostModel);
    } else {
      throw new NotFoundException();
    }
  }

  @UseGuards(BasicAuthGuard)
  @Delete(':id')
  @HttpCode(204)
  async removePostByAdmin(@Param('id') postId: string) {
    const foundPost = await this.postService.findPostById(postId);
    if (foundPost) {
      await this.postService.removePostByAdmin(postId);
    } else {
      throw new NotFoundException();
    }
  }
}
