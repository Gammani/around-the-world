import { UsersService } from '../../users/application/users.service';
import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UserCreateModel } from '../../users/api/models/input/create-user.input.model';
import { ThrottlerGuard } from '@nestjs/throttler';

@UseGuards(ThrottlerGuard)
@Controller('auth')
export class AuthController {
  constructor(private readonly usersService: UsersService) {}

  @Post('registration')
  @HttpCode(HttpStatus.NO_CONTENT)
  async registration(@Body() createUserModel: UserCreateModel) {
    await this.usersService.createUser(createUserModel);
  }
}
