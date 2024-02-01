import { ForbiddenException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserSigninDto, UserSignupDto } from './dto';
import { Prisma } from '@prisma/client'

import * as argon from 'argon2';
import * as appConstants from '../../config/appConstants.json';

import { emailAlreadyTaken, passwordNotMatched, incorrectCredential } from '../../config/responseMessages/errorMessages.json';

@Injectable()
export class AuthService {
    constructor( private prisma: PrismaService ) {}

    async signup(dto: UserSignupDto) {
        try {
            if(dto.password !== dto.confirmPassword) {
                throw new HttpException( passwordNotMatched , HttpStatus.BAD_REQUEST);
            }
            
            // generate the password hash
            const hashPassword = await argon.hash(dto.password);

            // Create new user
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

    async signin(dto: UserSigninDto) {

        // find the user
        const user = await this.prisma.user.findUnique({
            where: {
                email: dto.email
            }
        });

        if(!user) {
            throw new ForbiddenException(incorrectCredential);
        }

        const pwMatches = await argon.verify(user.hashPassword, dto.password);
        if(!pwMatches) {
            throw new ForbiddenException(incorrectCredential);
        }

        return user;
    }

}
