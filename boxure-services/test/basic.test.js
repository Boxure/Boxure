// ✅ Mock the pg client to prevent real DB calls
jest.mock('pg', () => {
  const mClient = {
    connect: jest.fn(),
    query: jest.fn().mockResolvedValue({ rows: [] }), // mock any SELECT, etc.
  };
  return { Client: jest.fn(() => mClient) };
});

const request = require('supertest');
const app = require('../app'); // your Express app

describe('GET /api/items', () => {
  it('should return 200', async () => {
    const res = await request(app).get('/api/items');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([]); // since we mocked rows: []
  });
});
