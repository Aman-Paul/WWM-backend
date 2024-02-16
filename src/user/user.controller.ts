import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtGuard, isValidUser } from 'src/auth/guard';
import { GetUser } from "../auth/decorator"
import { User } from '@prisma/client';

@UseGuards(JwtGuard, isValidUser)
@Controller('users')
export class UserController {

    @Get('me')
    getUsers(@GetUser() user: User ) {
        console.log({user})
        return user;
    }
}
