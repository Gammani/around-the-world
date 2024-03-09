import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  Device,
  DeviceDocument,
  DeviceModelStaticType,
} from '../domain/devices.entity';
import { Model } from 'mongoose';
import { DeviceDbType } from '../../types';
import { ObjectId } from 'mongodb';
import { DeviceViewModel } from '../api/output/device.output.model';

@Injectable()
export class DeviceRepository {
  constructor(
    @InjectModel(Device.name)
    private DeviceModel: Model<DeviceDocument> & DeviceModelStaticType,
  ) {}

  async createDevice(createdDeviceDto: any): Promise<DeviceDbType> {
    return await createdDeviceDto.save();
  }
  async findDeviceByDeviceId(deviceId: ObjectId): Promise<DeviceDbType | null> {
    return this.DeviceModel.findOne({ _id: deviceId });
  }
  async findUserIdByDeviceId(deviceId: ObjectId): Promise<ObjectId | null> {
    debugger;
    const foundUser = await this.DeviceModel.findOne({
      _id: deviceId,
    });
    if (foundUser) {
      return foundUser.userId;
    } else {
      return null;
    }
  }
  async findAndUpdateDeviceAfterRefresh(deviceId: ObjectId) {
    return this.DeviceModel.findOneAndUpdate(
      { _id: deviceId },
      { $set: { lastActiveDate: new Date() } },
    );
  }
  async findAllActiveSessionFromUserId(
    userId: string,
  ): Promise<DeviceViewModel[] | undefined> {
    const result = await this.DeviceModel.find({ userId: userId });
    return result.map((i: DeviceDbType) => ({
      ip: i.ip,
      title: i.deviceName,
      lastActiveDate: i.lastActiveDate,
      deviceId: i._id.toString(),
    }));
  }
  async findDeviceFromUserId(
    deviceId: ObjectId,
    userId: ObjectId,
  ): Promise<boolean> {
    const result = await this.DeviceModel.findOne({
      _id: deviceId,
      userId: userId,
    });
    if (result) {
      return true;
    } else {
      return false;
    }
  }
  async deleteCurrentSessionById(deviceId: ObjectId): Promise<boolean> {
    const result = await this.DeviceModel.deleteOne({ _id: deviceId });
    debugger;
    return result.deletedCount === 1;
  }
  async deleteAllSessionExcludeCurrent(deviceId: ObjectId) {
    this.DeviceModel.deleteMany({
      _id: { $ne: deviceId },
    });
    return;
  }
  async deleteAll() {
    this.DeviceModel.deleteMany({});
    return;
  }
}
