import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import { HydratedDocument } from 'mongoose';

@Schema()
export class Blog {
  _id: ObjectId;

  @Prop({
    required: true,
  })
  name: string;

  @Prop({
    required: true,
  })
  description: string;

  @Prop({
    required: true,
  })
  websiteUrl: string;

  @Prop({
    required: true,
  })
  createdAt: string;

  @Prop({
    required: true,
  })
  isMembership: boolean;
}

export const BlogSchema = SchemaFactory.createForClass(Blog);

export type BlogDocument = HydratedDocument<Blog>;
