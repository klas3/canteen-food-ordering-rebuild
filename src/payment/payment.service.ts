import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto-js';
import Order from '../entity/Order';

@Injectable()
class PaymentService {
  async getData(order: Order): Promise<string> {
    const data = {
      action: 'pay',
      amount: order.totalSum.toString(),
      description: `Оплата замовлення №${order.id}`,
      version: '3',
      order_Id: order.id.toString(),
      currency: 'UAH',
      public_key: process.env.PUBLIC_KEY,
      server_url: `${process.env.PAYMENT_RESPONSE_URL}${order.id}`,
    };
    return Buffer.from(JSON.stringify(data)).toString('base64');
  }

  async getSignature(data: string): Promise<string> {
    const signature = `${process.env.PRIVATE_KEY}${data}${process.env.PRIVATE_KEY}`;
    return Buffer.from(crypto.SHA1(signature).toString()).toString('base64');
  }
}

export default PaymentService;
