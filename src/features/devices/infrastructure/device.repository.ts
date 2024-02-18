import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  Device,
  DeviceDocument,
  DeviceModelStaticType,
} from '../domain/devices.entity';
import { Model } from 'mongoose';
import { DeviceDbType } from '../../types';

@Injectable()
export class DeviceRepository {
  constructor(
    @InjectModel(Device.name)
    private DeviceModel: Model<DeviceDocument> & DeviceModelStaticType,
  ) {}

  async createDevice(createdDeviceDto: any): Promise<DeviceDbType> {
    return await createdDeviceDto.save();
  }
}
