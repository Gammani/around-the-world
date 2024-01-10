import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  Post,
  PostDocument,
  PostModelWithUriBlogIdStaticType,
} from './posts.schema';
import { Model } from 'mongoose';
import {
  PostViewModel,
  UpdateInputPostModelType,
} from '../feature/model type/PostViewModel';
import { LikeStatus } from '../feature/types';
import { ObjectId } from 'mongodb';

@Injectable()
export class PostsRepository {
  constructor(
    @InjectModel(Post.name)
    private PostModel: Model<PostDocument & PostModelWithUriBlogIdStaticType>,
  ) {}

  async findPostById(postId: string): Promise<PostDocument | null> {
    if (!ObjectId.isValid(postId)) {
      throw new NotFoundException();
    } else {
      return this.PostModel.findById(postId);
    }
  }

  async createPostByAdmin(createdPostDto: any): Promise<PostViewModel> {
    const newPost = await createdPostDto.save();

    return {
      id: newPost._id.toString(),
      title: newPost.title,
      shortDescription: newPost.shortDescription,
      content: newPost.content,
      blogId: newPost.blogId.toString(),
      blogName: newPost.blogName,
      createdAt: newPost.createdAt,
      extendedLikesInfo: {
        likesCount: 0,
        dislikesCount: 0,
        myStatus: LikeStatus.None,
        newestLikes: [],
      },
    };
  }

  async updatePostByAdmin(
    postId: string,
    inputPostModel: UpdateInputPostModelType,
  ): Promise<boolean> {
    const result = await this.PostModel.updateOne(
      { _id: new ObjectId(postId) },
      {
        $set: {
          title: inputPostModel.title,
          shortDescription: inputPostModel.shortDescription,
          content: inputPostModel.content,
          blogId: inputPostModel.blogId,
        },
      },
    );
    return result.matchedCount === 1;
  }

  async deletePostById(postId: string): Promise<boolean> {
    if (!ObjectId.isValid(postId)) {
      throw new NotFoundException();
    }
    const result = await this.PostModel.deleteOne({
      _id: new ObjectId(postId),
    });
    return result.deletedCount === 1;
  }

  async deleteAllPostsByBlogId(blogId: string) {
    await this.PostModel.deleteMany({ blogId: new ObjectId(blogId) });
    return;
  }

  async deleteAll() {
    await this.PostModel.deleteMany({});
  }
}
