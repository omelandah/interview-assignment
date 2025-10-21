require('dotenv').config();
const fs = require('fs');

module.exports = {
  development: {
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'my_password',
    database: process.env.DB_NAME || 'my_databse',
    host: process.env.DB_HOST || 'db',
    port: Number(process.env.DB_PORT) || 3306,
    dialect: 'mysql',
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mysql',
    dialectOptions: process.env.DB_SSL_CA
      ? {
          ssl: {
            ca: fs.readFileSync(process.env.DB_SSL_CA),
          },
        }
      : {},
  },
};
