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
import { DeviceDbType } from '../../types';

@Injectable()
export class SecurityDevicesService {
  constructor(
    protected deviceRepository: DeviceRepository,
    @InjectModel(Device.name)
    private DeviceMode: Model<DeviceDocument> & DeviceModelStaticType,
  ) {}

  async addDevice(
    userId: ObjectId,
    ip: string,
    deviceName: string,
  ): Promise<DeviceDbType> {
    const createDevice = this.DeviceMode.createDevice(
      userId,
      ip,
      deviceName,
      this.DeviceMode,
    );
    return await this.deviceRepository.createDevice(createDevice);
  }
}
