import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import { HydratedDocument, Model } from 'mongoose';

export type DeviceDocument = HydratedDocument<Device>;

@Schema()
export class Device {
  _id: ObjectId;

  @Prop({
    required: true,
  })
  userId: ObjectId;

  @Prop({
    required: true,
  })
  ip: string;

  @Prop({
    required: true,
  })
  deviceName: string;
  @Prop({
    required: true,
  })
  lastActiveDate: string;
}

export const DeviceSchema = SchemaFactory.createForClass(Device);

DeviceSchema.statics.createDevice = (
  userId: ObjectId,
  ip: string,
  deviceName: string,
  DeviceModel: Model<DeviceDocument> & DeviceModelStaticType,
): DeviceDocument => {
  const device = new DeviceModel();
  device._id = new ObjectId();
  device.userId = userId;
  device.ip = ip;
  device.deviceName = deviceName || 'unknown';
  device.lastActiveDate = new Date().toISOString();

  return device;
};

export type DeviceModelStaticType = {
  createDevice: (
    userId: ObjectId,
    ip: string,
    deviceName: string,
    DeviceModel: Model<DeviceDocument> & DeviceModelStaticType,
  ) => {
    _id: ObjectId;
    userId: ObjectId;
    ip: string;
    deviceName: string;
    lastActiveDate: string;
  };
};
