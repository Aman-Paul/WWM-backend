import { ForbiddenException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client'
import { JwtService } from '@nestjs/jwt';
import * as argon from 'argon2';

import { ForgetPasswordDto, UserSigninDto, UserSignupDto } from './dto';
import { PRISMA_ERROR_CODES, ENV_KEYS } from '../../config/appConstants.json';
import { userNotFound } from "../../config/responseMessages/errorMessages.json";
import { passwordChangedSuccessfully } from "../../config/responseMessages/successMessages.json";
import { emailAlreadyTaken, passwordNotMatched, incorrectCredential } from '../../config/responseMessages/errorMessages.json';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
    constructor( private prisma: PrismaService, private jwt: JwtService, private config: ConfigService ) {}

    async signup(dto: UserSignupDto) {
        try {
            if(dto.password !== dto.confirmPassword) {
                throw new HttpException(passwordNotMatched , HttpStatus.BAD_REQUEST);
            }
            
            const hashPassword = await argon.hash(dto.password);

            let data = {
                firstName: dto.firstName,
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

            console.log("Error in auth:signup service", error);
            throw error;
        }
    }

    async signin(dto: UserSigninDto) {
        try {
            const user = await this.prisma.user.findUnique({
                where: {
                    email: dto.email
                }
            });

            if (!user) {
                throw new ForbiddenException(incorrectCredential);
            }

            if (!user.isActive) {
                return { message: 'Account is not active' };
            }

            const pwMatches = await argon.verify(user.hashPassword, dto.password);
            if (!pwMatches) {
                throw new ForbiddenException(incorrectCredential);
            }

            return this.signToken(user.id, user.email);
        } catch (error) {
            console.log("Error in auth:signin service", error);
            throw error;
        }
    }

    async signToken( userId: number, email: string): Promise<{ access_token: string }> {
        try {     
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
        } catch (error) {
            console.error("Error in auth:signToken service function", error);
        }
    }

    async forgetPassword(dto: ForgetPasswordDto) {
        try {
            const userFromDb = await this.prisma.user.findUnique({
                where: {
                    email: dto.email
                }
            });

            if (!userFromDb) {
                throw new HttpException(userNotFound, HttpStatus.NOT_FOUND);
            }

            if(dto.confirmPassword !== dto.password) {
                throw new HttpException(passwordNotMatched , HttpStatus.BAD_REQUEST);
            }

            const hashPassword = await argon.hash(dto.password);
            await this.prisma.user.update({
                where: {
                    email: dto.email,
                },
                data: {
                    hashPassword: hashPassword
                }
            });

            return {
                success: true,
                message: passwordChangedSuccessfully
            }           
        } catch (error) {
            console.log("Errot in auth:forgetPassword service:", error);
            throw error;
        }
    } 

}
