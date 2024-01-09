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
  BlogViewModel,
  BlogWithPaginationViewModel,
  CreateInputBlogModelType,
  UpdateInputBlogModelType,
} from '../feature/model type/BlogViewModel';
import { BlogsService } from './blogs.service';
import { PostsQueryRepository } from '../posts/posts.query.repository';
import {
  CreateInputPostModelType,
  PostsWithPaginationViewModel,
} from '../feature/model type/PostViewModel';
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
      sortByQuery: string | undefined;
      sortDirectionQuery: string | undefined;
      pageNumberQuery: string | undefined;
      pageSizeQuery: string | undefined;
    },
  ) {
    const foundBlogs: BlogWithPaginationViewModel =
      await this.blogQueryRepository.findAllBlogs(
        query.searchNameTerm,
        query.sortByQuery,
        query.sortDirectionQuery,
        query.pageNumberQuery,
        query.pageSizeQuery,
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
    const foundBlog: PostsWithPaginationViewModel =
      await this.postQueryRepository.findPosts(
        query.pageNumber,
        query.pageSize,
        query.sortBy,
        query.sortDirection,
        userId,
        blogId,
      );
    if (foundBlog) {
      return foundBlog;
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
    const foundBlog = await this.blogQueryRepository.findBlogById(blogId);
    if (foundBlog) {
      return foundBlog;
    } else {
      throw new NotFoundException();
    }
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
