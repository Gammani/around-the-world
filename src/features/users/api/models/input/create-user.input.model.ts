import { Trim } from '../../../../../infrastructure/decorators/transform/trim';
import { IsEmail, IsString, Length } from 'class-validator';

export class UserCreateModel {
  @Trim()
  @IsString()
  @Length(5, 20)
  login: string;

  @Trim()
  @IsString()
  @Length(5, 20)
  password: string;
  @IsEmail()
  @Length(5, 20)
  email: string;
}
