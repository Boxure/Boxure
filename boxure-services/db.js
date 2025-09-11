const { Client } = require('pg');
const Redis = require('ioredis');

const client = new Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});
client.connect();

const redis = new Redis({
  host: 'redis', // use the service name from docker-compose
  port: 6379
});

module.exports = { client, redis };