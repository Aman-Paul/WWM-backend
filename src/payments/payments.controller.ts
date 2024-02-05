import { Body, Controller, HttpException, HttpStatus, Post, Res } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentRequestBodyDto } from './dto';
import { Response } from 'express';

@Controller('payments')
export class PaymentsController {
    constructor(private paymentService: PaymentsService) {}

    @Post('create')
    async createPayments(@Res() response: Response, @Body() paymentRequestBody: PaymentRequestBodyDto) {
        try {
            this.paymentService
                .createPayment(paymentRequestBody)
                .then((res) => {
                    response.status(HttpStatus.CREATED).json(res);
                })
                .catch(err => {
                    response.status(HttpStatus.BAD_REQUEST).json(err);
                })
        } catch (error) {
            console.error("Error in payments controller:", error);
        }
    };
    
    @Post("webhook")
    async getSuccessFromWebhook(@Body() dto) {
        return this.paymentService.getSuccessFromWebhook(dto);
    }
}