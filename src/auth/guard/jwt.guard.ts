import { CanActivate, ExecutionContext, UnauthorizedException, Injectable} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ENV_KEYS } from '../../config/appConstants.json';

@Injectable()
export class JwtGuard implements CanActivate {
constructor(private jwt: JwtService, private config: ConfigService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const token = request.headers.token;
        if (!token) {
            throw new UnauthorizedException();
        }
        try {
            const payload = await this.jwt.verifyAsync(
                token, {
                    secret: this.config.get(ENV_KEYS.JWT_SECRET_KEY)
                }
            );
            request['user'] = payload;
        } catch(e) {
            throw new UnauthorizedException();
        }
        return true;
    }
}