import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeviceDbType } from '../../../types';
import { DeviceRepository } from '../../infrastructure/device.repository';

export class GetDeviceByDeviceIdCommand {
  constructor(public deviceId: string) {}
}

@CommandHandler(GetDeviceByDeviceIdCommand)
export class GetDeviceByDeviceIdUseCase
  implements ICommandHandler<GetDeviceByDeviceIdCommand>
{
  constructor(private deviceRepository: DeviceRepository) {}

  async execute(
    command: GetDeviceByDeviceIdCommand,
  ): Promise<DeviceDbType | null> {
    return await this.deviceRepository.findDeviceByDeviceId(command.deviceId);
  }
}
