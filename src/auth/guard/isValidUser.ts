import { CanActivate, ExecutionContext, UnauthorizedException, Injectable} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ENV_KEYS } from '../../config/appConstants.json';

@Injectable()
export class isValidUser implements CanActivate {
constructor( private config: ConfigService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        console.log(request.user.email);
        return true;
    }
}