import { ForbiddenException, HttpCode, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client'
import { JwtService } from '@nestjs/jwt';
import * as argon from 'argon2';

import { UserSigninDto, UserSignupDto } from './dto';
import { ROLES, PRISMA_ERROR_CODES } from '../../config/appConstants.json';
import { emailAlreadyTaken, passwordNotMatched, incorrectCredential } from '../../config/responseMessages/errorMessages.json';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
    constructor( private prisma: PrismaService, private jwt: JwtService, private config: ConfigService ) {}

    async signup(dto: UserSignupDto) {
        try {
            if(dto.password !== dto.confirmPassword) {
                throw new HttpException( passwordNotMatched , HttpStatus.BAD_REQUEST);
            }
            
            const hashPassword = await argon.hash(dto.password);

            const user = await this.prisma.user.create({
                data: {
                    firstName: dto.email,
                    lastName: dto.lastName, 
                    email: dto.email,
                    hashPassword,
                    role: dto.role ? ROLES[dto.role.toUpperCase()] : ROLES.USER
                }
            });
    
            return this.signToken(user.id, user.email);
        } catch (error) {
            if(error instanceof Prisma.PrismaClientKnownRequestError) {
                if(error.code === PRISMA_ERROR_CODES.DUPLICATE_ENTRY) {
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

        return this.signToken(user.id, user.email);
    }

    async signToken( userId: number, email: string): Promise<{ access_token: string }> {
        const payload = {
            sub: userId,
            email
        };
    
        const jwtSecret = this.config.get("TOKEN_SECRET") || "VZEB64KASOf20splwZKPrqPay4oY9kJg";

        const token = await this.jwt.signAsync(payload, {
            expiresIn: '15m',
            secret: jwtSecret
        });

        return {
            access_token: token
        }
    }

}
