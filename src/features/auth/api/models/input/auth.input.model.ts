import { Trim } from '../../../../../infrastructure/decorators/transform/trim';
import { IsNotEmpty, IsString } from 'class-validator';
import { ObjectId } from 'mongodb';

export class AuthInputModel {
  @Trim()
  @IsString()
  @IsNotEmpty()
  loginOrEmail: string;

  @Trim()
  @IsString()
  @IsNotEmpty()
  password: string;
}

export interface RequestWithUser extends Request {
  user: ObjectId; // предположим, что user имеет тип ObjectId
}

export interface RequestWithDeviceId extends Request {
  deviceId: ObjectId;
  cookies?: string;
}

export interface RequestWithUserId extends Request {
  user?: { userId: ObjectId | null | undefined };
}
