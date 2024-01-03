import { ObjectId } from 'mongodb';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema()
export class AccountData {
  @Prop({
    required: true,
  })
  login: string;

  @Prop({
    required: true,
  })
  email: string;

  @Prop({
    required: true,
  })
  createdAt: string;

  @Prop({
    required: true,
  })
  passwordHash: string;

  @Prop({
    required: true,
  })
  recoveryCode: string;
}

@Schema()
export class EmailConfirmation {
  @Prop({
    required: true,
  })
  confirmationCode: string;

  @Prop({
    required: true,
  })
  expirationDate: Date;

  @Prop({
    required: true,
  })
  isConfirmed: boolean;
}

@Schema()
export class User {
  _id: ObjectId;

  @Prop({
    required: true,
  })
  accountData: AccountData;

  @Prop({
    required: true,
  })
  emailConfirmation: EmailConfirmation;
}

export const UserSchema = SchemaFactory.createForClass(User);

export type UserDocument = HydratedDocument<User>;
