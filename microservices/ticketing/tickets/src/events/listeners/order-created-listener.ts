import { Message } from 'node-nats-streaming';
import { Listener, OrderCreatedEvent, Subjects } from '@nmgittickets/common';
import { queueGroupName } from './queue-group-name';
import { Ticket } from '../../models/ticket';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    // Find the ticket that the order is reserving
    const ticket = await Ticket.findById(data.ticket.id);
    
    // If not found, throw error 
    if (!ticket) {
      throw new Error('Ticket not found');
    }

    // Mark ticket as reserved by setting orderId prop
    ticket.set({ orderId: data.id });

    // Save the ticket
    await ticket.save();

    // ack the message
    msg.ack();
  }
}