import { HttpException, HttpStatus, Injectable, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon from 'argon2';

import { ForgetPasswordDto, UserSigninDto, UserSignupDto } from './dto';
import  * as errorMessages  from "../config/responseMessages/errorMessages.json";
import { passwordChangedSuccessfully } from "../config/responseMessages/successMessages.json";
import { ConfigService } from '@nestjs/config';
import { users } from '../model/users.model';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class AuthService {
    constructor(private jwt: JwtService, private config: ConfigService, @InjectModel(users)
    private Users: typeof users) { }

    async signup(dto: UserSignupDto) {
        try {
            if (dto.password !== dto.confirmPassword) {
                throw new HttpException(errorMessages.passwordNotMatched, HttpStatus.BAD_REQUEST);
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

            const user = await this.Users.create(data);

            return this.signToken(user.id, user.email);
        } catch (error) {
            console.log("Error in auth:signup service", error);
            throw error;
        }
    }

    async signin(dto: UserSigninDto) {
        try {
            const user = await this.Users.findOne({
                where: {
                    email: dto.email 
                }
            });

            if (!user) {
                throw new BadRequestException(errorMessages.incorrectCredential);
            }

            if (!user.isActive) {
                return { message: 'Account is not active' };
            }

            const pwMatches = await argon.verify(user.hashPassword, dto.password);
            if (!pwMatches) {
                throw new BadRequestException(errorMessages.incorrectCredential);
            }

            return this.signToken(user.id, user.email);
        } catch (error) {
            console.log("Error in auth:signin service", error);
            throw error;
        }
    }

    async signToken(userId: number, email: string): Promise<{ access_token: string }> {
        try {
            const payload = {
                sub: userId,
                email
            };

            const token = await this.jwt.signAsync(payload);

            return {
                access_token: token
            }
        } catch (error) {
            console.error("Error in auth:signToken service function", error);
        }
    }

    async forgetPassword(dto: ForgetPasswordDto) {
        try {
            const userFromDb = await this.Users.findOne({
                where: {
                    email: dto.email
                }
            });

            if (!userFromDb) {
                throw new HttpException(errorMessages.userNotFound, HttpStatus.NOT_FOUND);
            }

            if (dto.confirmPassword !== dto.password) {
                throw new HttpException(errorMessages.passwordNotMatched, HttpStatus.BAD_REQUEST);
            }

            const hashPassword = await argon.hash(dto.password);
            await this.Users.update({ hashPassword: hashPassword }, {
                where: {
                    email: dto.email,
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
