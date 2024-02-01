import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, Matches, MaxLength, MinLength } from "class-validator";
import * as appConstants from '../../../config/appConstants.json';

export class UserSignupDto {
    @IsString()
    @IsNotEmpty()
    firstName: string;

    @IsString()
    @IsOptional()
    lastName?: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(4)
    @MaxLength(20)
    password: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(4)
    @MaxLength(20)
    confirmPassword: string;

    @IsEnum([appConstants.ROLES.ADMIN, appConstants.ROLES.CONSULTANT, appConstants.ROLES.SUPERADMIN, appConstants.ROLES.USER])
    @IsOptional()
    role?: string;
}

export class UserSigninDto {

    @IsEmail()
    @IsNotEmpty()
    email: string

    @IsString()
    @IsNotEmpty()
    password: string
}