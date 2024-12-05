import { Controller } from '@nestjs/common';

@Controller({
  version: '1',
  path: 'payment',
})
export class PaymentController {
  constructor() {}
}
