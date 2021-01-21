import { Publisher, PaymentCreatedEvent, Subjects } from '@nmgittickets/common';

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
}