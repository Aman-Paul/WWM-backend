import { ForbiddenException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserSignupDto } from './dto';
import { Prisma } from '@prisma/client'

import * as argon from 'argon2';
import * as appConstants from '../../config/appConstants.json';

import { emailAlreadyTaken, passwordNotMatched } from '../../config/responseMessages/errorMessages.json';

@Injectable()
export class AuthService {
    constructor( private prisma: PrismaService ) {}

    async signup(dto: UserSignupDto) {
        if(dto.password !== dto.confirmPassword) {
            throw new HttpException( passwordNotMatched , HttpStatus.BAD_REQUEST);
        }
        
        // generate the password hash
        const hashPassword = await argon.hash(dto.password);
        try {
            const user = await this.prisma.user.create({
                data: {
                    firstName: dto.email,
                    lastName: dto.lastName, 
                    email: dto.email,
                    hashPassword,
                    role: dto.role ? appConstants.ROLES[dto.role.toUpperCase()] : appConstants.ROLES.USER
                }
            });
    
            return user;
        } catch (error) {
            if(error instanceof Prisma.PrismaClientKnownRequestError) {
                if(error.code === appConstants.PRISMA_ERROR_CODES.DUPLICATE_ENTRY) {
                    throw new ForbiddenException( emailAlreadyTaken );
                }
            }

            throw error;
        }
    }

    signin() {

        return { msg: 'I am signedIn' };
    }

}
