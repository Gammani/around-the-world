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
import { BlogsQueryRepository } from './blogs.query.repository';
import {
  BlogWithPaginationViewModel,
  CreateInputBlogModelType,
  UpdateInputBlogModelType,
} from '../../feature/model type/BlogViewModel';
import { BlogsService } from './blogs.service';
import { PostsQueryRepository } from '../posts/posts.query.repository';
import {
  CreateInputPostModelType,
  PostsWithPaginationViewModel,
} from '../../feature/model type/PostViewModel';
import { PostsService } from '../posts/posts.service';
import { BlogDocument } from './blogs.schema';

@Controller('blogs')
export class BlogsController {
  constructor(
    private readonly blogQueryRepository: BlogsQueryRepository,
    private readonly blogService: BlogsService,
    private readonly postQueryRepository: PostsQueryRepository,
    private readonly postsService: PostsService,
  ) {}

  @Get()
  async getAllBlogs(
    @Query()
    query: {
      searchNameTerm: string | undefined;
      sortBy: string | undefined;
      sortDirection: string | undefined;
      pageNumber: string | undefined;
      pageSize: string | undefined;
    },
  ) {
    const foundBlogs: BlogWithPaginationViewModel =
      await this.blogQueryRepository.findAllBlogs(
        query.searchNameTerm,
        query.sortBy,
        query.sortDirection,
        query.pageNumber,
        query.pageSize,
      );
    return foundBlogs;
  }

  @Post()
  async createBlogByAdmin(@Body() inputBlogModel: CreateInputBlogModelType) {
    return this.blogService.createBlogByAdmin(inputBlogModel);
  }

  @Get(':blogId/posts')
  async getPostsByBlogId(
    @Param('blogId') blogId: string,
    @Query()
    query: {
      pageNumber: string | undefined;
      pageSize: string | undefined;
      sortBy: string | undefined;
      sortDirection: string | undefined;
    },
    @Body() userId?: string,
  ) {
    const foundBlogById = await this.blogService.findBlogById(blogId);
    if (foundBlogById) {
      const foundPostsByBlogId: PostsWithPaginationViewModel =
        await this.postQueryRepository.findPosts(
          query.pageNumber,
          query.pageSize,
          query.sortBy,
          query.sortDirection,
          userId,
          blogId,
        );
      return foundPostsByBlogId;
    } else {
      throw new NotFoundException();
    }
  }

  @Post(':blogId/posts')
  async createPostByBlogIdByAdmin(
    @Param('blogId') blogId: string,
    @Body() inputPostModel: CreateInputPostModelType,
  ) {
    const foundBlog: BlogDocument | null =
      await this.blogService.findBlogById(blogId);
    if (foundBlog) {
      return await this.postsService.createPostByAdminWithBlogId(
        inputPostModel,
        foundBlog.id,
        foundBlog.name,
      );
    } else {
      throw new NotFoundException();
    }
  }

  @Get(':id')
  async findBlogById(@Param('id') blogId: string) {
    return await this.blogQueryRepository.findBlogById(blogId);
  }

  @Put(':id')
  @HttpCode(204)
  async updateBlogByAdmin(
    @Param('id') blogId: string,
    @Body() inputBlogModel: UpdateInputBlogModelType,
  ) {
    const foundBlog = await this.blogService.findBlogById(blogId);
    if (foundBlog) {
      await this.blogService.updateBlogByAdmin(blogId, inputBlogModel);
    } else {
      throw new NotFoundException();
    }
  }

  @Delete(':id')
  @HttpCode(204)
  async removeBlogByAdmin(@Param('id') blogId: string) {
    const blogRemoved = await this.blogService.removeBlogByAdmin(blogId);
    if (!blogRemoved) {
      throw new NotFoundException();
    }
  }
}
