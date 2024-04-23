import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PostsQueryRepository } from '../../infrastructure/posts.query.repository';

export class GetQueryPostByIdCommand {
  constructor(
    public postId: string,
    // public userId?: string,
  ) {}
}

@CommandHandler(GetQueryPostByIdCommand)
export class GetQueryPostByIdUseCase
  implements ICommandHandler<GetQueryPostByIdCommand>
{
  constructor(private readonly postsQueryRepository: PostsQueryRepository) {}

  async execute(command: GetQueryPostByIdCommand) {
    return await this.postsQueryRepository.findPostById(command.postId);
  }
}
