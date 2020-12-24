import { Publisher, Subjects, TicketUpdatedEvent } from '@nmgittickets/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}