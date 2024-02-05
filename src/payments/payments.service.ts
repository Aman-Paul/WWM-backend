import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { ENV_KEYS } from '../../config/appConstants.json';
import { PaymentRequestBodyDto } from './dto';
 
@Injectable()
export class PaymentsService {
    private stripe;

    constructor(private config: ConfigService) {
        this.stripe = new Stripe(this.config.get(ENV_KEYS.STRIPE_SECRET_KEY));
    }

    createPayment(paymentRequestBody: PaymentRequestBodyDto): Promise<any> {
        try {
            let sumAmount = 0;
            paymentRequestBody.products.forEach((product) => {
                sumAmount = sumAmount + product.price * product.quantity;
            });
    
            return this.stripe.paymentIntents.create({
                amount: sumAmount * 100,
                currency: paymentRequestBody.currency,
                description:  `Order ${paymentRequestBody.orderId}`,
                receipt_email: "janedoe@gmail.com"
            })
        } catch (error) {
            console.log("Error in createPayment service:", error);
        }

    };

    getSuccessFromWebhook(dto: any){
        try {
            switch(dto.type) {
                case 'payment_intent.succeeded': {
                    const email = dto['data']['object']['receipt_email'];
                    console.log('Payment intent was successful for the user1', email);
                    break;
                }

                default:
                    throw new HttpException("Not payment webhook", HttpStatus.BAD_REQUEST);
            }
            
        } catch (error) {
            console.log("Error in getSuccessFromWebhook service:", error);
        }
    }
}
