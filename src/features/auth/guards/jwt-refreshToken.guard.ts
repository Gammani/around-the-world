import { AuthGuard } from '@nestjs/passport';
import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ExpiredTokenRepository } from '../../expiredToken/infrastructure/expired.token.repository';
import { JwtService } from '../application/jwt.service';
import { TokenPayloadType } from '../../types';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}

@Injectable()
export class CheckRefreshToken {
  constructor(
    private expiredTokenRepository: ExpiredTokenRepository,
    private jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<any> {
    debugger;
    const req = context.switchToHttp().getRequest();

    const cookieRefreshToken = req.cookies.refreshToken;
    if (!cookieRefreshToken) throw new UnauthorizedException();

    const foundTokenFromExpiredTokens =
      await this.expiredTokenRepository.findToken(cookieRefreshToken);
    if (foundTokenFromExpiredTokens) throw new UnauthorizedException();

    const isExpiredToken =
      await this.expiredTokenRepository.isExpiredToken(cookieRefreshToken);
    if (isExpiredToken) throw new UnauthorizedException();

    const foundDeviceIdByRefreshToken: TokenPayloadType | null =
      await this.jwtService.verifyRefreshToken(cookieRefreshToken);
    if (foundDeviceIdByRefreshToken) {
      req.deviceId = foundDeviceIdByRefreshToken.deviceId;
    } else {
      throw new UnauthorizedException();
    }
    return true;
  }
}
