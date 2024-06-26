import { Trim } from '../../../../../infrastructure/decorators/transform/trim';
import { IsNotEmpty, IsString, Length } from 'class-validator';
import { BlogIdIsExist } from '../../../../../infrastructure/decorators/validate/blogId.isExist.decorator';

export class PostCreateModel {
  @Trim()
  @IsString()
  @Length(1, 30)
  @IsNotEmpty()
  title: string;

  @Trim()
  @IsString()
  @Length(1, 100)
  @IsNotEmpty()
  shortDescription: string;

  @Trim()
  @IsString()
  @Length(1, 1000)
  @IsNotEmpty()
  content: string;
}
export class PostCreateModelWithBlogId {
  @Trim()
  @IsString()
  @Length(1, 30)
  @IsNotEmpty()
  title: string;

  @Trim()
  @IsString()
  @Length(1, 100)
  @IsNotEmpty()
  shortDescription: string;

  @Trim()
  @IsString()
  @Length(1, 1000)
  @IsNotEmpty()
  content: string;

  @IsString()
  @IsNotEmpty()
  @BlogIdIsExist()
  @Length(24, 24)
  blogId: string;
}
export class UpdateInputPostModelType {
  @Trim()
  @IsString()
  @Length(1, 30)
  @IsNotEmpty()
  title: string;

  @Trim()
  @IsString()
  @Length(1, 100)
  @IsNotEmpty()
  shortDescription: string;

  @Trim()
  @IsString()
  @Length(1, 1000)
  @IsNotEmpty()
  content: string;

  @IsString()
  @IsNotEmpty()
  @BlogIdIsExist()
  @Length(24, 24)
  blogId: string;
}
