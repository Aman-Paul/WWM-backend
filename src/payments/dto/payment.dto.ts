import { Product } from "./product.dto";

export interface PaymentRequestBodyDto {
    orderId: string
    products: Product[]
    currency:  string
}