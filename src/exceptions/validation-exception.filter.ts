import { ArgumentsHost, Catch, ExceptionFilter, BadRequestException } from '@nestjs/common';
import { errorMessages }  from "../config/responseMessages/errorMessages.json";

@Catch(BadRequestException)
export class ValidationExceptionFilter implements ExceptionFilter {
  catch(exception: BadRequestException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    var message = !!exception['response'] && exception['response'].message.length > 0 ? exception['response'].message[0] : errorMessages.serverError;
    const errorResponse = { 
        message,
        success: false,
        statusCode: 400,
    };
    response.status(400).json(errorResponse);
  }
}
