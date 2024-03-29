import { Trim } from '../../../../../infrastructure/decorators/transform/trim';
import { IsNotEmpty, IsString, Matches } from 'class-validator';
import { EmailIsExist } from '../../../../../infrastructure/decorators/validate/email.isExist.decorator';

export class EmailInputModel {
  @Trim()
  @IsString()
  @IsNotEmpty()
  @EmailIsExist()
  @Matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
  email: string;
}
