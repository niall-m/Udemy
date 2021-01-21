it('uses env variable for test', () => {
  expect(process.env.STRIPE_KEY).toBeDefined();
});