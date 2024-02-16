import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtGuard, isValidUser } from 'src/auth/guard';
import { GetUser } from "../auth/decorator"
import { users as Users } from 'src/model/users.model';

@UseGuards(JwtGuard, isValidUser)
@Controller('users')
export class UserController {

    @Get('me')
    getUsers(@GetUser() user: Users) {
        console.log({user})
        return user;
    }
}
