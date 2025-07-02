/* Mock the pg module
jest.mock('pg', () => {
  const mClient = {
    connect: jest.fn().mockResolvedValue(), // important!
    query: jest.fn().mockResolvedValue({ rows: [] }),
  };
  return { Client: jest.fn(() => mClient) };
});

const request = require('supertest');
const app = require('../app'); // app.js must export the Express app

describe('GET /api/items', () => {
  it('should return 200 and an empty array', async () => {
    const res = await request(app).get('/api/items');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([]); // matches mocked rows
  });
});

afterAll(() => {
  jest.resetAllMocks();
});
*/