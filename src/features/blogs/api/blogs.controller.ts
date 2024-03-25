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
  UseGuards,
} from '@nestjs/common';
import { BlogsQueryRepository } from '../infrastructure/blogs.query.repository';
import { BlogsService } from '../application/blogs.service';
import { PostsQueryRepository } from '../../posts/infrastructure/posts.query.repository';
import { PostsService } from '../../posts/application/posts.service';
import { BlogWithPaginationViewModel } from './models/output/blog.output.model';
import {
  BlogCreateModel,
  BlogUpdateModel,
} from './models/input/blog.input.model';
import { PostsWithPaginationViewModel } from '../../posts/api/models/output/post.output.model';
import { PostCreateModel } from '../../posts/api/models/input/post.input.model';
import { BlogDbType } from '../../types';
import { BasicAuthGuard } from '../../auth/guards/basic-auth.guard';

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

  @UseGuards(BasicAuthGuard)
  @Post()
  async createBlogByAdmin(@Body() inputBlogModel: BlogCreateModel) {
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

  @UseGuards(BasicAuthGuard)
  @Post(':blogId/posts')
  async createPostByBlogIdByAdmin(
    @Param('blogId') blogId: string,
    @Body() inputPostModel: PostCreateModel,
  ) {
    const foundBlog: BlogDbType | null =
      await this.blogService.findBlogById(blogId);
    if (foundBlog) {
      return await this.postsService.createPostByAdminWithBlogId(
        inputPostModel,
        foundBlog._id,
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

  @UseGuards(BasicAuthGuard)
  @Put(':id')
  @HttpCode(204)
  async updateBlogByAdmin(
    @Param('id') blogId: string,
    @Body() inputBlogModel: BlogUpdateModel,
  ) {
    const foundBlog = await this.blogService.findBlogById(blogId);
    if (foundBlog) {
      await this.blogService.updateBlogByAdmin(blogId, inputBlogModel);
    } else {
      throw new NotFoundException();
    }
  }

  @UseGuards(BasicAuthGuard)
  @Delete(':id')
  @HttpCode(204)
  async removeBlogByAdmin(@Param('id') blogId: string) {
    const blogRemoved = await this.blogService.removeBlogByAdmin(blogId);
    if (!blogRemoved) {
      throw new NotFoundException();
    }
  }
}
