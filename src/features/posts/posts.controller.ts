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
} from '@nestjs/common';
import { PostsService } from './posts.service';
import {
  CreateInputPostWithBlogIdModelType,
  PostsWithPaginationViewModel,
  UpdateInputPostModelType,
} from '../../feature/model type/PostViewModel';
import { BlogsService } from '../blogs/blogs.service';
import { BlogDocument } from '../blogs/blogs.schema';
import { PostDocument } from './posts.schema';
import { CommentsWithPaginationViewModel } from '../../feature/model type/CommentViewModel';
import { CommentsQueryRepository } from '../comments/comments.query.repository';
import { PostsQueryRepository } from './posts.query.repository';

@Controller('posts')
export class PostsController {
  constructor(
    private readonly blogService: BlogsService,
    private readonly postService: PostsService,
    private readonly commentsQueryRepository: CommentsQueryRepository,
    private readonly postsQueryRepository: PostsQueryRepository,
  ) {}

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
    const foundPost: PostDocument | null =
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

  @Post()
  async createPostByAdmin(
    @Body() inputPostModel: CreateInputPostWithBlogIdModelType,
  ) {
    const foundBlog: BlogDocument | null = await this.blogService.findBlogById(
      inputPostModel.blogId,
    );
    // const createdDto =
    if (foundBlog) {
      return await this.postService.createPostByAdmin(
        inputPostModel,
        foundBlog.name,
      );
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
