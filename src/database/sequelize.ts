import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import modelDefinitions from './models';
import fs from 'fs';

dotenv.config();

const {
  NODE_ENV,
  DB_HOST,
  DB_USER,
  DB_PASSWORD,
  DB_NAME,
  DB_PORT,
  DB_SSL_CA = '',
} = process.env;

const isProduction = NODE_ENV === 'production';

export const sequelize = isProduction
  ? new Sequelize(DB_NAME!, DB_USER!, DB_PASSWORD!, {
      host: DB_HOST,
      dialect: 'mysql',
      port: Number(DB_PORT),
      dialectOptions: {
        ssl: {
          ca: fs.readFileSync(DB_SSL_CA as string),
        },
      },
      logging: false,
    })
  : new Sequelize(DB_NAME!, DB_USER!, DB_PASSWORD!, {
      host: DB_HOST,
      dialect: 'mysql',
      port: Number(DB_PORT),
      logging: false,
    });

// Initialize models
modelDefinitions.forEach((definition) => {
  definition.init(sequelize);
});

// Setup associations
modelDefinitions.forEach((definition) => {
  definition.associate?.(sequelize.models);
});
