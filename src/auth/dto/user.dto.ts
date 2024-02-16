import { IsEmail, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, Min, MinLength } from "class-validator";
import * as errorMessages  from "../../config/responseMessages/errorMessages.json";
export class UserSignupDto {
    @IsString()
    @IsNotEmpty({ message: errorMessages.firstNameRequired })
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

    @IsString()
    @IsOptional()
    nationality: string;

    @IsString()
    @IsOptional()
    roleId?: number;

    @IsNumber()
    @IsOptional()
    @MinLength(0)
    @MaxLength(100)
    refundable_percentage?: string;

    @IsString()
    @IsOptional()
    intro_link?: string;
}

export class UserSigninDto {

    @IsEmail()
    @IsNotEmpty()
    email: string

    @IsString()
    @IsNotEmpty()
    password: string
}

export class ForgetPasswordDto {

    @IsEmail()
    @IsNotEmpty()
    email: string

    @IsString()
    @IsNotEmpty()
    password: string

    @IsString()
    @IsNotEmpty()
    confirmPassword: string;
}