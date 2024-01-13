import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  Post,
  PostDocument,
  PostModelStaticType,
  PostModelWithUriBlogIdStaticType,
} from '../domain/posts.entity';
import { Model } from 'mongoose';
import { PostsRepository } from '../infrastructure/posts.repository';
import {
  PostCreateModel,
  PostCreateModelWithBlogId,
  UpdateInputPostModelType,
} from '../api/models/input/post.input.model';
import { PostViewModel } from '../api/models/output/post.output.model';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post.name)
    private PostModel: Model<PostDocument> &
      PostModelWithUriBlogIdStaticType &
      PostModelStaticType,
    private postsRepository: PostsRepository,
  ) {}

  async findPostById(postId: string): Promise<PostDocument | null> {
    return await this.postsRepository.findPostById(postId);
  }

  async createPostByAdminWithBlogId(
    createInputPostModel: PostCreateModel,
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
    createInputPostModel: PostCreateModelWithBlogId,
    blogName: string,
  ): Promise<PostViewModel> {
    const createdPost = this.PostModel.createPost(
      createInputPostModel,
      blogName,
      this.PostModel,
    );

    return await this.postsRepository.createPostByAdmin(createdPost);
  }

  async updatePostByAdmin(
    postId: string,
    inputPostModel: UpdateInputPostModelType,
  ): Promise<boolean> {
    return await this.postsRepository.updatePostByAdmin(postId, inputPostModel);
  }

  async removePostByAdmin(postId: string): Promise<boolean> {
    return await this.postsRepository.deletePostById(postId);
  }
}
