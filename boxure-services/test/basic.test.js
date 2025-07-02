// test/basic.test.js
const request = require('supertest');
const app = require('../app');

describe.skip('GET /api/items', () => {
  it('should return 200', async () => {
    const res = await request(app).get('/api/items');
    expect(res.statusCode).toBe(200);
  });
});
