import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtGuard } from './guard/jwt.guard';
import { UserSigninDto, UserSignupDto, ForgetPasswordDto } from './dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('signup')
    signup(@Body() dto: UserSignupDto) {
        return this.authService.signup(dto);
    }

    @HttpCode(HttpStatus.OK) // Overrides the default 201 (Created) status code
    @Post('signin')
    signin(@Body() dto: UserSigninDto) {
        return this.authService.signin(dto);
    }

    @Post("forget-password")
    forgetPassword(@Body() dto: ForgetPasswordDto) {
        return this.authService.forgetPassword(dto);
    }
}
