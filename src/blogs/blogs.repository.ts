import { Injectable, NotFoundException } from '@nestjs/common';
import { Blog, BlogDocument, BlogModelStaticType } from './blogs.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import {
  CreatedBlogViewModel,
  UpdateInputBlogModelType,
} from '../feature/model type/BlogViewModel';
import { ObjectId } from 'mongodb';

@Injectable()
export class BlogsRepository {
  constructor(
    @InjectModel(Blog.name)
    private BlogModel: Model<BlogDocument> & BlogModelStaticType,
  ) {}

  async createBlogByAdmin(createdBlogDto: any): Promise<CreatedBlogViewModel> {
    const newBlog = await createdBlogDto.save();
    return {
      id: newBlog._id.toString(),
      name: newBlog.name,
      description: newBlog.description,
      websiteUrl: newBlog.websiteUrl,
      createdAt: newBlog.createdAt,
      isMembership: newBlog.isMembership,
    };
  }

  async findBlogById(blogId: string): Promise<BlogDocument | null> {
    if (!ObjectId.isValid(blogId)) {
      throw new NotFoundException();
    }
    return this.BlogModel.findById(blogId);
  }

  async updateBlogByAdmin(
    blogId: string,
    inputBlogModel: UpdateInputBlogModelType,
  ): Promise<boolean> {
    const result = await this.BlogModel.updateOne(
      { _id: blogId },
      {
        $set: {
          name: inputBlogModel.name,
          description: inputBlogModel.description,
          websiteUrl: inputBlogModel.websiteUrl,
        },
      },
    );
    return result.matchedCount === 1;
  }

  async deleteBlog(blogId: string): Promise<boolean> {
    if (!ObjectId.isValid(blogId)) {
      return false;
      // throw new Error('Invalid userId format');
    }
    const result = await this.BlogModel.deleteOne({ _id: blogId });
    return result.deletedCount === 1;
  }

  async deleteAll() {
    await this.BlogModel.deleteMany({});
  }
}
