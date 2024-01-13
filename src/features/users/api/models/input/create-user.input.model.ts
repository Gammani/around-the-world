import { Trim } from '../../../../../infrastructure/decorators/transform/trim';
import { IsNotEmpty, IsString, Length, Matches } from 'class-validator';

export class UserCreateModel {
  @Trim()
  @Matches(/^[a-zA-Z0-9_-]*$/)
  @IsString()
  @Length(3, 10)
  @IsNotEmpty()
  login: string;

  @Trim()
  @IsString()
  @Length(6, 20)
  @IsNotEmpty()
  password: string;

  @Trim()
  @Matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
  @IsNotEmpty()
  email: string;
}
