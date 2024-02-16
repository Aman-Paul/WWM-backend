import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtGuard, isValidUser } from 'src/auth/guard';
import { GetUser } from "../auth/decorator"

@UseGuards(JwtGuard, isValidUser)
@Controller('users')
export class UserController {

    @Get('me')
    getUsers(@GetUser() user: {} ) {
        console.log({user})
        return user;
    }
}
