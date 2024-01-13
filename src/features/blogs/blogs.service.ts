import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Blog, BlogDocument, BlogModelStaticType } from './blogs.schema';
import { Model } from 'mongoose';
import {
  CreatedBlogViewModel,
  CreateInputBlogModelType,
  UpdateInputBlogModelType,
} from '../../feature/model type/BlogViewModel';
import { BlogsRepository } from './blogs.repository';
import { PostsRepository } from '../posts/posts.repository';

@Injectable()
export class BlogsService {
  constructor(
    private blogsRepository: BlogsRepository,
    private postsRepository: PostsRepository,

    @InjectModel(Blog.name)
    private BlogModel: Model<BlogDocument> & BlogModelStaticType,
  ) {}

  async findBlogById(blogId: string) {
    return await this.blogsRepository.findBlogById(blogId);
  }

  async createBlogByAdmin(
    inputBlogModel: CreateInputBlogModelType,
  ): Promise<CreatedBlogViewModel> {
    const createdBlog = this.BlogModel.createBlog(
      inputBlogModel,
      this.BlogModel,
    );

    return await this.blogsRepository.createBlogByAdmin(createdBlog);
  }

  async updateBlogByAdmin(
    blogId: string,
    inputBlogModel: UpdateInputBlogModelType,
  ): Promise<boolean> {
    return await this.blogsRepository.updateBlogByAdmin(blogId, inputBlogModel);
  }

  async removeBlogByAdmin(blogId: string): Promise<boolean> {
    await this.postsRepository.deleteAllPostsByBlogId(blogId);
    return await this.blogsRepository.deleteBlog(blogId);
  }
}
