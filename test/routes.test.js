const request = require('supertest');
const app = require('../app');
const db = require('../db');

afterAll(async () => {
  await db.end();
});

test('should return a list of customers on the homepage', async () => {
  const response = await request(app).get('/');
  expect(response.statusCode).toBe(200);
  expect(response.text).toContain('Customers');
});

test('should add a new customer', async () => {
  const response = await request(app)
    .post('/add')
    .send({ firstName: 'Test', lastName: 'User' });
  expect(response.statusCode).toBe(302);
});
