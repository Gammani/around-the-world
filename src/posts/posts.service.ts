import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  Post,
  PostDocument,
  PostModelStaticType,
  PostModelWithUriBlogIdStaticType,
} from './posts.schema';
import { Model } from 'mongoose';
import { PostsRepository } from './posts.repository';
import {
  CreateInputPostModelType,
  CreateInputPostWithBlogIdModelType,
  PostViewModel,
} from '../feature/model type/PostViewModel';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post.name)
    private PostModel: Model<PostDocument> &
      PostModelWithUriBlogIdStaticType &
      PostModelStaticType,
    private postsRepository: PostsRepository,
  ) {}

  async createPostByAdminWithBlogId(
    createInputPostModel: CreateInputPostModelType,
    blogId: string,
    blogName: string,
  ): Promise<PostViewModel> {
    const createdPost = this.PostModel.createPostWithUriBlogId(
      createInputPostModel,
      blogId,
      blogName,
      this.PostModel,
    );

    return await this.postsRepository.createPostByAdmin(createdPost);
  }

  async createPostByAdmin(
    createInputPostModel: CreateInputPostWithBlogIdModelType,
    blogName: string,
  ): Promise<PostViewModel> {
    const createdPost = this.PostModel.createPost(
      createInputPostModel,
      blogName,
      this.PostModel,
    );

    return await this.postsRepository.createPostByAdmin(createdPost);
  }
}
