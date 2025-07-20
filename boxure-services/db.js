const { Client } = require('pg');
const client = new Client({
  user: 'postgres',
  host: 'db',
  database: 'test_db',
  password: 'yourpassword',
  port: 5432,
});
client.connect();
module.exports = client;
