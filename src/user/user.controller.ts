import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtGuard } from 'src/auth/guard';
import { GetUser } from "../auth/decorator"
import { User } from '@prisma/client';

@UseGuards(JwtGuard)
@Controller('users')
export class UserController {

    @Get('me')
    getUsers(@GetUser() user: User ) {
        console.log({user})
        return user;
    }
}
