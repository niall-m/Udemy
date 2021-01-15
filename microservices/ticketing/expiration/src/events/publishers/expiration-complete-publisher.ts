import { Publisher, ExpirationCompleteEvent, Subjects } from '@nmgittickets/common';

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  readonly subject = Subjects.ExpirationComplete;
}