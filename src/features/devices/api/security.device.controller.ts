import { SecurityDevicesService } from '../application/security.devices.service';
import {
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import { DeviceQueryRepository } from '../infrastructure/device.query.repository';
import { Request } from 'express';
import { RequestWithDeviceId } from '../../auth/api/models/input/auth.input.model';
import { UsersService } from '../../users/application/users.service';
import { UserDbType } from '../../types';
import { DeleteCurrentSessionByIdCommand } from '../application/use-cases/deleteCurrentSessionById.useCase';
import { CommandBus } from '@nestjs/cqrs';
import { CheckRefreshToken } from '../../auth/guards/jwt-refreshToken.guard';
import { GetDeviceByDeviceIdCommand } from '../application/use-cases/getDeviceByDeviceId.useCase';

@UseGuards(CheckRefreshToken)
@Controller('security/devices')
export class SecurityDeviceController {
  constructor(
    private securityDeviceService: SecurityDevicesService,
    private deviceQueryRepository: DeviceQueryRepository,
    private userService: UsersService,
    private commandBus: CommandBus,
  ) {}

  @Get()
  async getAllDevicesFromUser(@Req() req: Request & RequestWithDeviceId) {
    const foundUser: UserDbType | null =
      await this.userService.findUserByDeviceId(req.deviceId);
    if (foundUser)
      return await this.deviceQueryRepository.findAllActiveSessionFromUserId(
        foundUser._id,
      );
  }

  @Delete()
  async terminateAllExcludeCurrentSession(
    @Req() req: Request & RequestWithDeviceId,
  ) {
    await this.securityDeviceService.deleteAllSessionExcludeCurrent(
      req.deviceId,
    );
  }

  @Delete(':deviceId')
  async terminateSessionById(
    @Req() req: Request & RequestWithDeviceId,
    @Param('deviceId') deviceId: string,
  ) {
    const foundDevice = await this.commandBus.execute(
      new GetDeviceByDeviceIdCommand(deviceId),
    );
    if (foundDevice) {
      await this.commandBus.execute(
        new DeleteCurrentSessionByIdCommand(deviceId),
      );
    } else {
      throw new NotFoundException();
    }
  }
}
