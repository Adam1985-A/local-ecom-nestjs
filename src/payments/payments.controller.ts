import { Controller, Get, Param, ParseUUIDPipe, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PaymentsService } from './payments.service.js';
import { CurrentUser } from '../common/decorator/current-user.decorator.js';
import { Public } from '../common/decorator/public.decorator.js';
import { User } from '../users/user.entity.js';

@ApiTags('Payments')
@ApiBearerAuth() 
@Controller('payments')

export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('order/:orderId/initiate') 
  initiatePayment(@Param('orderId', ParseUUIDPipe) orderId: string,
   @CurrentUser() user: User) { 
    return this.paymentsService.initiatePayment(orderId, user);
   }

  @Get('order/:orderId') 
  findByOrder(@Param('orderId', ParseUUIDPipe) orderId: string) {
     return this.paymentsService.findByOrder(orderId);
     }

  @Get('verify/:reference')
   verify(@Param('reference') reference: string) {
     return this.paymentsService.verifyAndUpdate(reference);
     }

  @Public()
   @Get('paystack/callback') 
   async paystackCallback(@Query('reference') reference: string) {
     await this.paymentsService.handlePaystackCallback(reference); 
     return { message: 'Payment verified' };
     }
}
