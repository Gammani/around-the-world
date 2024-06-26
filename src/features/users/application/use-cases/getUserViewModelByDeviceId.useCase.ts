import { CommandHandler } from '@nestjs/cqrs';
import { ObjectId } from 'mongodb';
import { SecurityDevicesService } from '../../../devices/application/security.devices.service';
import { UsersQueryRepository } from '../../infrastructure/users.query.repository';

export class GetUserViewModelByDeviceIdCommand {
  constructor(public deviceId: ObjectId) {}
}

@CommandHandler(GetUserViewModelByDeviceIdCommand)
export class GetUserViewModelByDeviceIdUseCase {
  constructor(
    private securityDevicesService: SecurityDevicesService,
    private usersQueryRepository: UsersQueryRepository,
  ) {}

  async execute(command: GetUserViewModelByDeviceIdCommand) {
    const userId = await this.securityDevicesService.findUserIdByDeviceId(
      command.deviceId,
    );
    if (userId) {
      return await this.usersQueryRepository.findUserById(userId);
    } else {
      return null;
    }
  }
}
