import { Ticket } from '../ticket';

it('implements optimistic concurrency control', async (done) => {
  // Create an instance of a ticket and save to db
  const ticket = Ticket.build({
    title: 'concerto',
    price: 50,
    userId: '1234'
  });

  await ticket.save();

  // fetch the ticket twice
  const firstInstance = await Ticket.findById(ticket.id);
  const secondInstance = await Ticket.findById(ticket.id);

  // make two separate changes to each ticket fetched
  firstInstance!.set({ price: 40 });
  secondInstance!.set({ price: 30 });

  // save the first fetched ticket
  await firstInstance!.save();

  // save the second fetched ticket and expect an error

  // expect(async () => {
  //   await secondInstance!.save();
  // });

  try {
    await secondInstance!.save();
  } catch (err) {
    return done();
  }

  throw new Error('should not reach this point');
});

it('increments the version number on multiple saves', async () => {
  const ticket = Ticket.build({
    title: 'concerto',
    price: 30,
    userId: '123'
  });

  await ticket.save();
  expect(ticket.version).toEqual(0);
  await ticket.save();
  expect(ticket.version).toEqual(1);
  await ticket.save();
  expect(ticket.version).toEqual(2);
});