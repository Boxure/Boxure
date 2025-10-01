import Redis from "ioredis";
import { Client } from "pg";

export const client = new Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});
client.connect();

export const redis = new Redis({
  host: "redis", // use the service name from docker-compose
  port: 6379,
});
