import { Injectable } from '@nestjs/common';
import { DeviceRepository } from '../infrastructure/device.repository';
import { InjectModel } from '@nestjs/mongoose';
import {
  Device,
  DeviceDocument,
  DeviceModelStaticType,
} from '../domain/devices.entity';
import { Model } from 'mongoose';
import { ObjectId } from 'mongodb';

@Injectable()
export class SecurityDevicesService {
  constructor(
    protected devicesRepository: DeviceRepository,
    @InjectModel(Device.name)
    private DeviceModel: Model<DeviceDocument> & DeviceModelStaticType,
  ) {}
  async findUserIdByDeviceId(deviceId: ObjectId): Promise<ObjectId | null> {
    return this.devicesRepository.findUserIdByDeviceId(deviceId);
  }
  async deleteAllSessionExcludeCurrent(deviceId: ObjectId) {
    await this.devicesRepository.deleteAllSessionExcludeCurrent(deviceId);
    return;
  }
}
