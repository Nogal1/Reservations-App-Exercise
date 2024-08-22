const db = require('../db');
const Customer = require('../models/customer');

afterAll(async () => {
  await db.end();
});

test('can get all customers', async () => {
  const customers = await Customer.all();
  expect(customers.length).toBeGreaterThan(0);
});

test('can save a new customer', async () => {
  const customer = new Customer({ firstName: 'Test', lastName: 'User', notes:''});
  await customer.save();
  expect(customer.id).toBeDefined();
});
