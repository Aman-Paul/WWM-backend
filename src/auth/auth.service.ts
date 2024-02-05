import { ForbiddenException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client'
import { JwtService } from '@nestjs/jwt';
import * as argon from 'argon2';

import { UserSigninDto, UserSignupDto } from './dto';
import { PRISMA_ERROR_CODES, ENV_KEYS } from '../../config/appConstants.json';
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

            let data = {
                firstName: dto.email,
                lastName: dto.lastName, 
                email: dto.email,
                hashPassword,
                roleId: dto.roleId,
                nationality: dto.nationality,
            }

            const user = await this.prisma.user.create({
                data
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

        if(!user.isActive) {
            return {  message: 'Account is not active' };
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
    
        const jwtSecret = this.config.get(ENV_KEYS.TOKEN_SECRET) || this.config.get(ENV_KEYS.TEST_JWT_SECRET);

        const token = await this.jwt.signAsync(payload, {
            expiresIn: '15m',
            secret: jwtSecret
        });

        return {
            access_token: token
        }
    }

}
