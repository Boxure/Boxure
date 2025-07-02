// test/basic.test.js
const request = require('supertest');
const app = require('../app');

jest.mock('pg', () => {
  const mClient = {
    connect: jest.fn(),
    query: jest.fn().mockResolvedValue({ rows: [] }),
  };
  return { Client: jest.fn(() => mClient) };
});
