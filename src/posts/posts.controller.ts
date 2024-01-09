import { Body, Controller, NotFoundException, Post } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreateInputPostWithBlogIdModelType } from '../feature/model type/PostViewModel';
import { BlogsService } from '../blogs/blogs.service';
import { BlogDocument } from '../blogs/blogs.schema';

@Controller('posts')
export class PostsController {
  constructor(
    private readonly blogService: BlogsService,
    private readonly postService: PostsService,
  ) {}

  // @Get(':postId/comments')

  // @Get()

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

  // @Get('id')

  // @Put('id')

  // @Delete('id')
}
