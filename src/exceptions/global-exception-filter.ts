import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpStatus,
    HttpException,
    NotFoundException,
    UnauthorizedException,
    BadRequestException,
    ForbiddenException,
    ServiceUnavailableException
  } from '@nestjs/common';
  import { Response } from 'express';
  import { errorMessages }  from "../config/responseMessages/errorMessages.json";

  @Catch()
  export class GlobalExceptionFilter implements ExceptionFilter {
    catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        var message = "";
        const status = !!exception.status ? exception.status : HttpStatus.INTERNAL_SERVER_ERROR

        if(exception instanceof BadRequestException){
            message = !!exception['response'] && !!exception['response'].message && Array.isArray(exception['response'].message) ? exception['response'].message[0] : exception['response'].message;
        } else if(exception instanceof UnauthorizedException ){
            message = errorMessages.unAuthorized;
        } else if(exception instanceof ForbiddenException ){
            message = errorMessages.forbiddenException;
        } else if(exception instanceof NotFoundException ){
            message = errorMessages.resourcesNotFound;
        } else if(exception instanceof ServiceUnavailableException ){
            message = errorMessages.serverUnavailable;
        } else if(exception instanceof HttpException ){
            message = errorMessages.serverError;
        }  else {
            message = errorMessages.serverError;
        }
    
        response.status(status).json({
            message,
            success: false,
            statusCode: status,
        });

        console.error(exception.stack);
    }
}
  