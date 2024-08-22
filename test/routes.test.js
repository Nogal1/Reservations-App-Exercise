const request = require('supertest');
const app = require('../app');
const db = require('../db');

afterAll(async () => {
  await db.end();  // Ensure the database connection is closed after tests
});

describe('Customer Routes', () => {
  test('should return a list of customers on the homepage', async () => {
    const response = await request(app).get('/');
    expect(response.statusCode).toBe(200);
    expect(response.text).toContain('Customers');
  });

  test('should search for customers by name', async () => {
    const response = await request(app).get('/customers/search?q=Test');
    expect(response.statusCode).toBe(200);
    expect(response.text).toContain('Test');
  });
});
