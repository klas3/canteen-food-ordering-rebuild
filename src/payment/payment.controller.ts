import { Controller, Param, Post, Body, ForbiddenException, NotFoundException, Get } from '@nestjs/common';
import { OrderService } from '../order/order.service';
import { PaymentService } from './payment.service';
import { Authorize } from '../auth/auth.decorators';

@Controller('payment')
export class PaymentController {
  constructor(
    private orderService: OrderService,
    private paymentService: PaymentService,
  ) {}

  @Authorize()
  @Get('getData/:orderId')
  async getPaymentData(@Param('orderId') id: number): Promise<{ data: string, signature: string }> {
    const order = await this.orderService.getById(id);
    if (!order) {
      throw new NotFoundException();
    }
    const data = await this.paymentService.getData(order);
    return {
      data: data,
      signature: await this.paymentService.getSignature(data),
    };
  }

  @Post('payForOrder/:orderId')
  async pay(
    @Param('orderId') id: number,
    @Body('signature') signature: string,
    @Body('data') data: string,
  ): Promise<void> {
    signature = signature.replace(' ', '+');
    if (signature !== await this.paymentService.getSignature(data)) {
      throw new ForbiddenException();
    }
    if ((JSON.parse(Buffer.from(data, 'base64').toString())).Status !== 'success') {
      throw new ForbiddenException();
    }
    const order = await this.orderService.getById(id);
    if (!order) {
      throw new NotFoundException();
    }
    return await this.orderService.confirmPayment(order);
  }
}
