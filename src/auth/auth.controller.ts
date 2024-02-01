import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserSigninDto, UserSignupDto } from './dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('signup')
    signup(@Body() dto: UserSignupDto) {
        return this.authService.signup(dto);
    }

    @Post('signin')
    signin(@Body() dto: UserSigninDto) {
        return this.authService.signin(dto);
    }
}
