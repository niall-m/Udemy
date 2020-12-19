import { Publisher, Subjects, TicketCreatedEvent } from '@nmgittickets/common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}