import { SecurityDevicesService } from '../application/security.devices.service';
import {
  Controller,
  Delete,
  ForbiddenException,
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
import { FoundDeviceFromUserCommand } from '../application/use-cases/foundDeviceFromUserUseCase';
import { GetUserByDeviceIdCommand } from '../../users/application/use-cases/getUserByDeviceId.useCase';
import { ObjectId } from 'mongodb';

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
    // нашли юзера из токена
    const foundUserByDeviceIdFromToken: UserDbType | null =
      await this.commandBus.execute(new GetUserByDeviceIdCommand(req.deviceId));
    // есть ли юзер у девайса из ури парам
    const foundUserFromUriParam = await this.commandBus.execute(
      new GetUserByDeviceIdCommand(new ObjectId(deviceId)),
    );
    // if (foundUserFromUriParam !== foundUserByDeviceIdFromToken) {
    //   throw new ForbiddenException();
    // }

    // есть ли у юзера из токена такой айди
    if (!foundUserByDeviceIdFromToken) {
      throw new NotFoundException();
    }

    // а юзер из токена к своему айди стучится
    if (foundUserFromUriParam !== foundUserByDeviceIdFromToken) {
      throw new ForbiddenException();
    }
    await this.commandBus.execute(
      new DeleteCurrentSessionByIdCommand(deviceId),
    );

    // if (foundUserByDeviceIdFromToken) {
    //   await this.commandBus.execute(
    //     new DeleteCurrentSessionByIdCommand(deviceId),
    //   );
    // } else {
    //   if (foundUserFromUriParam !== foundUserByDeviceIdFromToken) {
    //     throw new ForbiddenException();
    //   }
    //
    //   throw new NotFoundException();
    // }
  }
}
