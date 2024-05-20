require('dotenv').config();
const knex = require('knex')({
    client: 'mysql',
    connection: {
      host: process.env.HOST,
      user: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME
    }
  });

  module.exports = knex;