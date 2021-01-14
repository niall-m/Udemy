import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { OrderCreatedEvent, OrderStatus } from '@nmgittickets/common';
import { OrderCreatedListener } from '../order-created-listener';
import { natsWrapper } from '../../../nats-wrapper';
import { Ticket } from '../../../models/ticket';

const setup = async () => {
  // create instance of listener
  const listener = new OrderCreatedListener(natsWrapper.client);

  // create and save a ticket
  const ticket = Ticket.build({
    title: 'concerto',
    price: 20,
    userId: 'abc123'
  });
  await ticket.save();

  // create fake data event and msg object
  const data: OrderCreatedEvent['data'] = {
    id: mongoose.Types.ObjectId().toHexString(),
    version: 0,
    status: OrderStatus.Created,
    userId: 'asdf',
    expiresAt: 'asdafasdf',
    ticket: {
        id: ticket.id,
        price: ticket.price
    }
  }

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn()
  }

  return { listener, ticket, data, msg };
};

it('sets the userId of the ticket', async () => {
  const { listener, ticket, data, msg } = await setup();

  await listener.onMessage(data, msg);

  const updatedTicket = await Ticket.findById(ticket.id);

  expect(updatedTicket!.orderId).toEqual(data.id);
});

it('acks the message', async () => {
  const { listener, data, msg } = await setup();
  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});