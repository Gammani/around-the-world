import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  Blog,
  BlogDocument,
  BlogModelStaticType,
} from '../domain/blogs.entity';
import { Model } from 'mongoose';
import { BlogsRepository } from '../infrastructure/blogs.repository';
import { PostsRepository } from '../../posts/infrastructure/posts.repository';
import { CreatedBlogViewModel } from '../api/models/output/blog.output.model';
import {
  BlogCreateModel,
  BlogUpdateModel,
} from '../api/models/input/blog.input.model';
import { BlogDbType } from '../../types';

@Injectable()
export class BlogsService {
  constructor(
    private blogsRepository: BlogsRepository,
    private postsRepository: PostsRepository,

    @InjectModel(Blog.name)
    private BlogModel: Model<BlogDocument> & BlogModelStaticType,
  ) {}

  async findBlogById(blogId: string): Promise<BlogDbType | null> {
    return await this.blogsRepository.findBlogById(blogId);
  }

  async createBlogByAdmin(
    inputBlogModel: BlogCreateModel,
  ): Promise<CreatedBlogViewModel> {
    const createdBlog = this.BlogModel.createBlog(
      inputBlogModel,
      this.BlogModel,
    );

    return await this.blogsRepository.createBlogByAdmin(createdBlog);
  }

  async updateBlogByAdmin(
    blogId: string,
    inputBlogModel: BlogUpdateModel,
  ): Promise<boolean> {
    // логика
    return await this.blogsRepository.updateBlogByAdmin(blogId, inputBlogModel);
  }

  async removeBlogByAdmin(blogId: string): Promise<boolean> {
    await this.postsRepository.deleteAllPostsByBlogId(blogId);
    return await this.blogsRepository.deleteBlog(blogId);
  }
}
