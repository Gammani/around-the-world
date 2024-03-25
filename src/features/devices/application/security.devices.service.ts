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
import { ExpiredTokenRepository } from '../../expiredToken/infrastructure/expired.token.repository';

@Injectable()
export class SecurityDevicesService {
  constructor(
    protected devicesRepository: DeviceRepository,
    @InjectModel(Device.name)
    private DeviceModel: Model<DeviceDocument> & DeviceModelStaticType,
    private expiredTokenRepository: ExpiredTokenRepository,
  ) {}

  async addDevice(
    userId: ObjectId,
    ip: string,
    deviceName: string,
  ): Promise<DeviceDbType> {
    const createDevice = this.DeviceModel.createDevice(
      userId,
      ip,
      deviceName,
      this.DeviceModel,
    );
    return await this.devicesRepository.createDevice(createDevice);
  }
  async addExpiredRefreshToken(deviceId: ObjectId, refreshToken: string) {
    const foundUserId = await this.findUserIdByDeviceId(deviceId);
    debugger;
    if (foundUserId) {
      return await this.expiredTokenRepository.addExpiredRefreshToken(
        foundUserId,
        refreshToken,
      );
    }
  }
  async findUserIdByDeviceId(deviceId: ObjectId): Promise<ObjectId | null> {
    return this.devicesRepository.findUserIdByDeviceId(deviceId);
  }
  async findAndUpdateDeviceAfterRefresh(deviceId: ObjectId) {
    return await this.devicesRepository.findAndUpdateDeviceAfterRefresh(
      deviceId,
    );
  }
  async findDeviceFromUserId(deviceId: ObjectId, userId: ObjectId) {
    return this.devicesRepository.findDeviceFromUserId(deviceId, userId);
  }
  async deleteCurrentSessionById(deviceId: ObjectId): Promise<boolean> {
    return await this.devicesRepository.deleteCurrentSessionById(deviceId);
  }
  async deleteAllSessionExcludeCurrent(deviceId: ObjectId) {
    await this.devicesRepository.deleteAllSessionExcludeCurrent(deviceId);
    return;
  }
}
