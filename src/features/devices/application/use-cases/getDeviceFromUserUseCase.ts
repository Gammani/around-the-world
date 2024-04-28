import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeviceDbType } from '../../../types';
import { DeviceRepository } from '../../infrastructure/device.repository';
import { ObjectId } from 'mongodb';

export class GetDeviceFromUserCommand {
  constructor(
    public deviceIdFromUri: string,
    public deviceIdFromToken: ObjectId,
  ) {}
}

@CommandHandler(GetDeviceFromUserCommand)
export class GetDeviceFromUserUseCase
  implements ICommandHandler<GetDeviceFromUserCommand>
{
  constructor(private deviceRepository: DeviceRepository) {}

  async execute(command: GetDeviceFromUserCommand): Promise<boolean> {
    const foundUserId: ObjectId | null =
      await this.deviceRepository.findUserIdByDeviceId(
        command.deviceIdFromToken,
      );
    if (foundUserId) {
      return await this.deviceRepository.findDeviceFromUserId(
        command.deviceIdFromUri,
        foundUserId,
      );
    } else {
      return false;
    }
  }
}
