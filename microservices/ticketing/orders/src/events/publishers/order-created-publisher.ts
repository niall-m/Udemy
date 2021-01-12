import { Publisher, OrderCreatedEvent, Subjects } from '@nmgittickets/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
}