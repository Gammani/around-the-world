import { ObjectId } from 'mongodb';

export enum LikeStatus {
  Like = 'Like',
  Dislike = 'Dislike',
  None = 'None',
}

type AccountDataType = {
  login: string;
  email: string;
  createdAt: string;
  passwordHash: string;
  recoveryCode: string;
};
type EmailConfirmationType = {
  confirmationCode: string;
  expirationDate: string;
  isConfirmed: boolean;
};
export type UserDbType = {
  _id: ObjectId;
  accountData: AccountDataType;
  emailConfirmation: EmailConfirmationType;
};
export type DeviceDbType = {
  _id: ObjectId;
  userId: ObjectId;
  ip: string;
  deviceName: string;
  lastActiveDate: string;
};
export type TokenPayloadType = {
  deviceId: ObjectId;
  iat?: string;
  exp?: string;
};
