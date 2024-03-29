import { UsersService } from '../../users/application/users.service';
import {
  BadRequestException,
  Body,
  Controller,
  Get,
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
  RequestWithDeviceId,
  RequestWithUser,
} from './models/input/auth.input.model';
import { SecurityDevicesService } from '../../devices/application/security.devices.service';
import { JwtService } from '../application/jwt.service';
import { DeviceDbType } from '../../types';
import { EmailInputModel } from './models/input/email.input.model';
import { NewPasswordModel } from './models/input/new.password.model';
import { CheckRefreshToken } from '../guards/jwt-auth.guard';
import { Request } from 'express';

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
  async passwordRecovery(@Body() emailInputModel: EmailInputModel) {
    await this.authService.passwordRecovery(emailInputModel.email);
  }

  @Post('new-password')
  @HttpCode(204)
  async newPassword(@Body() newPasswordModel: NewPasswordModel) {
    const foundUser = await this.usersService.findUserByRecoveryCode(
      newPasswordModel.recoveryCode,
    );
    if (foundUser) {
      await this.usersService.updatePassword(
        newPasswordModel.newPassword,
        newPasswordModel.recoveryCode,
      );
    }
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(200)
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
    res.cookie('refreshToken', refreshToken, {
      httpOnly: false,
      secure: false,
    });
    return { accessToken: accessToken };
  }

  @UseGuards(CheckRefreshToken)
  @Post('refresh-token')
  async refreshToken(
    @Req() req: Request & RequestWithDeviceId,
    @Res({ passthrough: true }) res: Response,
  ) {
    debugger;
    await this.securityDevicesService.addExpiredRefreshToken(
      req.deviceId,
      req.cookies.refreshToken,
    );

    const accessToken = await this.jwtService.createAccessJWT(req.deviceId);
    const refreshToken = await this.jwtService.createRefreshJWT(req.deviceId);
    res.cookie('refreshToken', refreshToken, {
      httpOnly: false,
      secure: false,
    });
    return accessToken;
  }

  @Post('registration-email-resending')
  @HttpCode(204)
  async registrationEmailResending(@Body() emailInputModel: EmailInputModel) {
    await this.authService.resendCode(emailInputModel.email);
  }

  @UseGuards(CheckRefreshToken)
  @Post('logout')
  @HttpCode(204)
  async logout(
    @Req() req: Request & RequestWithDeviceId,
    @Res({ passthrough: true }) res: Response,
  ) {
    await this.securityDevicesService.deleteCurrentSessionById(req.deviceId);
    res.cookie('refreshToken', '', { httpOnly: false, secure: false });
  }

  @UseGuards(CheckRefreshToken)
  @Get('me')
  async me(@Req() req: Request & RequestWithDeviceId) {
    return await this.usersService.findUserViewModelByDeviceId(req.deviceId);
  }
}
