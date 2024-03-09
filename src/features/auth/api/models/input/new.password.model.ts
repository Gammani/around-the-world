import { Trim } from '../../../../../infrastructure/decorators/transform/trim';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class NewPasswordModel {
  @Trim()
  @IsString()
  @Length(6, 20)
  @IsNotEmpty()
  newPassword: string;

  @Trim()
  @IsString()
  @IsNotEmpty()
  recoveryCode: string;
}
