import { InjectModel } from '@nestjs/mongoose';
import {
  CommentLike,
  CommentLikeDocument,
  CommentLikeModelStaticType,
} from '../domain/commentLike.entity';
import { Model } from 'mongoose';

export class CommentLikeService {
  constructor(
    @InjectModel(CommentLike.name)
    private CommentLikeModel: Model<CommentLikeDocument> &
      CommentLikeModelStaticType,
  ) {}
}
