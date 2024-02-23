import { Trim } from '../../../../../infrastructure/decorators/transform/trim';
import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class EmailInputModel {
  @Trim()
  @IsString()
  @IsNotEmpty()
  @Matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
  email: string;
}
