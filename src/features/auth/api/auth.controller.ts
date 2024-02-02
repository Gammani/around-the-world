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

@Controller('auth')
export class AuthController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(ThrottlerGuard)
  @Post('registration')
  @HttpCode(HttpStatus.CREATED)
  async registration(@Body() createUserModel: UserCreateModel) {
    return createUserModel;
  }
}
