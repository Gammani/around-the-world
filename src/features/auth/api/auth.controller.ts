import { UsersService } from '../../users/application/users.service';
import {
  Body,
  Controller,
  Headers,
  HttpCode,
  HttpStatus,
  Ip,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { UserCreateModel } from '../../users/api/models/input/create-user.input.model';
import { ThrottlerGuard } from '@nestjs/throttler';
import { AuthService } from '../application/auth.service';
import { ConfirmCodeModel } from './models/input/confirm.code.model';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import {
  AuthInputModel,
  RequestWithUser,
} from './models/input/auth.input.model';
import { SecurityDevicesService } from '../../devices/application/security-devices.service';
import { JwtService } from '../application/jwt.service';
import { DeviceDbType } from '../../types';
import { EmailInputModel } from './models/input/email.input.model';

@UseGuards(ThrottlerGuard)
@Controller('auth')
export class AuthController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
    private readonly securityDevicesService: SecurityDevicesService,
    private readonly jwtService: JwtService,
  ) {}

  @Post('registration')
  @HttpCode(HttpStatus.NO_CONTENT)
  async registration(@Body() createUserModel: UserCreateModel) {
    await this.usersService.createUser(createUserModel);
  }

  @Post('registration-confirmation')
  @HttpCode(HttpStatus.NO_CONTENT)
  async registrationConfirmation(@Body() confirmCodeModel: ConfirmCodeModel) {
    await this.authService.confirmEmail(confirmCodeModel.code);
  }

  @Post('password-recovery')
  @HttpCode(204)
  async passwordRecovery(@Body() emailInputModel: EmailInputModel) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @Body() authInputModel: AuthInputModel,
    @Ip()
    ip: string,
    @Headers('user-agent') deviceName: string,
    @Req() req: RequestWithUser,
    @Res({ passthrough: true }) res: Response,
  ) {
    const device: DeviceDbType = await this.securityDevicesService.addDevice(
      req.user,
      ip,
      deviceName,
    );
    const accessToken = await this.jwtService.createAccessJWT(device._id);
    const refreshToken = await this.jwtService.createRefreshJWT(device._id);
    res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true });

    return accessToken;
  }
}
